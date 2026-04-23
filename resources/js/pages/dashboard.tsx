import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    BatteryLow,
    Bell,
    CheckCircle2,
    Clock,
    HardDrive,
    MonitorCheck,
    MonitorOff,
    ShieldAlert,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DataTable } from '@/components/endview/data-table';
import type { DataTableColumn } from '@/components/endview/data-table';
import { EmptyState } from '@/components/endview/empty-state';
import { HealthScore } from '@/components/endview/health-score';
import { MiniBarChart } from '@/components/endview/mini-bar-chart';
import { SectionPanel } from '@/components/endview/section-panel';
import { SeverityBadge } from '@/components/endview/severity-badge';
import { StatusBadge } from '@/components/endview/status-badge';
import { SummaryCard } from '@/components/endview/summary-card';
import { Button } from '@/components/ui/button';
import { formatDateTime, formatPercent, formatRelative } from '@/lib/endview';
import { dashboard } from '@/routes';
import type {
    AlertItem,
    CheckinItem,
    DeviceSummary,
    EventLogItem,
    MetricTrend,
    RiskMetricDevice,
} from '@/types';

type DashboardProps = {
    summary: {
        total_devices: number;
        online_devices: number;
        offline_devices: number;
        warning_devices: number;
        critical_devices: number;
        open_alerts: number;
        acknowledged_alerts: number;
        resolved_alerts: number;
    };
    status_breakdown: {
        status_code: string;
        status_name: string;
        count: number;
    }[];
    recent_alerts: AlertItem[];
    recent_offline_devices: DeviceSummary[];
    latest_checkins: CheckinItem[];
    risky_storage_devices: RiskMetricDevice[];
    low_battery_health_devices: RiskMetricDevice[];
    recent_events: EventLogItem[];
    metric_trends: MetricTrend[];
};

