import { Head, Link, router } from '@inertiajs/react';
import { Eye, Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { DataTable } from '@/components/endview/data-table';
import type { DataTableColumn } from '@/components/endview/data-table';
import { HealthScore } from '@/components/endview/health-score';
import { Pagination } from '@/components/endview/pagination';
import { SectionPanel } from '@/components/endview/section-panel';
import { StatusBadge } from '@/components/endview/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    cleanParams,
    formatDateTime,
    formatPercent,
    formatRelative,
} from '@/lib/endview';
import { index as devicesIndex, show as showDevice } from '@/routes/devices';
import type {
    DeviceFilterOptions,
    DeviceFilters,
    DeviceListItem,
    Paginated,
} from '@/types';

type DevicesIndexProps = {
    devices: Paginated<DeviceListItem>;
    filters: DeviceFilters;
    options: DeviceFilterOptions;
};

export default function DevicesIndex({
    devices,
    filters,
    options,
}: DevicesIndexProps) {
    const [values, setValues] = useState({
        search: filters.search ?? '',
        company_id: filters.company_id?.toString() ?? '',
        site_id: filters.site_id?.toString() ?? '',
        status_code: filters.status_code ?? '',
        device_type: filters.device_type ?? '',
        os_name: filters.os_name ?? '',
    });

    const applyFilters = (
        next: Record<string, string | number | boolean | null | undefined>,
    ) => {
        router.get(devicesIndex(), cleanParams(next), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        applyFilters({
            ...values,
            sort_by: filters.sort_by,
            sort_direction: filters.sort_direction,
        });
    };

    const clearFilters = () => {
        setValues({
            search: '',
            company_id: '',
            site_id: '',
            status_code: '',
            device_type: '',
            os_name: '',
        });
        router.get(devicesIndex(), {}, { preserveScroll: true, replace: true });
    };

    const sort = (key: string) => {
        const direction =
            filters.sort_by === key && filters.sort_direction === 'asc'
                ? 'desc'
                : 'asc';

        applyFilters({
            ...values,
            sort_by: key,
            sort_direction: direction,
        });
    };

    const columns: DataTableColumn<DeviceListItem>[] = [
        {
            key: 'device_name',
            header: 'Device',
            sortable: true,
            render: (device) => (
                <div>
                    <Link
                        href={showDevice(device.id)}
                        className="font-semibold hover:underline"
                    >
                        {device.device_name}
                    </Link>
                    <div className="mt-1 text-xs text-muted-foreground">
                        {device.hostname}
                    </div>
                </div>
            ),
        },
        {
            key: 'company',
            header: 'Company',
            sortable: true,
            render: (device) => device.company ?? 'n/a',
        },
        {
            key: 'site',
            header: 'Site',
            sortable: true,
            render: (device) => device.site ?? 'n/a',
        },
        {
            key: 'user',
            header: 'User',
            render: (device) => (
                <div>
                    <div>{device.current_user ?? 'n/a'}</div>
                    <div className="text-xs text-muted-foreground">
                        {device.last_logged_on_username ?? 'No login'}
                    </div>
                </div>
            ),
        },
        {
            key: 'device_type',
            header: 'Type',
            sortable: true,
            render: (device) => device.device_type ?? 'n/a',
        },
        {
            key: 'os_name',
            header: 'OS',
            sortable: true,
            render: (device) => (
                <div>
                    <div>{device.os_name ?? 'n/a'}</div>
                    <div className="text-xs text-muted-foreground">
                        {device.os_version ?? ''}
                    </div>
                </div>
            ),
        },
        {
            key: 'network',
            header: 'Network',
            render: (device) => (
                <div>
                    <div>{device.ip_address ?? 'n/a'}</div>
                    <div className="text-xs text-muted-foreground">
                        {device.mac_address ?? 'No MAC'}
                    </div>
                </div>
            ),
        },
        {
            key: 'status_code',
            header: 'Status',
            sortable: true,
            render: (device) => <StatusBadge status={device.status_code} />,
        },
        {
            key: 'health_score',
            header: 'Health',
            sortable: true,
            render: (device) => (
                <HealthScore score={device.health_score} compact />
            ),
        },
        {
            key: 'metrics',
            header: 'Latest Metrics',
            render: (device) => (
                <MetricSummary latestMetric={device.latest_metric} />
            ),
        },
        {
            key: 'last_checkin_at',
            header: 'Last Check-in',
            sortable: true,
            render: (device) => (
                <div>
                    <div className="font-medium">
                        {formatRelative(device.last_checkin_at)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {formatDateTime(device.last_checkin_at)}
                    </div>
                </div>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (device) => (
                <Button asChild variant="outline" size="sm">
                    <Link href={showDevice(device.id)}>
                        <Eye className="size-4" />
                        View
                    </Link>
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Devices" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-normal">
                        Devices
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Inventory, status, health, and latest telemetry for
                        monitored endpoints.
                    </p>
                </div>

                <SectionPanel title="Filters">
                    <form
                        onSubmit={submit}
                        className="grid gap-3 lg:grid-cols-[1.5fr_repeat(5,1fr)_auto]"
                    >
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={values.search}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        search: event.target.value,
                                    }))
                                }
                                className="pl-9"
                                placeholder="Search devices"
                            />
                        </div>
                        <FilterSelect
                            value={values.company_id}
                            onChange={(company_id) =>
                                setValues((current) => ({
                                    ...current,
                                    company_id,
                                }))
                            }
                            options={options.companies.map((option) => ({
                                value: String(option.id),
                                label: option.label,
                            }))}
                            placeholder="All companies"
                        />
                        <FilterSelect
                            value={values.site_id}
                            onChange={(site_id) =>
                                setValues((current) => ({
                                    ...current,
                                    site_id,
                                }))
                            }
                            options={options.sites.map((option) => ({
                                value: String(option.id),
                                label: option.label,
                            }))}
                            placeholder="All sites"
                        />
                        <FilterSelect
                            value={values.status_code}
                            onChange={(status_code) =>
                                setValues((current) => ({
                                    ...current,
                                    status_code,
                                }))
                            }
                            options={options.statuses.map((option) => ({
                                value: String(option.id),
                                label: option.label,
                            }))}
                            placeholder="All statuses"
                        />
                        <FilterSelect
                            value={values.device_type}
                            onChange={(device_type) =>
                                setValues((current) => ({
                                    ...current,
                                    device_type,
                                }))
                            }
                            options={options.device_types.map((deviceType) => ({
                                value: deviceType,
                                label: deviceType,
                            }))}
                            placeholder="All types"
                        />
                        <FilterSelect
                            value={values.os_name}
                            onChange={(os_name) =>
                                setValues((current) => ({
                                    ...current,
                                    os_name,
                                }))
                            }
                            options={options.os_names.map((osName) => ({
                                value: osName,
                                label: osName,
                            }))}
                            placeholder="All OS"
                        />
                        <div className="flex gap-2">
                            <Button type="submit">
                                <SlidersHorizontal className="size-4" />
                                Apply
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={clearFilters}
                            >
                                <X className="size-4" />
                            </Button>
                        </div>
                    </form>
                </SectionPanel>

                <SectionPanel title="Device Inventory">
                    <DataTable
                        rows={devices.data}
                        columns={columns}
                        getRowKey={(device) => device.id}
                        emptyTitle="No devices match the current filters"
                        sortBy={filters.sort_by}
                        sortDirection={filters.sort_direction}
                        onSort={sort}
                    />
                    <Pagination
                        links={devices.links}
                        from={devices.from}
                        to={devices.to}
                        total={devices.total}
                    />
                </SectionPanel>
            </div>
        </>
    );
}

function FilterSelect({
    value,
    onChange,
    options,
    placeholder,
}: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
}) {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}

function MetricSummary({
    latestMetric,
}: {
    latestMetric: DeviceListItem['latest_metric'];
}) {
    if (!latestMetric) {
        return <span className="text-muted-foreground">No metrics</span>;
    }

    return (
        <div className="grid min-w-36 gap-1 text-xs">
            <span>CPU {formatPercent(latestMetric.cpu_usage_percent)}</span>
            <span>RAM {formatPercent(latestMetric.ram_usage_percent)}</span>
            <span>
                Storage {formatPercent(latestMetric.storage_usage_percent)}
            </span>
        </div>
    );
}

DevicesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Devices',
            href: devicesIndex(),
        },
    ],
};
