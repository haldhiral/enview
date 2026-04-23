import { Head, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Bell,
    CheckCircle2,
    MonitorCheck,
    MonitorOff,
    ShieldAlert,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { DashboardHeader } from '@/components/endview/dashboard-header';
import { DeviceDetailModal } from '@/components/endview/device-detail-modal';
import { DeviceFilters } from '@/components/endview/device-filters';
import { DeviceMonitoringList } from '@/components/endview/device-monitoring-list';
import { EmptyState } from '@/components/endview/empty-state';
import { MiniBarChart } from '@/components/endview/mini-bar-chart';
import { SectionPanel } from '@/components/endview/section-panel';
import { SeverityBadge } from '@/components/endview/severity-badge';
import { StatusBadge } from '@/components/endview/status-badge';
import { SummaryCard } from '@/components/endview/summary-card';
import { Button } from '@/components/ui/button';
import {
    cleanParams,
    formatDateTime,
    formatPercent,
    formatRelative,
} from '@/lib/endview';
import { modalDetail } from '@/actions/App/Http/Controllers/EndView/DeviceController';
import { dashboard } from '@/routes';
import type {
    AlertItem,
    CheckinItem,
    DeviceFilterOptions,
    DeviceFilters as DeviceFiltersType,
    DeviceListItem,
    DeviceModalDetail,
    EventLogItem,
    MetricTrend,
    Paginated,
} from '@/types';

type DashboardSummary = {
    total_devices: number;
    online_devices: number;
    offline_devices: number;
    warning_devices: number;
    critical_devices: number;
    open_alerts: number;
    acknowledged_alerts: number;
    resolved_alerts: number;
};

type StatusBreakdown = {
    status_code: string;
    status_name: string;
    count: number;
};

type DashboardProps = {
    last_updated_at: string | null;
    summary: DashboardSummary;
    status_breakdown: StatusBreakdown[];
    recent_alerts: AlertItem[];
    latest_checkins: CheckinItem[];
    recent_events: EventLogItem[];
    metric_trends: MetricTrend[];
    devices: Paginated<DeviceListItem>;
    filters: DeviceFiltersType;
    options: DeviceFilterOptions;
};

export default function Dashboard({
    last_updated_at,
    summary,
    status_breakdown,
    recent_alerts,
    latest_checkins,
    recent_events,
    metric_trends,
    devices,
    filters,
    options,
}: DashboardProps) {
    const [refreshing, setRefreshing] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] =
        useState<DeviceListItem | null>(null);
    const [deviceDetail, setDeviceDetail] =
        useState<DeviceModalDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState<string | null>(null);

    const refreshDashboard = () => {
        setRefreshing(true);
        router.reload({
            preserveScroll: true,
            onFinish: () => setRefreshing(false),
        });
    };

    const applyFilters = (
        values: Record<string, string | number | boolean | null | undefined>,
    ) => {
        router.get(
            dashboard.url(),
            cleanParams({
                ...values,
                sort_by: filters.sort_by,
                sort_direction: filters.sort_direction,
            }),
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const clearFilters = () => {
        router.get(dashboard.url(), {}, { preserveScroll: true, replace: true });
    };

    const sortDevices = (
        key:
            | 'device_name'
            | 'company'
            | 'site'
            | 'device_type'
            | 'os_name'
            | 'status_code'
            | 'health_score'
            | 'last_checkin_at',
    ) => {
        const direction =
            filters.sort_by === key && filters.sort_direction === 'asc'
                ? 'desc'
                : 'asc';

        router.get(
            dashboard.url(),
            cleanParams({
                ...filters,
                sort_by: key,
                sort_direction: direction,
            }),
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const loadDeviceDetail = useCallback(async (device: DeviceListItem) => {
        setSelectedDevice(device);
        setDeviceDetail(null);
        setDetailError(null);
        setDetailLoading(true);

        try {
            const response = await fetch(modalDetail.url(device.id), {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error('The device detail endpoint did not respond.');
            }

            setDeviceDetail((await response.json()) as DeviceModalDetail);
        } catch (error) {
            setDetailError(
                error instanceof Error
                    ? error.message
                    : 'Unable to load device detail.',
            );
        } finally {
            setDetailLoading(false);
        }
    }, []);

    const openDeviceDetail = (device: DeviceListItem) => {
        setModalOpen(true);
        void loadDeviceDetail(device);
    };

    const closeDeviceDetail = (open: boolean) => {
        setModalOpen(open);

        if (!open) {
            setSelectedDevice(null);
            setDeviceDetail(null);
            setDetailError(null);
        }
    };

    return (
        <>
            <Head title="EndView Dashboard" />

            <div className="flex flex-1 flex-col gap-5 bg-muted/20 p-4 sm:p-6 lg:p-8">
                <DashboardHeader
                    totalDevices={summary.total_devices}
                    openAlerts={summary.open_alerts}
                    lastUpdatedAt={last_updated_at}
                    refreshing={refreshing}
                    onRefresh={refreshDashboard}
                />

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
                    <SummaryCard
                        title="Total devices"
                        value={summary.total_devices}
                        icon={MonitorCheck}
                    />
                    <SummaryCard
                        title="Online"
                        value={summary.online_devices}
                        icon={CheckCircle2}
                        tone="green"
                    />
                    <SummaryCard
                        title="Offline"
                        value={summary.offline_devices}
                        icon={MonitorOff}
                    />
                    <SummaryCard
                        title="Warning"
                        value={summary.warning_devices}
                        icon={AlertTriangle}
                        tone="amber"
                    />
                    <SummaryCard
                        title="Critical"
                        value={summary.critical_devices}
                        icon={ShieldAlert}
                        tone="red"
                    />
                    <SummaryCard
                        title="Open alerts"
                        value={summary.open_alerts}
                        icon={Bell}
                        tone="red"
                    />
                </div>

                <DeviceFilters
                    filters={filters}
                    options={options}
                    onApply={applyFilters}
                    onClear={clearFilters}
                />

                <DeviceMonitoringList
                    devices={devices}
                    filters={filters}
                    onSort={sortDevices}
                    onSelectDevice={openDeviceDetail}
                />

                <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <SectionPanel
                        title="Fleet Status"
                        description="Current status distribution across monitored devices."
                    >
                        <StatusBreakdownPanel rows={status_breakdown} />
                    </SectionPanel>

                    <SectionPanel
                        title="Metric Trend"
                        description="Daily average utilization from recent snapshots."
                    >
                        <div className="grid gap-4 md:grid-cols-3">
                            <TrendCard
                                label="CPU"
                                color="bg-emerald-500"
                                points={metric_trends.map((point) => ({
                                    label: point.label.slice(5),
                                    value: point.cpu_usage_percent,
                                }))}
                            />
                            <TrendCard
                                label="RAM"
                                color="bg-amber-500"
                                points={metric_trends.map((point) => ({
                                    label: point.label.slice(5),
                                    value: point.ram_usage_percent,
                                }))}
                            />
                            <TrendCard
                                label="Storage"
                                color="bg-red-500"
                                points={metric_trends.map((point) => ({
                                    label: point.label.slice(5),
                                    value: point.storage_usage_percent,
                                }))}
                            />
                        </div>
                    </SectionPanel>
                </div>

                <div className="grid gap-5 xl:grid-cols-3">
                    <RecentAlertsPanel rows={recent_alerts} />
                    <LatestCheckinsPanel rows={latest_checkins} />
                    <RecentEventsPanel rows={recent_events} />
                </div>
            </div>

            <DeviceDetailModal
                open={modalOpen}
                device={selectedDevice}
                detail={deviceDetail}
                loading={detailLoading}
                error={detailError}
                onRetry={() => {
                    if (selectedDevice) {
                        void loadDeviceDetail(selectedDevice);
                    }
                }}
                onOpenChange={closeDeviceDetail}
            />
        </>
    );
}

function StatusBreakdownPanel({ rows }: { rows: StatusBreakdown[] }) {
    const maxStatus = Math.max(1, ...rows.map((status) => status.count));

    if (rows.length === 0) {
        return <EmptyState title="No status data available" />;
    }

    return (
        <div className="space-y-4">
            {rows.map((status) => (
                <div key={status.status_code}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                            <StatusBadge status={status.status_code} />
                            <span className="truncate text-sm font-medium">
                                {status.status_name}
                            </span>
                        </div>
                        <span className="text-sm font-semibold">
                            {status.count}
                        </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{
                                width: `${(status.count / maxStatus) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

function TrendCard({
    label,
    points,
    color,
}: {
    label: string;
    points: { label: string; value: number | null | undefined }[];
    color: string;
}) {
    const latest = points.at(-1)?.value;

    return (
        <div className="rounded-xl border bg-background p-4 shadow-xs">
            <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">{label}</span>
                <span className="text-sm font-medium text-muted-foreground">
                    {formatPercent(latest)}
                </span>
            </div>
            <MiniBarChart points={points} color={color} />
        </div>
    );
}

function RecentAlertsPanel({ rows }: { rows: AlertItem[] }) {
    return (
        <SectionPanel
            title="Recent Alerts"
            description="Latest opened alerts across the fleet."
        >
            {rows.length === 0 ? (
                <EmptyState title="No recent alerts" />
            ) : (
                <div className="space-y-3">
                    {rows.slice(0, 6).map((alert) => (
                        <div
                            key={alert.id}
                            className="rounded-xl border bg-background p-3 shadow-xs"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="truncate text-sm font-semibold">
                                        {alert.alert_name}
                                    </div>
                                    <div className="mt-1 text-xs text-muted-foreground">
                                        {alert.device?.hostname ?? 'Unknown device'} ·{' '}
                                        {formatRelative(alert.opened_at)}
                                    </div>
                                </div>
                                <SeverityBadge
                                    severity={alert.severity_code}
                                />
                            </div>
                            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                {alert.alert_message}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </SectionPanel>
    );
}

function LatestCheckinsPanel({ rows }: { rows: CheckinItem[] }) {
    return (
        <SectionPanel
            title="Latest Check-ins"
            description="Most recent heartbeat records."
        >
            {rows.length === 0 ? (
                <EmptyState title="No check-ins yet" />
            ) : (
                <div className="space-y-3">
                    {rows.slice(0, 6).map((checkin) => (
                        <div
                            key={checkin.id}
                            className="flex items-start justify-between gap-3 rounded-xl border bg-background p-3 shadow-xs"
                        >
                            <div className="min-w-0">
                                <div className="truncate text-sm font-semibold">
                                    {checkin.device?.hostname ?? 'Unknown device'}
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                    {checkin.current_user_name ?? 'No user'} ·{' '}
                                    {checkin.ip_address ?? 'No IP'}
                                </div>
                            </div>
                            <div className="text-right">
                                <StatusBadge status={checkin.status_code} />
                                <div className="mt-1 text-xs text-muted-foreground">
                                    {formatRelative(checkin.checked_in_at)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </SectionPanel>
    );
}

function RecentEventsPanel({ rows }: { rows: EventLogItem[] }) {
    return (
        <SectionPanel
            title="Event Timeline"
            description="Latest endpoint and system events."
        >
            {rows.length === 0 ? (
                <EmptyState title="No recent events" />
            ) : (
                <div className="space-y-3">
                    {rows.slice(0, 6).map((event) => (
                        <div
                            key={event.id}
                            className="rounded-xl border bg-background p-3 shadow-xs"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex min-w-0 flex-wrap items-center gap-2">
                                    <span className="truncate text-sm font-semibold">
                                        {event.event_type}
                                    </span>
                                    <span className="rounded-full border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                        {event.event_source}
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {formatDateTime(event.event_at)}
                                </span>
                            </div>
                            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                {event.event_message}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </SectionPanel>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