export default function Dashboard({
    summary,
    status_breakdown,
    recent_alerts,
    recent_offline_devices,
    latest_checkins,
    risky_storage_devices,
    low_battery_health_devices,
    recent_events,
    metric_trends,
}: DashboardProps) {
    const alertColumns: DataTableColumn<AlertItem>[] = [
        {
            key: 'opened_at',
            header: 'Opened',
            render: (alert) => (
                <div>
                    <div className="font-medium">
                        {formatRelative(alert.opened_at)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {formatDateTime(alert.opened_at)}
                    </div>
                </div>
            ),
        },
        {
            key: 'device',
            header: 'Device',
            render: (alert) =>
                alert.device ? (
                    <Link
                        href={`/devices/${alert.device.id}`}
                        className="font-medium hover:underline"
                    >
                        {alert.device.hostname}
                    </Link>
                ) : (
                    'n/a'
                ),
        },
        {
            key: 'alert',
            header: 'Alert',
            render: (alert) => (
                <div>
                    <div className="font-medium">{alert.alert_name}</div>
                    <div className="max-w-72 truncate text-xs text-muted-foreground">
                        {alert.alert_message}
                    </div>
                </div>
            ),
        },
        {
            key: 'severity',
            header: 'Severity',
            render: (alert) => <SeverityBadge severity={alert.severity_code} />,
        },
        {
            key: 'status',
            header: 'Status',
            render: (alert) => <StatusBadge status={alert.status_code} />,
        },
    ];

    const checkinColumns: DataTableColumn<CheckinItem>[] = [
        {
            key: 'checked_in_at',
            header: 'Check-in',
            render: (checkin) => (
                <div>
                    <div className="font-medium">
                        {formatRelative(checkin.checked_in_at)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {formatDateTime(checkin.checked_in_at)}
                    </div>
                </div>
            ),
        },
        {
            key: 'device',
            header: 'Device',
            render: (checkin) =>
                checkin.device ? (
                    <Link
                        href={`/devices/${checkin.device.id}`}
                        className="font-medium hover:underline"
                    >
                        {checkin.device.hostname}
                    </Link>
                ) : (
                    'n/a'
                ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (checkin) => <StatusBadge status={checkin.status_code} />,
        },
        {
            key: 'ip',
            header: 'IP',
            render: (checkin) => checkin.ip_address ?? 'n/a',
        },
    ];

    const maxStatus = Math.max(
        1,
        ...status_breakdown.map((status) => status.count),
    );

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-normal">
                        Endpoint Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Fleet health, connectivity, and alert posture across
                        monitored laptops and PCs.
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
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
                    <SummaryCard
                        title="Acknowledged"
                        value={summary.acknowledged_alerts}
                        icon={Clock}
                        tone="amber"
                    />
                    <SummaryCard
                        title="Resolved"
                        value={summary.resolved_alerts}
                        icon={CheckCircle2}
                        tone="sky"
                    />
                </div>

                <div className="grid gap-4 xl:grid-cols-[1fr_1.25fr]">
                    <SectionPanel title="Status Breakdown">
                        <div className="space-y-4">
                            {status_breakdown.map((status) => (
                                <div key={status.status_code}>
                                    <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <StatusBadge
                                                status={status.status_code}
                                            />
                                            <span className="font-medium">
                                                {status.status_name}
                                            </span>
                                        </div>
                                        <span className="text-muted-foreground">
                                            {status.count}
                                        </span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-teal-500"
                                            style={{
                                                width: `${(status.count / maxStatus) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionPanel>

                    <SectionPanel
                        title="Metric Trend"
                        description="Daily average from recent snapshots"
                    >
                        <div className="grid gap-4 md:grid-cols-3">
                            <MiniBarChart
                                points={metric_trends.map((point) => ({
                                    label: point.label.slice(5),
                                    value: point.cpu_usage_percent,
                                }))}
                                color="bg-teal-500"
                            />
                            <MiniBarChart
                                points={metric_trends.map((point) => ({
                                    label: point.label.slice(5),
                                    value: point.ram_usage_percent,
                                }))}
                                color="bg-amber-500"
                            />
                            <MiniBarChart
                                points={metric_trends.map((point) => ({
                                    label: point.label.slice(5),
                                    value: point.storage_usage_percent,
                                }))}
                                color="bg-red-500"
                            />
                        </div>
                    </SectionPanel>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <SectionPanel
                        title="Recent Alerts"
                        action={
                            <Button asChild variant="outline" size="sm">
                                <Link href="/alerts">View alerts</Link>
                            </Button>
                        }
                    >
                        <DataTable
                            rows={recent_alerts}
                            columns={alertColumns}
                            getRowKey={(alert) => alert.id}
                            emptyTitle="No recent alerts"
                        />
                    </SectionPanel>

                    <SectionPanel
                        title="Latest Check-ins"
                        action={
                            <Button asChild variant="outline" size="sm">
                                <Link href="/check-ins">View check-ins</Link>
                            </Button>
                        }
                    >
                        <DataTable
                            rows={latest_checkins}
                            columns={checkinColumns}
                            getRowKey={(checkin) => checkin.id}
                            emptyTitle="No check-ins yet"
                        />
                    </SectionPanel>
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                    <RiskList
                        title="Recent Offline Devices"
                        icon={MonitorOff}
                        rows={recent_offline_devices.map((device) => ({
                            key: device.id,
                            device,
                            value: formatRelative(device.last_checkin_at),
                        }))}
                        emptyTitle="No offline devices"
                    />
                    <RiskList
                        title="Risky Storage"
                        icon={HardDrive}
                        rows={risky_storage_devices.map((risk) => ({
                            key: risk.device.id,
                            device: risk.device,
                            value: formatPercent(risk.value),
                        }))}
                        emptyTitle="No risky storage devices"
                    />
                    <RiskList
                        title="Low Battery Health"
                        icon={BatteryLow}
                        rows={low_battery_health_devices.map((risk) => ({
                            key: risk.device.id,
                            device: risk.device,
                            value: formatPercent(risk.value),
                        }))}
                        emptyTitle="No battery health risks"
                    />
                </div>

                <SectionPanel title="Recent Events">
                    {recent_events.length === 0 ? (
                        <EmptyState title="No recent events" />
                    ) : (
                        <div className="divide-y">
                            {recent_events.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex gap-3 py-3 first:pt-0 last:pb-0"
                                >
                                    <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                                        <Activity className="size-4 text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-medium">
                                                {event.event_type}
                                            </span>
                                            <span className="rounded-md border px-2 py-0.5 text-xs text-muted-foreground">
                                                {event.event_source}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {event.event_message}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {event.device?.hostname ?? 'System'}{' '}
                                            - {formatDateTime(event.event_at)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </SectionPanel>
            </div>
        </>
    );
}

function RiskList({
    title,
    icon: Icon,
    rows,
    emptyTitle,
}: {
    title: string;
    icon: LucideIcon;
    rows: { key: string | number; device: DeviceSummary; value: string }[];
    emptyTitle: string;
}) {
    return (
        <SectionPanel title={title}>
            {rows.length === 0 ? (
                <EmptyState title={emptyTitle} icon={Icon} />
            ) : (
                <div className="space-y-3">
                    {rows.map((row) => (
                        <Link
                            key={row.key}
                            href={`/devices/${row.device.id}`}
                            className="flex items-center justify-between gap-3 rounded-md border bg-background p-3 hover:bg-muted/40"
                        >
                            <div className="min-w-0">
                                <div className="truncate font-medium">
                                    {row.device.hostname}
                                </div>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                    <StatusBadge
                                        status={row.device.status_code}
                                    />
                                    <span>{row.device.site ?? 'No site'}</span>
                                </div>
                            </div>
                            <div className="flex min-w-28 items-center justify-end gap-3">
                                <HealthScore
                                    score={row.device.health_score}
                                    compact
                                />
                                <span className="text-sm font-semibold">
                                    {row.value}
                                </span>
                            </div>
                        </Link>
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
