import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { EmptyState } from '@/components/endview/empty-state';
import { HealthScore } from '@/components/endview/health-score';
import { MetricMiniBar } from '@/components/endview/metric-mini-bar';
import { Pagination } from '@/components/endview/pagination';
import { StatusBadge } from '@/components/endview/status-badge';
import { Button } from '@/components/ui/button';
import {
    formatDateTime,
    formatRelative,
} from '@/lib/endview';
import { cn } from '@/lib/utils';
import type { DeviceFilters, DeviceListItem, Paginated } from '@/types';

type SortableKey =
    | 'device_name'
    | 'company'
    | 'site'
    | 'device_type'
    | 'os_name'
    | 'status_code'
    | 'health_score'
    | 'last_checkin_at';

const sortableHeaders: {
    key: SortableKey;
    label: string;
    className?: string;
}[] = [
    { key: 'device_name', label: 'Device', className: 'min-w-[18rem]' },
    { key: 'company', label: 'Location', className: 'min-w-[12rem]' },
    { key: 'device_type', label: 'Platform', className: 'min-w-[10rem]' },
    { key: 'status_code', label: 'Status', className: 'min-w-[11rem]' },
    { key: 'health_score', label: 'Health', className: 'min-w-[9rem]' },
    { key: 'last_checkin_at', label: 'Last Check-in', className: 'min-w-[10rem]' },
];

