import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Battery,
    Cpu,
    HardDrive,
    MemoryStick,
    Network,
    Server,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DataTable } from '@/components/endview/data-table';
import type { DataTableColumn } from '@/components/endview/data-table';
import { EmptyState } from '@/components/endview/empty-state';
import { HealthScore } from '@/components/endview/health-score';
import { KeyValue } from '@/components/endview/key-value';
import { MetricPill } from '@/components/endview/metric-pill';
import { MiniBarChart } from '@/components/endview/mini-bar-chart';
import { SectionPanel } from '@/components/endview/section-panel';
import { SeverityBadge } from '@/components/endview/severity-badge';
import { StatusBadge } from '@/components/endview/status-badge';
import { Button } from '@/components/ui/button';
import {
    formatDateTime,
    formatGb,
    formatMb,
    formatPercent,
    formatRelative,
} from '@/lib/endview';
import type {
    AlertItem,
    CheckinItem,
    DeviceDetail,
    EventLogItem,
    MetricSnapshot,
    StorageSnapshot,
} from '@/types';

type DeviceShowProps = {
    device: DeviceDetail;
    latest_metric: MetricSnapshot | null;
    metric_history: MetricSnapshot[];
    storage_snapshots: StorageSnapshot[];
    checkins: CheckinItem[];
    alerts: AlertItem[];
    event_logs: EventLogItem[];
};

