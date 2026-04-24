import { Head, Link, router } from '@inertiajs/react';
import { Filter, SearchX } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { DataTable } from '@/components/endview/data-table';
import type { DataTableColumn } from '@/components/endview/data-table';
import { Pagination } from '@/components/endview/pagination';
import { SectionPanel } from '@/components/endview/section-panel';
import { SeverityBadge } from '@/components/endview/severity-badge';
import { StatusBadge } from '@/components/endview/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cleanParams, formatDateTime } from '@/lib/endview';
import { index as alertsIndex } from '@/routes/alerts';
import { show as showDevice } from '@/routes/devices';
import type {
    AlertFilterOptions,
    AlertFilters,
    AlertItem,
    Paginated,
} from '@/types';

type AlertsIndexProps = {
    alerts: Paginated<AlertItem>;
    filters: AlertFilters;
    options: AlertFilterOptions;
};

export default function AlertsIndex({
    alerts,
    filters,
    options,
}: AlertsIndexProps) {
    const [values, setValues] = useState(filters);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        router.get(alertsIndex(), cleanParams(values), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        const emptyFilters = {
            severity_code: '',
            status_code: '',
            company_id: '',
            site_id: '',
            date_from: '',
            date_to: '',
        };

        setValues(emptyFilters);
        router.get(alertsIndex(), {}, { preserveScroll: true, replace: true });
    };

    const columns: DataTableColumn<AlertItem>[] = [
        {
            key: 'opened_at',
            header: 'Opened',
            render: (alert) => formatDateTime(alert.opened_at),
        },
        {
            key: 'device',
            header: 'Device',
            render: (alert) =>
                alert.device ? (
                    <Link
                        href={showDevice(alert.device.id)}
                        className="font-semibold hover:underline"
                    >
                        {alert.device.hostname}
                    </Link>
                ) : (
                    'n/a'
                ),
        },
        {
            key: 'company',
            header: 'Company',
            render: (alert) => alert.company ?? 'n/a',
        },
        { key: 'site', header: 'Site', render: (alert) => alert.site ?? 'n/a' },
        {
            key: 'alert_code',
            header: 'Code',
            render: (alert) => alert.alert_code,
        },
        {
            key: 'alert_name',
            header: 'Alert',
            render: (alert) => (
                <div>
                    <div className="font-medium">{alert.alert_name}</div>
                    <div className="max-w-xl text-xs text-muted-foreground">
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
        {
            key: 'acknowledged_at',
            header: 'Acknowledged',
            render: (alert) => formatDateTime(alert.acknowledged_at),
        },
        {
            key: 'resolved_at',
            header: 'Resolved',
            render: (alert) => formatDateTime(alert.resolved_at),
        },
    ];

    return (
        <>
            <Head title="Alerts" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-normal">
                        Alerts
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Open, acknowledged, and resolved endpoint health alerts.
                    </p>
                </div>

                <SectionPanel title="Filters">
                    <form
                        onSubmit={submit}
                        className="grid gap-3 lg:grid-cols-[repeat(6,1fr)_auto]"
                    >
                        <FilterSelect
                            value={values.severity_code}
                            onChange={(severity_code) =>
                                setValues((current) => ({
                                    ...current,
                                    severity_code,
                                }))
                            }
                            options={options.severity_codes.map((severity) => ({
                                value: severity,
                                label: severity,
                            }))}
                            placeholder="All severities"
                        />
                        <FilterSelect
                            value={values.status_code}
                            onChange={(status_code) =>
                                setValues((current) => ({
                                    ...current,
                                    status_code,
                                }))
                            }
                            options={options.status_codes.map((status) => ({
                                value: status,
                                label: status,
                            }))}
                            placeholder="All statuses"
                        />
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
                        <Input
                            type="date"
                            value={values.date_from}
                            onChange={(event) =>
                                setValues((current) => ({
                                    ...current,
                                    date_from: event.target.value,
                                }))
                            }
                        />
                        <Input
                            type="date"
                            value={values.date_to}
                            onChange={(event) =>
                                setValues((current) => ({
                                    ...current,
                                    date_to: event.target.value,
                                }))
                            }
                        />
                        <div className="flex gap-2">
                            <Button type="submit">
                                <Filter className="size-4" />
                                Apply
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={clearFilters}
                            >
                                <SearchX className="size-4" />
                            </Button>
                        </div>
                    </form>
                </SectionPanel>

                <SectionPanel title="Alert Queue">
                    <DataTable
                        rows={alerts.data}
                        columns={columns}
                        getRowKey={(alert) => alert.id}
                        emptyTitle="No alerts match the current filters"
                    />
                    <Pagination
                        links={alerts.links}
                        from={alerts.from}
                        to={alerts.to}
                        total={alerts.total}
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

AlertsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Alerts',
            href: alertsIndex(),
        },
    ],
};
