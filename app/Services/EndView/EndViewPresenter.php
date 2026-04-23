<?php

namespace App\Services\EndView;

use App\Models\Company;
use App\Models\Device;
use App\Models\DeviceAlert;
use App\Models\DeviceCheckin;
use App\Models\DeviceEventLog;
use App\Models\DeviceMetricSnapshot;
use App\Models\DeviceStatus;
use App\Models\DeviceStorageSnapshot;
use App\Models\EndpointUser;
use App\Models\Site;
use Carbon\CarbonInterface;

class EndViewPresenter
{
    public function option(Company|Site|DeviceStatus $model): array
    {
        if ($model instanceof Company) {
            return [
                'id' => $model->id,
                'label' => $model->company_name,
            ];
        }

        if ($model instanceof Site) {
            return [
                'id' => $model->id,
                'label' => $model->site_name,
                'company_id' => $model->company_id,
            ];
        }

        return [
            'id' => $model->status_code,
            'label' => $model->status_name,
        ];
    }

    public function deviceListItem(Device $device): array
    {
        return [
            'id' => $device->id,
            'device_name' => $device->device_name,
            'hostname' => $device->hostname,
            'company' => $device->company?->company_name,
            'site' => $device->site?->site_name,
            'current_user' => $this->endpointUserName($device->currentUser),
            'last_logged_on_username' => $device->last_logged_on_username,
            'device_type' => $device->device_type,
            'os_name' => $device->os_name,
            'os_version' => $device->os_version,
            'ip_address' => $device->ipv4_address,
            'mac_address' => $device->mac_address,
            'status_code' => $device->current_status_code,
            'health_score' => $device->health_score,
            'last_checkin_at' => $this->date($device->last_checkin_at),
            'latest_metric' => $this->metricSummary($device->latestMetricSnapshot),
        ];
    }

    public function deviceSummary(Device $device): array
    {
        return [
            'id' => $device->id,
            'device_name' => $device->device_name,
            'hostname' => $device->hostname,
            'company' => $device->company?->company_name,
            'site' => $device->site?->site_name,
            'status_code' => $device->current_status_code,
            'health_score' => $device->health_score,
            'last_checkin_at' => $this->date($device->last_checkin_at),
        ];
    }

    public function deviceDetail(Device $device): array
    {
        return [
            'id' => $device->id,
            'company' => $device->company?->company_name,
            'site' => $device->site?->site_name,
            'current_user' => $this->endpointUserName($device->currentUser),
            'agent' => [
                'agent_version' => $device->agent?->agent_version,
                'is_active' => $device->agent?->is_active,
                'last_seen_ip' => $device->agent?->last_seen_ip,
                'last_seen_user_agent' => $device->agent?->last_seen_user_agent,
                'token_issued_at' => $this->date($device->agent?->token_issued_at),
                'token_expires_at' => $this->date($device->agent?->token_expires_at),
            ],
            'overview' => [
                'device_name' => $device->device_name,
                'hostname' => $device->hostname,
                'device_uuid' => $device->device_uuid,
                'status_code' => $device->current_status_code,
                'health_score' => $device->health_score,
                'last_logged_on_username' => $device->last_logged_on_username,
                'last_logon_at' => $this->date($device->last_logon_at),
                'enrolled_at' => $this->date($device->enrolled_at),
                'last_checkin_at' => $this->date($device->last_checkin_at),
                'last_inventory_at' => $this->date($device->last_inventory_at),
                'last_metrics_at' => $this->date($device->last_metrics_at),
            ],
            'hardware' => [
                'manufacturer' => $device->manufacturer,
                'model' => $device->model,
                'serial_number' => $device->serial_number,
                'bios_version' => $device->bios_version,
                'cpu_name' => $device->cpu_name,
                'cpu_physical_cores' => $device->cpu_physical_cores,
                'cpu_logical_cores' => $device->cpu_logical_cores,
                'total_memory_mb' => $device->total_memory_mb,
                'os_name' => $device->os_name,
                'os_version' => $device->os_version,
                'os_build' => $device->os_build,
                'os_architecture' => $device->os_architecture,
                'mac_address' => $device->mac_address,
                'ipv4_address' => $device->ipv4_address,
                'ipv6_address' => $device->ipv6_address,
                'fqdn' => $device->fqdn,
            ],
        ];
    }