export function DeviceMonitoringList({
    devices,
    filters,
    onSort,
    onSelectDevice,
}: {
    devices: Paginated<DeviceListItem>;
    filters: DeviceFilters;
    onSort: (key: SortableKey) => void;
    onSelectDevice: (device: DeviceListItem) => void;
}) {
    return (
        <section className="overflow-hidden rounded-xl border bg-card/95 shadow-sm">
            <div className="flex flex-col gap-2 border-b bg-gradient-to-r from-muted/40 via-card to-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <span
                        aria-hidden="true"
                        className="mt-1 h-6 w-1 rounded-full bg-gradient-to-b from-sky-500 to-emerald-500"
                    />
                    <div>
                        <h2 className="text-base font-semibold tracking-tight text-foreground">
                            Device Monitor
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Click any device to inspect full detail in a modal
                            without leaving the dashboard.
                        </p>
                    </div>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs font-medium shadow-xs">
                    <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]" />
                    <span className="font-semibold tabular-nums text-foreground">
                        {devices.total}
                    </span>
                    <span className="text-muted-foreground">
                        devices in scope
                    </span>
                </div>
            </div>

            {devices.data.length === 0 ? (
                <div className="p-5">
                    <EmptyState
                        title="No devices match the current filters"
                        description="Try clearing filters or changing the search terms."
                    />
                </div>
            ) : (
                <>
                    <div className="hidden overflow-x-auto xl:block">
                        <table className="w-full min-w-[1260px] text-left">
                            <thead>
                                <tr className="border-b bg-muted/40 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                    {sortableHeaders.map((header) => (
                                        <th
                                            key={header.key}
                                            className={cn('px-4 py-3', header.className)}
                                        >
                                            <SortButton
                                                label={header.label}
                                                active={filters.sort_by === header.key}
                                                direction={filters.sort_direction}
                                                onClick={() => onSort(header.key)}
                                            />
                                        </th>
                                    ))}
                                    <th className="min-w-[16rem] px-4 py-3">
                                        Utilization
                                    </th>
                                    <th className="min-w-[10rem] px-4 py-3">
                                        Operator
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {devices.data.map((device) => (
                                    <tr
                                        key={device.id}
                                        tabIndex={0}
                                        role="button"
                                        onClick={() => onSelectDevice(device)}
                                        onKeyDown={(event) => {
                                            if (
                                                event.key === 'Enter' ||
                                                event.key === ' '
                                            ) {
                                                event.preventDefault();
                                                onSelectDevice(device);
                                            }
                                        }}
                                        className="group cursor-pointer border-b transition even:bg-muted/10 hover:bg-sky-50/50 focus-visible:bg-sky-50/50 focus-visible:outline-none dark:hover:bg-sky-950/20 dark:focus-visible:bg-sky-950/20"
                                    >
                                        <td className="relative px-4 py-4 align-top">
                                            <span
                                                aria-hidden="true"
                                                className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-sky-500 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100"
                                            />
                                            <div className="min-w-0">
                                                <div className="truncate text-sm font-semibold text-foreground transition group-hover:text-sky-700 dark:group-hover:text-sky-300">
                                                    {device.device_name}
                                                </div>
                                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                    <span className="font-mono">{device.hostname}</span>
                                                    <span className="size-1 rounded-full bg-border" />
                                                    <span className="font-mono">{device.ip_address ?? 'No IP'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 align-top">
                                            <div className="space-y-1 text-sm">
                                                <div className="font-medium text-foreground">
                                                    {device.company ?? 'No company'}
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {device.site ?? 'No site'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 align-top">
                                            <div className="space-y-1 text-sm">
                                                <div className="font-medium text-foreground">
                                                    {device.device_type ?? 'Unknown type'}
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {device.os_name ?? 'Unknown OS'}
                                                    {device.os_version
                                                        ? ` ${device.os_version}`
                                                        : ''}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 align-top">
                                            <div className="space-y-2">
                                                <StatusBadge
                                                    status={device.status_code}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    {device.mac_address ?? 'No MAC'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 align-top">
                                            <HealthScore
                                                score={device.health_score}
                                            />
                                        </td>
                                        <td className="px-4 py-4 align-top">
                                            <div className="space-y-2">
                                                <div className="text-sm font-medium text-foreground">
                                                    {formatRelative(
                                                        device.last_checkin_at,
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {formatDateTime(
                                                        device.last_checkin_at,
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 align-top">
                                            <div className="grid gap-2">
                                                <MetricMiniBar
                                                    label="CPU"
                                                    value={
                                                        device.latest_metric
                                                            ?.cpu_usage_percent
                                                    }
                                                />
                                                <MetricMiniBar
                                                    label="RAM"
                                                    value={
                                                        device.latest_metric
                                                            ?.ram_usage_percent
                                                    }
                                                />
                                                <MetricMiniBar
                                                    label="Storage"
                                                    value={
                                                        device.latest_metric
                                                            ?.storage_usage_percent
                                                    }
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 align-top">
                                            <div className="space-y-1 text-sm">
                                                <div className="font-medium text-foreground">
                                                    {device.current_user ?? 'No active user'}
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {device.last_logged_on_username ??
                                                        'No recent login'}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid gap-3 p-4 xl:hidden">
                        {devices.data.map((device) => (
                            <button
                                key={device.id}
                                type="button"
                                onClick={() => onSelectDevice(device)}
                                className="grid gap-4 rounded-xl border bg-background p-4 text-left shadow-xs transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md dark:hover:border-sky-900/60"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-semibold text-foreground">
                                            {device.device_name}
                                        </div>
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            {device.hostname}
                                        </div>
                                    </div>
                                    <StatusBadge status={device.status_code} />
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <InfoBlock
                                        label="Location"
                                        value={`${device.company ?? 'No company'} / ${device.site ?? 'No site'}`}
                                    />
                                    <InfoBlock
                                        label="Platform"
                                        value={`${device.device_type ?? 'Unknown'} / ${device.os_name ?? 'Unknown OS'}`}
                                    />
                                    <InfoBlock
                                        label="Network"
                                        value={device.ip_address ?? 'No IP'}
                                        secondary={device.mac_address ?? 'No MAC'}
                                    />
                                    <InfoBlock
                                        label="Operator"
                                        value={device.current_user ?? 'No active user'}
                                        secondary={
                                            device.last_logged_on_username ??
                                            'No recent login'
                                        }
                                    />
                                </div>

                                <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-start">
                                    <div className="rounded-lg border bg-card px-3 py-2">
                                        <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                                            Health
                                        </div>
                                        <div className="mt-2">
                                            <HealthScore
                                                score={device.health_score}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-2 rounded-lg border bg-card px-3 py-3">
                                        <div className="grid gap-2 sm:grid-cols-3">
                                            <MetricMiniBar
                                                label="CPU"
                                                value={
                                                    device.latest_metric
                                                        ?.cpu_usage_percent
                                                }
                                            />
                                            <MetricMiniBar
                                                label="RAM"
                                                value={
                                                    device.latest_metric
                                                        ?.ram_usage_percent
                                                }
                                            />
                                            <MetricMiniBar
                                                label="Storage"
                                                value={
                                                    device.latest_metric
                                                        ?.storage_usage_percent
                                                }
                                            />
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Last check-in{' '}
                                            <span className="font-medium text-foreground">
                                                {formatRelative(
                                                    device.last_checkin_at,
                                                )}
                                            </span>{' '}
                                            ({formatDateTime(device.last_checkin_at)})
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </>
            )}

            <Pagination
                links={devices.links}
                from={devices.from}
                to={devices.to}
                total={devices.total}
            />
        </section>
    );
}

function SortButton({
    label,
    active,
    direction,
    onClick,
}: {
    label: string;
    active: boolean;
    direction: 'asc' | 'desc';
    onClick: () => void;
}) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            className="-ml-2 h-8 px-2 text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
        >
            {label}
            {active ? (
                direction === 'asc' ? (
                    <ArrowUp className="size-3.5" />
                ) : (
                    <ArrowDown className="size-3.5" />
                )
            ) : (
                <ArrowUpDown className="size-3.5" />
            )}
        </Button>
    );
}

function InfoBlock({
    label,
    value,
    secondary,
}: {
    label: string;
    value: string;
    secondary?: string;
}) {
    return (
        <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {label}
            </div>
            <div className="mt-1 text-sm font-medium text-foreground">
                {value}
            </div>
            {secondary && (
                <div className="mt-1 text-xs text-muted-foreground">
                    {secondary}
                </div>
            )}
        </div>
    );
}
