import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Battery, Cpu, HardDrive, MemoryStick, Network } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { EmptyState } from '@/components/endview/empty-state';
import { HealthScore } from '@/components/endview/health-score';
import { KeyValue } from '@/components/endview/key-value';
import { LoadingSkeleton } from '@/components/endview/loading-skeleton';
import { MetricMiniBar } from '@/components/endview/metric-mini-bar';
import { MiniBarChart } from '@/components/endview/mini-bar-chart';
import { SeverityBadge } from '@/components/endview/severity-badge';
import { StatusBadge } from '@/components/endview/status-badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    formatDateTime,
    formatGb,
    formatMb,
    formatPercent,
    formatRelative,
} from '@/lib/endview';
import { cn } from '@/lib/utils';
import type { DeviceListItem, DeviceModalDetail } from '@/types';

type ModalTab = 'overview' | 'health' | 'activity';

export function DeviceDetailModal({
    open,
    device,
    detail,
    loading,
    error,
    onRetry,
    onOpenChange,
}: {
    open: boolean;
    device: DeviceListItem | null;
    detail: DeviceModalDetail | null;
    loading: boolean;
    error: string | null;
    onRetry: () => void;
    onOpenChange: (open: boolean) => void;
}) {
    const [activeTab, setActiveTab] = useState<ModalTab>('overview');

    useEffect(() => {
        if (open) {
            setActiveTab('overview');
        }
    }, [open, device?.id]);

    const overview = detail?.device.overview;
    const hardware = detail?.device.hardware;
    const latestMetric = detail?.latest_metric;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[92vh] overflow-hidden gap-0 border p-0 sm:max-w-6xl">
                <DialogHeader className="border-b bg-card px-6 py-5">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-3 text-left">
                            <div className="flex flex-wrap items-center gap-2">
                                <DialogTitle className="text-xl font-semibold tracking-normal">
                                    {overview?.device_name ??
                                        device?.device_name ??
                                        'Device detail'}
                                </DialogTitle>
                                <StatusBadge
                                    status={
                                        overview?.status_code ??
                                        device?.status_code
                                    }
                                />
                            </div>
                            <DialogDescription>
                                {overview?.hostname ?? device?.hostname ?? 'Unknown host'}
                                {' · '}
                                {detail?.device.company ?? device?.company ?? 'No company'}
                                {' / '}
                                {detail?.device.site ?? device?.site ?? 'No site'}
                            </DialogDescription>
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                <InlineChip
                                    label="UUID"
                                    value={overview?.device_uuid ?? 'Loading'}
                                />
                                <InlineChip
                                    label="Last check-in"
                                    value={
                                        overview?.last_checkin_at
                                            ? formatRelative(
                                                  overview.last_checkin_at,
                                              )
                                            : 'Never'
                                    }
                                />
                                <InlineChip
                                    label="Current user"
                                    value={
                                        detail?.device.current_user ??
                                        device?.current_user ??
                                        'No active user'
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[24rem]">
                            <StatCard
                                label="Health score"
                                value={
                                    <HealthScore
                                        score={
                                            overview?.health_score ??
                                            device?.health_score
                                        }
                                    />
                                }
                            />
                            <StatCard
                                label="Last metrics"
                                value={
                                    <div className="space-y-1">
                                        <div className="text-sm font-semibold text-foreground">
                                            {formatDateTime(
                                                overview?.last_metrics_at ??
                                                    device?.latest_metric
                                                        ?.captured_at,
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {formatRelative(
                                                overview?.last_metrics_at ??
                                                    device?.latest_metric
                                                        ?.captured_at,
                                            )}
                                        </div>
                                    </div>
                                }
                            />
                            <StatCard
                                label="Primary IP"
                                value={
                                    <div className="space-y-1">
                                        <div className="text-sm font-semibold text-foreground">
                                            {hardware?.ipv4_address ??
                                                device?.ip_address ??
                                                'No IP'}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {hardware?.mac_address ??
                                                device?.mac_address ??
                                                'No MAC'}
                                        </div>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </DialogHeader>

                <div className="border-b bg-background px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                        {(['overview', 'health', 'activity'] as const).map(
                            (tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        'rounded-lg border px-3 py-1.5 text-sm font-medium capitalize transition',
                                        activeTab === tab
                                            ? 'border-foreground bg-foreground text-background'
                                            : 'border-border bg-card text-muted-foreground hover:bg-muted',
                                    )}
                                >
                                    {tab}
                                </button>
                            ),
                        )}
                    </div>
                </div>

                <div className="overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
                    {loading ? (
                        <LoadingSkeleton rows={6} />
                    ) : error ? (
                        <div className="space-y-4">
                            <EmptyState
                                title="Unable to load device detail"
                                description={error}
                            />
                            <div className="flex justify-center">
                                <Button type="button" onClick={onRetry}>
                                    Retry
                                </Button>
                            </div>
                        </div>
                    ) : !detail ? (
                        <EmptyState
                            title="No device detail available"
                            description="Select another device or refresh the dashboard."
                        />
                    ) : activeTab === 'overview' ? (
                        <div className="space-y-6">
                            <DetailSection
                                title="Overview"
                                description="Identity, ownership, enrollment, and latest reporting timestamps."
                            >
                                <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                    <KeyValue
                                        label="Device name"
                                        value={overview?.device_name}
                                    />
                                    <KeyValue
                                        label="Hostname"
                                        value={overview?.hostname}
                                    />
                                    <KeyValue
                                        label="UUID"
                                        value={overview?.device_uuid}
                                    />
                                    <KeyValue
                                        label="Status"
                                        value={
                                            <StatusBadge
                                                status={overview?.status_code}
                                            />
                                        }
                                    />
                                    <KeyValue
                                        label="Company"
                                        value={detail.device.company}
                                    />
                                    <KeyValue
                                        label="Site"
                                        value={detail.device.site}
                                    />
                                    <KeyValue
                                        label="Current user"
                                        value={detail.device.current_user}
                                    />
                                    <KeyValue
                                        label="Last logged on user"
                                        value={
                                            overview?.last_logged_on_username
                                        }
                                    />
                                    <KeyValue
                                        label="Enrolled at"
                                        value={formatDateTime(
                                            overview?.enrolled_at,
                                        )}
                                    />
                                    <KeyValue
                                        label="Last check-in"
                                        value={formatDateTime(
                                            overview?.last_checkin_at,
                                        )}
                                    />
                                    <KeyValue
                                        label="Last inventory"
                                        value={formatDateTime(
                                            overview?.last_inventory_at,
                                        )}
                                    />
                                    <KeyValue
                                        label="Last metrics"
                                        value={formatDateTime(
                                            overview?.last_metrics_at,
                                        )}
                                    />
                                </dl>
                            </DetailSection>

                            <DetailSection
                                title="Hardware / OS Info"
                                description="Hardware inventory, operating system, and network identity."
                            >
                                <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                    <KeyValue
                                        label="Manufacturer"
                                        value={hardware?.manufacturer}
                                    />
                                    <KeyValue
                                        label="Model"
                                        value={hardware?.model}
                                    />
                                    <KeyValue
                                        label="Serial number"
                                        value={hardware?.serial_number}
                                    />
                                    <KeyValue
                                        label="BIOS version"
                                        value={hardware?.bios_version}
                                    />
                                    <KeyValue
                                        label="CPU"
                                        value={hardware?.cpu_name}
                                    />
                                    <KeyValue
                                        label="Cores"
                                        value={`${hardware?.cpu_physical_cores ?? 'n/a'} physical / ${hardware?.cpu_logical_cores ?? 'n/a'} logical`}
                                    />
                                    <KeyValue
                                        label="Total memory"
                                        value={formatMb(
                                            hardware?.total_memory_mb,
                                        )}
                                    />
                                    <KeyValue
                                        label="OS"
                                        value={`${hardware?.os_name ?? 'n/a'} ${hardware?.os_version ?? ''}`}
                                    />
                                    <KeyValue
                                        label="OS build"
                                        value={hardware?.os_build}
                                    />
                                    <KeyValue
                                        label="Architecture"
                                        value={hardware?.os_architecture}
                                    />
                                    <KeyValue
                                        label="MAC"
                                        value={hardware?.mac_address}
                                    />
                                    <KeyValue
                                        label="IPv4"
                                        value={hardware?.ipv4_address}
                                    />
                                    <KeyValue
                                        label="IPv6"
                                        value={hardware?.ipv6_address}
                                    />
                                    <KeyValue
                                        label="FQDN"
                                        value={hardware?.fqdn}
                                    />
                                </dl>
                            </DetailSection>
                        </div>
                    ) : activeTab === 'health' ? (
                        <div className="space-y-6">
                            <DetailSection
                                title="Current Health"
                                description="Live utilization and battery telemetry from the latest snapshot."
                            >
                                {latestMetric ? (
                                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                            <MetricCard
                                                icon={Cpu}
                                                title="CPU usage"
                                                value={latestMetric.cpu_usage_percent}
                                            />
                                            <MetricCard
                                                icon={MemoryStick}
                                                title="RAM usage"
                                                value={latestMetric.ram_usage_percent}
                                            />
                                            <MetricCard
                                                icon={HardDrive}
                                                title="Storage usage"
                                                value={
                                                    latestMetric.storage_usage_percent
                                                }
                                            />
                                            <MetricCard
                                                icon={Battery}
                                                title="Battery percent"
                                                value={latestMetric.battery_percent}
                                                higherIsBetter
                                            />
                                            <MetricCard
                                                icon={Battery}
                                                title="Battery health"
                                                value={
                                                    latestMetric.battery_health_percent
                                                }
                                                higherIsBetter
                                            />
                                            <MetricCard
                                                icon={Network}
                                                title="Charging"
                                                valueLabel={
                                                    latestMetric.is_charging ===
                                                    null
                                                        ? 'n/a'
                                                        : latestMetric.is_charging
                                                          ? 'Charging'
                                                          : 'Not charging'
                                                }
                                            />
                                        </div>

                                        <dl className="grid gap-3 sm:grid-cols-2">
                                            <KeyValue
                                                label="RAM used"
                                                value={formatMb(
                                                    latestMetric.ram_used_mb,
                                                )}
                                            />
                                            <KeyValue
                                                label="RAM free"
                                                value={formatMb(
                                                    latestMetric.ram_free_mb,
                                                )}
                                            />
                                            <KeyValue
                                                label="Storage used"
                                                value={formatGb(
                                                    latestMetric.used_storage_gb,
                                                )}
                                            />
                                            <KeyValue
                                                label="Storage free"
                                                value={formatGb(
                                                    latestMetric.free_storage_gb,
                                                )}
                                            />
                                            <KeyValue
                                                label="CPU temperature"
                                                value={
                                                    latestMetric.cpu_temperature_c ===
                                                    null
                                                        ? 'n/a'
                                                        : `${latestMetric.cpu_temperature_c} C`
                                                }
                                            />
                                            <KeyValue
                                                label="Battery cycles"
                                                value={
                                                    latestMetric.battery_cycle_count
                                                }
                                            />
                                        </dl>
                                    </div>
                                ) : (
                                    <EmptyState title="No metric snapshots yet" />
                                )}
                            </DetailSection>

                            <DetailSection
                                title="Metric History"
                                description="Recent performance trend from the latest recorded samples."
                            >
                                {detail.metric_history.length === 0 ? (
                                    <EmptyState title="No metric history yet" />
                                ) : (
                                    <div className="grid gap-4 lg:grid-cols-4">
                                        <ChartCard
                                            title="CPU"
                                            color="bg-emerald-500"
                                            points={detail.metric_history.map(
                                                (snapshot) => ({
                                                    label: hourLabel(
                                                        snapshot.captured_at,
                                                    ),
                                                    value: snapshot.cpu_usage_percent,
                                                }),
                                            )}
                                        />
                                        <ChartCard
                                            title="RAM"
                                            color="bg-amber-500"
                                            points={detail.metric_history.map(
                                                (snapshot) => ({
                                                    label: hourLabel(
                                                        snapshot.captured_at,
                                                    ),
                                                    value: snapshot.ram_usage_percent,
                                                }),
                                            )}
                                        />
                                        <ChartCard
                                            title="Storage"
                                            color="bg-red-500"
                                            points={detail.metric_history.map(
                                                (snapshot) => ({
                                                    label: hourLabel(
                                                        snapshot.captured_at,
                                                    ),
                                                    value: snapshot.storage_usage_percent,
                                                }),
                                            )}
                                        />
                                        <ChartCard
                                            title="Battery"
                                            color="bg-sky-500"
                                            points={detail.metric_history.map(
                                                (snapshot) => ({
                                                    label: hourLabel(
                                                        snapshot.captured_at,
                                                    ),
                                                    value: snapshot.battery_percent,
                                                }),
                                            )}
                                        />
                                    </div>
                                )}
                            </DetailSection>

                            <DetailSection
                                title="Storage Details"
                                description="Latest drive-level storage layout for the endpoint."
                            >
                                <StorageTable rows={detail.storage_snapshots} />
                            </DetailSection>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <DetailSection
                                title="Recent Check-ins"
                                description="Latest endpoint heartbeat and connectivity records."
                            >
                                <CheckinTable rows={detail.checkins} />
                            </DetailSection>

                            <DetailSection
                                title="Recent Alerts"
                                description="Alert history ordered by open time."
                            >
                                <AlertTable rows={detail.alerts} />
                            </DetailSection>

                            <DetailSection
                                title="Event Timeline"
                                description="System and endpoint events associated with this device."
                            >
                                <EventTimeline rows={detail.event_logs} />
                            </DetailSection>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function DetailSection({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: ReactNode;
}) {
    return (
        <section className="rounded-xl border bg-card/95 shadow-xs">
            <div className="border-b px-4 py-3">
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                {description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            <div className="p-4">{children}</div>
        </section>
    );
}

function StatCard({
    label,
    value,
}: {
    label: string;
    value: ReactNode;
}) {
    return (
        <div className="rounded-xl border bg-background px-4 py-3 shadow-xs">
            <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {label}
            </div>
            <div className="mt-2">{value}</div>
        </div>
    );
}

function InlineChip({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <span className="inline-flex items-center gap-1 rounded-full border bg-background px-2.5 py-1 shadow-xs">
            <span className="font-medium text-foreground">{label}:</span>
            <span>{value}</span>
        </span>
    );
}

function MetricCard({
    icon: Icon,
    title,
    value,
    higherIsBetter = false,
    valueLabel,
}: {
    icon: LucideIcon;
    title: string;
    value?: number | null;
    higherIsBetter?: boolean;
    valueLabel?: string;
}) {
    return (
        <div className="rounded-xl border bg-background px-4 py-3 shadow-xs">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Icon className="size-4 text-muted-foreground" />
                {title}
            </div>
            <div className="mt-3">
                {valueLabel ? (
                    <div className="text-sm font-semibold text-foreground">
                        {valueLabel}
                    </div>
                ) : (
                    <MetricMiniBar
                        label="Current"
                        value={value}
                        higherIsBetter={higherIsBetter}
                    />
                )}
            </div>
        </div>
    );
}

function ChartCard({
    title,
    points,
    color,
}: {
    title: string;
    points: { label: string; value: number | null | undefined }[];
    color: string;
}) {
    return (
        <div className="rounded-xl border bg-background px-4 py-3 shadow-xs">
            <div className="mb-3 text-sm font-semibold text-foreground">
                {title}
            </div>
            <MiniBarChart points={points} color={color} />
        </div>
    );
}

function StorageTable({
    rows,
}: {
    rows: DeviceModalDetail['storage_snapshots'];
}) {
    if (rows.length === 0) {
        return <EmptyState title="No storage snapshots yet" />;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                    <tr className="border-b text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        <th className="px-3 py-2">Drive</th>
                        <th className="px-3 py-2">Label</th>
                        <th className="px-3 py-2">File System</th>
                        <th className="px-3 py-2">Total</th>
                        <th className="px-3 py-2">Used</th>
                        <th className="px-3 py-2">Free</th>
                        <th className="px-3 py-2">Used %</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id} className="border-b last:border-0">
                            <td className="px-3 py-3 font-medium">
                                {row.drive_name}
                            </td>
                            <td className="px-3 py-3 text-muted-foreground">
                                {row.drive_label ?? 'n/a'}
                            </td>
                            <td className="px-3 py-3 text-muted-foreground">
                                {row.file_system ?? 'n/a'}
                            </td>
                            <td className="px-3 py-3">{formatGb(row.total_gb)}</td>
                            <td className="px-3 py-3">{formatGb(row.used_gb)}</td>
                            <td className="px-3 py-3">{formatGb(row.free_gb)}</td>
                            <td className="px-3 py-3 font-medium">
                                {formatPercent(row.used_percent)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function CheckinTable({
    rows,
}: {
    rows: DeviceModalDetail['checkins'];
}) {
    if (rows.length === 0) {
        return <EmptyState title="No check-ins yet" />;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                    <tr className="border-b text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        <th className="px-3 py-2">Checked In</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Current User</th>
                        <th className="px-3 py-2">IP</th>
                        <th className="px-3 py-2">MAC</th>
                        <th className="px-3 py-2">Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id} className="border-b last:border-0">
                            <td className="px-3 py-3">
                                <div className="font-medium">
                                    {formatRelative(row.checked_in_at)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {formatDateTime(row.checked_in_at)}
                                </div>
                            </td>
                            <td className="px-3 py-3">
                                <StatusBadge status={row.status_code} />
                            </td>
                            <td className="px-3 py-3">
                                {row.current_user_name ?? 'n/a'}
                            </td>
                            <td className="px-3 py-3">{row.ip_address ?? 'n/a'}</td>
                            <td className="px-3 py-3">{row.mac_address ?? 'n/a'}</td>
                            <td className="px-3 py-3 text-muted-foreground">
                                {row.remarks ?? 'n/a'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function AlertTable({
    rows,
}: {
    rows: DeviceModalDetail['alerts'];
}) {
    if (rows.length === 0) {
        return <EmptyState title="No alerts for this device" />;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                    <tr className="border-b text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        <th className="px-3 py-2">Opened</th>
                        <th className="px-3 py-2">Code</th>
                        <th className="px-3 py-2">Alert</th>
                        <th className="px-3 py-2">Severity</th>
                        <th className="px-3 py-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id} className="border-b last:border-0">
                            <td className="px-3 py-3">
                                <div className="font-medium">
                                    {formatDateTime(row.opened_at)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {formatRelative(row.opened_at)}
                                </div>
                            </td>
                            <td className="px-3 py-3 font-medium">
                                {row.alert_code}
                            </td>
                            <td className="px-3 py-3">
                                <div className="font-medium">
                                    {row.alert_name}
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                    {row.alert_message}
                                </div>
                            </td>
                            <td className="px-3 py-3">
                                <SeverityBadge severity={row.severity_code} />
                            </td>
                            <td className="px-3 py-3">
                                <StatusBadge status={row.status_code} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function EventTimeline({
    rows,
}: {
    rows: DeviceModalDetail['event_logs'];
}) {
    if (rows.length === 0) {
        return <EmptyState title="No event timeline yet" />;
    }

    return (
        <div className="space-y-3">
            {rows.map((row) => (
                <div
                    key={row.id}
                    className="grid gap-3 rounded-xl border bg-background p-4 shadow-xs sm:grid-cols-[11rem_1fr]"
                >
                    <div>
                        <div className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                            {row.event_source}
                        </div>
                        <div className="mt-2 text-sm font-semibold text-foreground">
                            {row.event_type}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                            {formatDateTime(row.event_at)}
                        </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {row.event_message}
                    </div>
                </div>
            ))}
        </div>
    );
}

function hourLabel(value: string | null): string {
    if (!value) {
        return '--';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '--';
    }

    return date.getHours().toString().padStart(2, '0');
}
