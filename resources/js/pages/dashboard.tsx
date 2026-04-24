import { Head, router } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    Bell,
    CheckCircle2,
    Cpu,
    HardDrive,
    MemoryStick,
    MonitorCheck,
    MonitorOff,
    ShieldAlert,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { modalDetail } from '@/actions/App/Http/Controllers/EndView/DeviceController';
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
import {
    cleanParams,
    formatDateTime,
    formatPercent,
    formatRelative,
    severityAccentClass,
    statusBarClass,
} from '@/lib/endview';
import { cn } from '@/lib/utils';
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
    const [selectedDevice, setSelectedDevice] = useState<DeviceListItem | null>(
        null,
    );
    const [deviceDetail, setDeviceDetail] = useState<DeviceModalDetail | null>(
        null,
    );
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState<string | null>(null);

    const refreshDashboard = () => {
        setRefreshing(true);
        router.reload({
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
        router.get(
            dashboard.url(),
            {},
            { preserveScroll: true, replace: true },
        );
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

            <div className="relative flex flex-1 flex-col gap-5 bg-gradient-to-b from-muted/30 via-background to-muted/20 p-4 sm:p-6 lg:p-8">
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
                        tone="sky"
                        hint="All enrolled endpoints"
                    />
                    <SummaryCard
                        title="Online"
                        value={summary.online_devices}
                        icon={CheckCircle2}
                        tone="green"
                        hint={`${onlinePercent(summary)}% of fleet`}
                    />
                    <SummaryCard
                        title="Offline"
                        value={summary.offline_devices}
                        icon={MonitorOff}
                        hint="Not reporting"
                    />
                    <SummaryCard
                        title="Warning"
                        value={summary.warning_devices}
                        icon={AlertTriangle}
                        tone="amber"
                        hint="Degraded health"
                    />
                    <SummaryCard
                        title="Critical"
                        value={summary.critical_devices}
                        icon={ShieldAlert}
                        tone="red"
                        hint="Immediate attention"
                    />
                    <SummaryCard
                        title="Open alerts"
                        value={summary.open_alerts}
                        icon={Bell}
                        tone="red"
                        hint={`${summary.acknowledged_alerts} ack'd`}
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
                        <StatusBreakdownPanel
                            rows={status_breakdown}
                            total={summary.total_devices}
                        />
                    </SectionPanel>

                    <SectionPanel
                        title="Metric Trend"
                        description="Daily average utilization from recent snapshots."
                    >
                        <div className="grid gap-4 md:grid-cols-3">
                            <TrendCard
                                label="CPU"
                                icon={Cpu}
                                color="bg-emerald-500"
                                points={metric_trends.map((point) => ({
                                    label: point.label.slice(5),
                                    value: point.cpu_usage_percent,
                                }))}
                            />
                            <TrendCard
                                label="RAM"
                                icon={MemoryStick}
                                color="bg-amber-500"
                                points={metric_trends.map((point) => ({
                                    label: point.label.slice(5),
                                    value: point.ram_usage_percent,
                                }))}
                            />
                            <TrendCard
                                label="Storage"
                                icon={HardDrive}
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

function onlinePercent(summary: DashboardSummary): number {
    if (!summary.total_devices) {
        return 0;
    }

    return Math.round((summary.online_devices / summary.total_devices) * 100);
}

function StatusBreakdownPanel({
    rows,
    total,
}: {
    rows: StatusBreakdown[];
    total: number;
}) {
    if (rows.length === 0) {
        return <EmptyState title="No status data available" />;
    }

    const sum = Math.max(1, total, ...rows.map((s) => s.count));

    return (
        <div className="space-y-4">
            {rows.map((status) => {
                const percent = Math.round((status.count / sum) * 100);

                return (
                    <div
                        key={status.status_code}
                        className="group rounded-lg px-1 py-1 transition hover:bg-muted/30"
                    >
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-2">
                                <StatusBadge status={status.status_code} />
                                <span className="truncate text-sm font-medium text-foreground">
                                    {status.status_name}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1.5 tabular-nums">
                                <span className="text-sm font-semibold text-foreground">
                                    {status.count}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    · {percent}%
                                </span>
                            </div>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted ring-1 ring-inset ring-border/40">
                            <div
                                className={cn(
                                    'h-full rounded-full transition-all duration-500 ease-out',
                                    statusBarClass(status.status_code),
                                )}
                                style={{
                                    width: `${(status.count / sum) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function TrendCard({
    label,
    icon: Icon,
    points,
    color,
}: {
    label: string;
    icon: LucideIcon;
    points: { label: string; value: number | null | undefined }[];
    color: string;
}) {
    const latest = points.at(-1)?.value;
    const previous = points.at(-2)?.value;

    let delta: number | null = null;

    if (
        latest !== null &&
        latest !== undefined &&
        previous !== null &&
        previous !== undefined
    ) {
        delta = latest - previous;
    }

    const up = delta !== null && delta > 0.5;
    const down = delta !== null && delta < -0.5;

    return (
        <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-background to-muted/30 p-4 shadow-xs transition hover:shadow-md">
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Icon className="size-3.5" />
                    </div>
                    <span className="text-sm font-semibold tracking-tight">
                        {label}
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-lg font-bold tabular-nums text-foreground">
                        {formatPercent(latest)}
                    </span>
                    {delta !== null && (
                        <span
                            className={cn(
                                'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                                up &&
                                    'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300',
                                down &&
                                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
                                !up &&
                                    !down &&
                                    'bg-muted text-muted-foreground',
                            )}
                        >
                            {up && <TrendingUp className="size-3" />}
                            {down && <TrendingDown className="size-3" />}
                            {Math.abs(delta).toFixed(0)}%
                        </span>
                    )}
                </div>
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
                <EmptyState title="No recent alerts" icon={Bell} />
            ) : (
                <div className="space-y-2.5">
                    {rows.slice(0, 6).map((alert) => (
                        <div
                            key={alert.id}
                            className={cn(
                                'rounded-lg border border-l-[3px] bg-background p-3 shadow-xs transition hover:-translate-y-0.5 hover:bg-muted/20 hover:shadow-sm',
                                severityAccentClass(alert.severity_code),
                            )}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="truncate text-sm font-semibold text-foreground">
                                        {alert.alert_name}
                                    </div>
                                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <span className="truncate font-medium">
                                            {alert.device?.hostname ??
                                                'Unknown device'}
                                        </span>
                                        <span className="size-1 rounded-full bg-border" />
                                        <span>
                                            {formatRelative(alert.opened_at)}
                                        </span>
                                    </div>
                                </div>
                                <SeverityBadge severity={alert.severity_code} />
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
                <EmptyState title="No check-ins yet" icon={Activity} />
            ) : (
                <div className="space-y-2.5">
                    {rows.slice(0, 6).map((checkin) => (
                        <div
                            key={checkin.id}
                            className="flex items-start justify-between gap-3 rounded-lg border bg-background p-3 shadow-xs transition hover:-translate-y-0.5 hover:bg-muted/20 hover:shadow-sm"
                        >
                            <div className="min-w-0">
                                <div className="truncate text-sm font-semibold text-foreground">
                                    {checkin.device?.hostname ??
                                        'Unknown device'}
                                </div>
                                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                                    <span className="font-medium">
                                        {checkin.current_user_name ?? 'No user'}
                                    </span>
                                    <span className="size-1 rounded-full bg-border" />
                                    <span className="font-mono">
                                        {checkin.ip_address ?? 'No IP'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-1">
                                <StatusBadge status={checkin.status_code} />
                                <div className="text-[11px] text-muted-foreground">
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
                <div className="relative space-y-2.5 pl-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-border before:via-border before:to-transparent">
                    {rows.slice(0, 6).map((event) => (
                        <div
                            key={event.id}
                            className="relative rounded-lg border bg-background p-3 shadow-xs transition hover:-translate-y-0.5 hover:bg-muted/20 hover:shadow-sm"
                        >
                            <span
                                aria-hidden="true"
                                className="absolute -left-[13px] top-4 size-2.5 rounded-full border-2 border-background bg-sky-500 shadow-sm"
                            />
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex min-w-0 flex-wrap items-center gap-2">
                                    <span className="truncate text-sm font-semibold text-foreground">
                                        {event.event_type}
                                    </span>
                                    <span className="rounded-full border bg-muted/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        {event.event_source}
                                    </span>
                                </div>
                                <span className="text-[11px] tabular-nums text-muted-foreground">
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
