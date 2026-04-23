export type EndViewOption = {
    id: number | string;
    label: string;
    company_id?: number;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Paginated<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
};

export type MetricSummary = {
    captured_at: string | null;
    cpu_usage_percent: number | null;
    ram_usage_percent: number | null;
    storage_usage_percent: number | null;
    battery_percent: number | null;
    battery_health_percent: number | null;
};

export type MetricSnapshot = MetricSummary & {
    id: number;
    cpu_temperature_c: number | null;
    cpu_health_percent: number | null;
    ram_total_mb: number | null;
    ram_used_mb: number | null;
    ram_free_mb: number | null;
    total_storage_gb: number | null;
    used_storage_gb: number | null;
    free_storage_gb: number | null;
    battery_cycle_count: number | null;
    is_charging: boolean | null;
    health_score: number | null;
};

export type DeviceSummary = {
    id: number;
    device_name: string;
    hostname: string;
    company: string | null;
    site: string | null;
    status_code: string;
    health_score: number;
    last_checkin_at: string | null;
};

export type DeviceListItem = DeviceSummary & {
    current_user: string | null;
    last_logged_on_username: string | null;
    device_type: string | null;
    os_name: string | null;
    os_version: string | null;
    ip_address: string | null;
    mac_address: string | null;
    latest_metric: MetricSummary | null;
};

export type DeviceDetail = {
    id: number;
    company: string | null;
    site: string | null;
    current_user: string | null;
    agent: {
        agent_version: string | null;
        is_active: boolean | null;
        last_seen_ip: string | null;
        last_seen_user_agent: string | null;
        token_issued_at: string | null;
        token_expires_at: string | null;
    };
    overview: {
        device_name: string;
        hostname: string;
        device_uuid: string;
        status_code: string;
        health_score: number;
        last_logged_on_username: string | null;
        last_logon_at: string | null;
        enrolled_at: string | null;
        last_checkin_at: string | null;
        last_inventory_at: string | null;
        last_metrics_at: string | null;
    };
    hardware: {
        manufacturer: string | null;
        model: string | null;
        serial_number: string | null;
        bios_version: string | null;
        cpu_name: string | null;
        cpu_physical_cores: number | null;
        cpu_logical_cores: number | null;
        total_memory_mb: number | null;
        os_name: string | null;
        os_version: string | null;
        os_build: string | null;
        os_architecture: string | null;
        mac_address: string | null;
        ipv4_address: string | null;
        ipv6_address: string | null;
        fqdn: string | null;
    };
};

export type StorageSnapshot = {
    id: number;
    drive_name: string;
    drive_label: string | null;
    file_system: string | null;
    total_gb: number | null;
    used_gb: number | null;
    free_gb: number | null;
    used_percent: number | null;
};

export type AlertItem = {
    id: number;
    opened_at: string | null;
    device: DeviceSummary | null;
    company: string | null;
    site: string | null;
    alert_code: string;
    alert_name: string;
    severity_code: string;
    status_code: string;
    alert_message: string;
    acknowledged_at: string | null;
    resolved_at: string | null;
};

export type CheckinItem = {
    id: number;
    checked_in_at: string | null;
    device: DeviceSummary | null;
    status_code: string;
    current_user_name: string | null;
    ip_address: string | null;
    mac_address: string | null;
    agent_version: string | null;
    remarks: string | null;
};

export type EventLogItem = {
    id: number;
    event_at: string | null;
    device: DeviceSummary | null;
    event_type: string;
    event_source: string;
    reference_id: number | null;
    event_message: string;
};

export type RiskMetricDevice = {
    device: DeviceSummary;
    captured_at: string | null;
    value: number | null;
    health_score: number | null;
};

export type MetricTrend = {
    label: string;
    cpu_usage_percent: number;
    ram_usage_percent: number;
    storage_usage_percent: number;
};

export type DeviceFilters = {
    search: string;
    company_id: string | number | null;
    site_id: string | number | null;
    status_code: string | null;
    device_type: string | null;
    os_name: string | null;
    sort_by: string;
    sort_direction: 'asc' | 'desc';
};

export type DeviceFilterOptions = {
    companies: EndViewOption[];
    sites: EndViewOption[];
    statuses: EndViewOption[];
    device_types: string[];
    os_names: string[];
};

export type AlertFilters = {
    severity_code: string;
    status_code: string;
    company_id: string;
    site_id: string;
    date_from: string;
    date_to: string;
};

export type AlertFilterOptions = {
    severity_codes: string[];
    status_codes: string[];
    companies: EndViewOption[];
    sites: EndViewOption[];
};
