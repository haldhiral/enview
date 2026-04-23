import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { DeviceFilterOptions, DeviceFilters } from '@/types';

type FilterValues = {
    search: string;
    company_id: string;
    site_id: string;
    status_code: string;
    device_type: string;
    os_name: string;
};

function valuesFromFilters(filters: DeviceFilters): FilterValues {
    return {
        search: filters.search ?? '',
        company_id: filters.company_id?.toString() ?? '',
        site_id: filters.site_id?.toString() ?? '',
        status_code: filters.status_code ?? '',
        device_type: filters.device_type ?? '',
        os_name: filters.os_name ?? '',
    };
}

export function DeviceFilters({
    filters,
    options,
    onApply,
    onClear,
}: {
    filters: DeviceFilters;
    options: DeviceFilterOptions;
    onApply: (filters: FilterValues) => void;
    onClear: () => void;
}) {
    const [values, setValues] = useState<FilterValues>(() =>
        valuesFromFilters(filters),
    );

    useEffect(() => {
        setValues(valuesFromFilters(filters));
    }, [filters]);

    const filteredSites = useMemo(() => {
        if (!values.company_id) {
            return options.sites;
        }

        return options.sites.filter(
            (site) => String(site.company_id) === values.company_id,
        );
    }, [options.sites, values.company_id]);

    const activeFilterCount = Object.values(values).filter(Boolean).length;

    return (
        <section className="rounded-xl border bg-card/95 shadow-sm">
            <div className="flex flex-col gap-2 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-base font-semibold tracking-normal">
                        Device Filters
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Narrow the console by status, company, site, type, or
                        operating system.
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-xs">
                    <SlidersHorizontal className="size-3.5" />
                    {activeFilterCount} active filters
                </div>
            </div>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    onApply(values);
                }}
                className="grid gap-3 px-5 py-5 md:grid-cols-2 xl:grid-cols-[1.7fr_repeat(5,minmax(0,1fr))_auto]"
            >
                <div className="relative md:col-span-2 xl:col-span-1">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={values.search}
                        onChange={(event) =>
                            setValues((current) => ({
                                ...current,
                                search: event.target.value,
                            }))
                        }
                        placeholder="Search device, hostname, IP, MAC, or user"
                        className="h-10 pl-9"
                    />
                </div>

                <FilterSelect
                    value={values.status_code}
                    onChange={(status_code) =>
                        setValues((current) => ({ ...current, status_code }))
                    }
                    placeholder="All statuses"
                    options={options.statuses.map((option) => ({
                        value: String(option.id),
                        label: option.label,
                    }))}
                />
                <FilterSelect
                    value={values.company_id}
                    onChange={(company_id) =>
                        setValues((current) => ({
                            ...current,
                            company_id,
                            site_id: '',
                        }))
                    }
                    placeholder="All companies"
                    options={options.companies.map((option) => ({
                        value: String(option.id),
                        label: option.label,
                    }))}
                />
                <FilterSelect
                    value={values.site_id}
                    onChange={(site_id) =>
                        setValues((current) => ({ ...current, site_id }))
                    }
                    placeholder="All sites"
                    options={filteredSites.map((option) => ({
                        value: String(option.id),
                        label: option.label,
                    }))}
                />
                <FilterSelect
                    value={values.device_type}
                    onChange={(device_type) =>
                        setValues((current) => ({ ...current, device_type }))
                    }
                    placeholder="All device types"
                    options={options.device_types.map((deviceType) => ({
                        value: deviceType,
                        label: deviceType,
                    }))}
                />
                <FilterSelect
                    value={values.os_name}
                    onChange={(os_name) =>
                        setValues((current) => ({ ...current, os_name }))
                    }
                    placeholder="All OS"
                    options={options.os_names.map((osName) => ({
                        value: osName,
                        label: osName,
                    }))}
                />

                <div className="flex gap-2">
                    <Button type="submit" className="flex-1 sm:flex-none">
                        Apply
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                            setValues(valuesFromFilters({
                                ...filters,
                                search: '',
                                company_id: null,
                                site_id: null,
                                status_code: null,
                                device_type: null,
                                os_name: null,
                            }));
                            onClear();
                        }}
                    >
                        <X className="size-4" />
                    </Button>
                </div>
            </form>
        </section>
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
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm shadow-xs outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
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