export default function DeviceShow({
    device,
    latest_metric,
    metric_history,
    storage_snapshots,
    checkins,
    alerts,
    event_logs,
}: DeviceShowProps) {
    const storageColumns: DataTableColumn<StorageSnapshot>[] = [
        {
            key: 'drive_name',
            header: 'Drive',
            render: (row) => (
                <span className="font-semibold">{row.drive_name}</span>
            ),
        },
        {
            key: 'drive_label',
            header: 'Label',
            render: (row) => row.drive_label ?? 'n/a',
        },
        {
            key: 'file_system',
            header: 'File system',
            render: (row) => row.file_system ?? 'n/a',
        },
        {
            key: 'total',
            header: 'Total',
            render: (row) => formatGb(row.total_gb),
        },
        {
            key: 'used',
            header: 'Used',
            render: (row) => formatGb(row.used_gb),
        },
        {
            key: 'free',
            header: 'Free',
            render: (row) => formatGb(row.free_gb),
        },
        {
            key: 'percent',
            header: 'Usage',
            render: (row) => formatPercent(row.used_percent),
        },
    ];

    const checkinColumns: DataTableColumn<CheckinItem>[] = [
        {
            key: 'checked_in_at',
            header: 'Checked in',
            render: (row) => (
                <div>
                    <div className="font-medium">
                        {formatRelative(row.checked_in_at)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {formatDateTime(row.checked_in_at)}
                    </div>
                </div>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.status_code} />,
        },
        {
            key: 'user',
            header: 'User',
            render: (row) => row.current_user_name ?? 'n/a',
        },
        { key: 'ip', header: 'IP', render: (row) => row.ip_address ?? 'n/a' },
        {
            key: 'mac',
            header: 'MAC',
            render: (row) => row.mac_address ?? 'n/a',
        },
        {
            key: 'remarks',
            header: 'Remarks',
            render: (row) => row.remarks ?? 'n/a',
        },
    ];

    const alertColumns: DataTableColumn<AlertItem>[] = [
        {
            key: 'opened_at',
            header: 'Opened',
            render: (row) => formatDateTime(row.opened_at),
        },
        { key: 'alert_code', header: 'Code', render: (row) => row.alert_code },
        {
            key: 'alert_name',
            header: 'Alert',
            render: (row) => (
                <div>
                    <div className="font-medium">{row.alert_name}</div>
                    <div className="max-w-xl text-xs text-muted-foreground">
                        {row.alert_message}
                    </div>
                </div>
            ),
        },
        {
            key: 'severity',
            header: 'Severity',
            render: (row) => <SeverityBadge severity={row.severity_code} />,
        },
        {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.status_code} />,
        },
        {
            key: 'acknowledged_at',
            header: 'Acknowledged',
            render: (row) => formatDateTime(row.acknowledged_at),
        },
        {
            key: 'resolved_at',
            header: 'Resolved',
            render: (row) => formatDateTime(row.resolved_at),
        },
    ];

    return (
        <>
            <Head title={`${device.overview.hostname} Detail`} />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="mb-2 -ml-2"
                        >
                            <Link href="/devices">
                                <ArrowLeft className="size-4" />
                                Devices
                            </Link>
                        </Button>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-normal">
                                {device.overview.device_name}
                            </h1>
                            <StatusBadge status={device.overview.status_code} />
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {device.overview.hostname}
                        </p>
                    </div>
                    <div className="min-w-44 rounded-lg border bg-card p-3">
                        <HealthScore score={device.overview.health_score} />
                    </div>
                </div>

                <SectionPanel title="Overview">
                    <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <KeyValue
                            label="UUID"
                            value={device.overview.device_uuid}
                        />
                        <KeyValue
                            label="Company"
                            value={device.company ?? 'n/a'}
                        />
                        <KeyValue label="Site" value={device.site ?? 'n/a'} />
                        <KeyValue
                            label="Current user"
                            value={device.current_user ?? 'n/a'}
                        />
                        <KeyValue
                            label="Last logged on"
                            value={
                                device.overview.last_logged_on_username ?? 'n/a'
                            }
                        />
                        <KeyValue
                            label="Enrolled"
                            value={formatDateTime(device.overview.enrolled_at)}
                        />
                        <KeyValue
                            label="Last check-in"
                            value={formatDateTime(
                                device.overview.last_checkin_at,
                            )}
                        />
                        <KeyValue
                            label="Last inventory"
                            value={formatDateTime(
                                device.overview.last_inventory_at,
                            )}
                        />
                        <KeyValue
                            label="Last metrics"
                            value={formatDateTime(
                                device.overview.last_metrics_at,
                            )}
                        />
                        <KeyValue
                            label="Agent version"
                            value={device.agent.agent_version ?? 'n/a'}
                        />
                        <KeyValue
                            label="Agent active"
                            value={
                                device.agent.is_active === null
                                    ? 'n/a'
                                    : device.agent.is_active
                                      ? 'Yes'
                                      : 'No'
                            }
                        />
                        <KeyValue
                            label="Agent IP"
                            value={device.agent.last_seen_ip ?? 'n/a'}
                        />
                        <KeyValue
                            label="Token issued"
                            value={formatDateTime(device.agent.token_issued_at)}
                        />
                    </dl>
                </SectionPanel>

                <SectionPanel title="Hardware / OS Info">
                    <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <KeyValue
                            label="Manufacturer"
                            value={device.hardware.manufacturer ?? 'n/a'}
                        />
                        <KeyValue
                            label="Model"
                            value={device.hardware.model ?? 'n/a'}
                        />
                        <KeyValue
                            label="Serial number"
                            value={device.hardware.serial_number ?? 'n/a'}
                        />
                        <KeyValue
                            label="BIOS"
                            value={device.hardware.bios_version ?? 'n/a'}
                        />
                        <KeyValue
                            label="CPU"
                            value={device.hardware.cpu_name ?? 'n/a'}
                        />
                        <KeyValue
                            label="Cores"
                            value={`${device.hardware.cpu_physical_cores ?? 'n/a'} physical / ${device.hardware.cpu_logical_cores ?? 'n/a'} logical`}
                        />
                        <KeyValue
                            label="Memory"
                            value={formatMb(device.hardware.total_memory_mb)}
                        />
                        <KeyValue
                            label="OS"
                            value={`${device.hardware.os_name ?? 'n/a'} ${device.hardware.os_version ?? ''}`}
                        />
                        <KeyValue
                            label="Build"
                            value={device.hardware.os_build ?? 'n/a'}
                        />
                        <KeyValue
                            label="Architecture"
                            value={device.hardware.os_architecture ?? 'n/a'}
                        />
                        <KeyValue
                            label="MAC"
                            value={device.hardware.mac_address ?? 'n/a'}
                        />
                        <KeyValue
                            label="IPv4"
                            value={device.hardware.ipv4_address ?? 'n/a'}
                        />
                        <KeyValue
                            label="IPv6"
                            value={device.hardware.ipv6_address ?? 'n/a'}
                        />
                        <KeyValue
                            label="FQDN"
                            value={device.hardware.fqdn ?? 'n/a'}
                        />
                    </dl>
                </SectionPanel>

                <SectionPanel title="Current Health">
                    {latest_metric ? (
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
                            <MetricPill
                                label="CPU"
                                value={latest_metric.cpu_usage_percent}
                            />
                            <MetricPill
                                label="RAM"
                                value={latest_metric.ram_usage_percent}
                            />
                            <MetricPill
                                label="Storage"
                                value={latest_metric.storage_usage_percent}
                            />
                            <MetricPill
                                label="Battery"
                                value={latest_metric.battery_percent}
                                higherIsBetter
                            />
                            <MetricPill
                                label="Battery health"
                                value={latest_metric.battery_health_percent}
                                higherIsBetter
                            />
                            <MetricPill
                                label="CPU temp"
                                value={latest_metric.cpu_temperature_c}
                                suffix=" C"
                            />
                            <KeyValue
                                label="Charging"
                                value={
                                    latest_metric.is_charging === null
                                        ? 'n/a'
                                        : latest_metric.is_charging
                                          ? 'Yes'
                                          : 'No'
                                }
                            />
                            <KeyValue
                                label="Battery cycles"
                                value={
                                    latest_metric.battery_cycle_count ?? 'n/a'
                                }
                            />
                            <KeyValue
                                label="RAM used"
                                value={formatMb(latest_metric.ram_used_mb)}
                            />
                            <KeyValue
                                label="RAM free"
                                value={formatMb(latest_metric.ram_free_mb)}
                            />
                            <KeyValue
                                label="Storage used"
                                value={formatGb(latest_metric.used_storage_gb)}
                            />
                            <KeyValue
                                label="Storage free"
                                value={formatGb(latest_metric.free_storage_gb)}
                            />
                        </div>
                    ) : (
                        <EmptyState title="No metric snapshots yet" />
                    )}
                </SectionPanel>

                <SectionPanel title="Performance History">
                    {metric_history.length === 0 ? (
                        <EmptyState title="No performance history yet" />
                    ) : (
                        <div className="grid gap-4 lg:grid-cols-4">
                            <HistoryChart
                                title="CPU"
                                icon={Cpu}
                                color="bg-teal-500"
                                history={metric_history}
                                metric="cpu_usage_percent"
                            />
                            <HistoryChart
                                title="RAM"
                                icon={MemoryStick}
                                color="bg-amber-500"
                                history={metric_history}
                                metric="ram_usage_percent"
                            />
                            <HistoryChart
                                title="Storage"
                                icon={HardDrive}
                                color="bg-red-500"
                                history={metric_history}
                                metric="storage_usage_percent"
                            />
                            <HistoryChart
                                title="Battery"
                                icon={Battery}
                                color="bg-emerald-500"
                                history={metric_history}
                                metric="battery_percent"
                            />
                        </div>
                    )}
                </SectionPanel>

                <SectionPanel title="Storage Detail">
                    <DataTable
                        rows={storage_snapshots}
                        columns={storageColumns}
                        getRowKey={(row) => row.id}
                        emptyTitle="No storage snapshots yet"
                    />
                </SectionPanel>

                <SectionPanel title="Check-in History">
                    <DataTable
                        rows={checkins}
                        columns={checkinColumns}
                        getRowKey={(row) => row.id}
                        emptyTitle="No check-ins yet"
                    />
                </SectionPanel>

                <SectionPanel title="Alerts">
                    <DataTable
                        rows={alerts}
                        columns={alertColumns}
                        getRowKey={(row) => row.id}
                        emptyTitle="No alerts for this device"
                    />
                </SectionPanel>

                <SectionPanel title="Event Timeline">
                    {event_logs.length === 0 ? (
                        <EmptyState title="No events yet" />
                    ) : (
                        <div className="relative space-y-4">
                            {event_logs.map((event) => (
                                <div key={event.id} className="flex gap-3">
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                                        {event.event_type.includes(
                                            'CHECKIN',
                                        ) ? (
                                            <Network className="size-4" />
                                        ) : (
                                            <Server className="size-4" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1 rounded-md border bg-background p-3">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-medium">
                                                    {event.event_type}
                                                </span>
                                                <span className="rounded-md border px-2 py-0.5 text-xs text-muted-foreground">
                                                    {event.event_source}
                                                </span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDateTime(event.event_at)}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {event.event_message}
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

function HistoryChart({
    title,
    icon: Icon,
    color,
    history,
    metric,
}: {
    title: string;
    icon: LucideIcon;
    color: string;
    history: MetricSnapshot[];
    metric: keyof Pick<
        MetricSnapshot,
        | 'cpu_usage_percent'
        | 'ram_usage_percent'
        | 'storage_usage_percent'
        | 'battery_percent'
    >;
}) {
    return (
        <div className="rounded-lg border bg-background p-3">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Icon className="size-4 text-muted-foreground" />
                {title}
            </div>
            <MiniBarChart
                points={history.map((snapshot) => ({
                    label: snapshot.captured_at
                        ? new Date(snapshot.captured_at)
                              .getHours()
                              .toString()
                              .padStart(2, '0')
                        : '',
                    value: snapshot[metric] as number | null,
                }))}
                color={color}
            />
        </div>
    );
}

DeviceShow.layout = {
    breadcrumbs: [
        {
            title: 'Devices',
            href: '/devices',
        },
        {
            title: 'Device Detail',
            href: '#',
        },
    ],
};