    public function alert(DeviceAlert $alert): array
    {
        return [
            'id' => $alert->id,
            'opened_at' => $this->date($alert->opened_at),
            'device' => $alert->device ? $this->deviceSummary($alert->device) : null,
            'company' => $alert->device?->company?->company_name,
            'site' => $alert->device?->site?->site_name,
            'alert_code' => $alert->alert_code,
            'alert_name' => $alert->alert_name,
            'severity_code' => $alert->severity_code,
            'status_code' => $alert->status_code,
            'alert_message' => $alert->alert_message,
            'acknowledged_at' => $this->date($alert->acknowledged_at),
            'resolved_at' => $this->date($alert->resolved_at),
        ];
    }

    public function checkin(DeviceCheckin $checkin): array
    {
        return [
            'id' => $checkin->id,
            'checked_in_at' => $this->date($checkin->checked_in_at),
            'device' => $checkin->device ? $this->deviceSummary($checkin->device) : null,
            'status_code' => $checkin->status_code,
            'current_user_name' => $checkin->current_user_name,
            'ip_address' => $checkin->ip_address,
            'mac_address' => $checkin->mac_address,
            'agent_version' => $checkin->agent_version,
            'remarks' => $checkin->remarks,
        ];
    }

    public function event(DeviceEventLog $event): array
    {
        return [
            'id' => $event->id,
            'event_at' => $this->date($event->event_at),
            'device' => $event->device ? $this->deviceSummary($event->device) : null,
            'event_type' => $event->event_type,
            'event_source' => $event->event_source,
            'reference_id' => $event->reference_id,
            'event_message' => $event->event_message,
        ];
    }

    public function metricSnapshot(?DeviceMetricSnapshot $snapshot): ?array
    {
        if (!$snapshot) {
            return null;
        }

        return [
            'id' => $snapshot->id,
            'captured_at' => $this->date($snapshot->captured_at),
            'cpu_usage_percent' => $snapshot->cpu_usage_percent,
            'cpu_temperature_c' => $snapshot->cpu_temperature_c,
            'cpu_health_percent' => $snapshot->cpu_health_percent,
            'ram_total_mb' => $snapshot->ram_total_mb,
            'ram_used_mb' => $snapshot->ram_used_mb,
            'ram_free_mb' => $snapshot->ram_free_mb,
            'ram_usage_percent' => $snapshot->ram_usage_percent,
            'total_storage_gb' => $snapshot->total_storage_gb,
            'used_storage_gb' => $snapshot->used_storage_gb,
            'free_storage_gb' => $snapshot->free_storage_gb,
            'storage_usage_percent' => $snapshot->storage_usage_percent,
            'battery_percent' => $snapshot->battery_percent,
            'battery_health_percent' => $snapshot->battery_health_percent,
            'battery_cycle_count' => $snapshot->battery_cycle_count,
            'is_charging' => $snapshot->is_charging,
            'health_score' => $snapshot->health_score,
        ];
    }

    public function metricSummary(?DeviceMetricSnapshot $snapshot): ?array
    {
        if (!$snapshot) {
            return null;
        }

        return [
            'captured_at' => $this->date($snapshot->captured_at),
            'cpu_usage_percent' => $snapshot->cpu_usage_percent,
            'ram_usage_percent' => $snapshot->ram_usage_percent,
            'storage_usage_percent' => $snapshot->storage_usage_percent,
            'battery_percent' => $snapshot->battery_percent,
            'battery_health_percent' => $snapshot->battery_health_percent,
        ];
    }

    public function storageSnapshot(DeviceStorageSnapshot $snapshot): array
    {
        return [
            'id' => $snapshot->id,
            'drive_name' => $snapshot->drive_name,
            'drive_label' => $snapshot->drive_label,
            'file_system' => $snapshot->file_system,
            'total_gb' => $snapshot->total_gb,
            'used_gb' => $snapshot->used_gb,
            'free_gb' => $snapshot->free_gb,
            'used_percent' => $snapshot->used_percent,
        ];
    }

    public function riskMetric(DeviceMetricSnapshot $snapshot, string $metricKey): array
    {
        return [
            'device' => $this->deviceSummary($snapshot->device),
            'captured_at' => $this->date($snapshot->captured_at),
            'value' => $snapshot->{$metricKey},
            'health_score' => $snapshot->health_score,
        ];
    }

    private function endpointUserName(?EndpointUser $user): ?string
    {
        return $user?->full_name ?? $user?->username;
    }

    private function date(?CarbonInterface $date): ?string
    {
        return $date?->toIso8601String();
    }
}
