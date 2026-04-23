<?php

namespace App\Services\EndView;

use App\Exceptions\DeviceNotRegisteredException;
use App\Models\Device;
use App\Models\DeviceBatterySnapshot;
use App\Models\DeviceMetricSnapshot;
use App\Models\DeviceStorageSnapshot;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AgentMetricsService
{
    public function __construct(
        private readonly DeviceHealthService $health,
        private readonly DeviceAlertService $alerts,
        private readonly DeviceEventLogService $eventLogs,
    ) {}

    /**
     * @return array{device: Device, metric_snapshot: DeviceMetricSnapshot, alerts: array{opened: list<\App\Models\DeviceAlert>, resolved: list<\App\Models\DeviceAlert>}}
     */
    public function record(array $payload): array
    {
        return DB::transaction(function () use ($payload): array {
            $device = $this->findDevice($payload['device_uuid']);
            $capturedAt = Carbon::parse($payload['captured_at']);
            $healthScore = $this->health->score($payload, $device->last_checkin_at);

            $metricSnapshot = DeviceMetricSnapshot::create([
                ...$this->metricAttributes($payload),
                'device_id' => $device->id,
                'captured_at' => $capturedAt,
                'is_online' => $device->current_status_code !== 'OFFLINE',
                'health_score' => $healthScore,
            ]);

            foreach ($payload['drives'] ?? [] as $drive) {
                $this->recordDrive($device, $metricSnapshot, $capturedAt, $drive);
            }

            if ($this->hasBatteryData($payload)) {
                $this->recordBattery($device, $metricSnapshot, $capturedAt, $payload);
            }

            $device->forceFill([
                'last_metrics_at' => $capturedAt,
                'health_score' => $healthScore,
                'current_status_code' => $this->health->statusForScore($healthScore, $device->last_checkin_at),
            ])->save();

            $device->refresh();
            $alerts = $this->alerts->evaluate($device, $metricSnapshot, $payload);

            $this->eventLogs->log(
                $device,
                'METRICS_RECEIVED',
                'Agent metrics snapshot was processed.',
                'AGENT',
                $metricSnapshot->id,
                $capturedAt,
            );

            return [
                'device' => $device,
                'metric_snapshot' => $metricSnapshot,
                'alerts' => $alerts,
            ];
        });
    }

    private function findDevice(string $deviceUuid): Device
    {
        $device = Device::query()
            ->where('device_uuid', $deviceUuid)
            ->first();

        if (! $device) {
            throw new DeviceNotRegisteredException($deviceUuid);
        }

        return $device;
    }

    private function metricAttributes(array $payload): array
    {
        return Arr::only($payload, [
            'cpu_usage_percent',
            'cpu_temperature_c',
            'cpu_health_percent',
            'ram_total_mb',
            'ram_used_mb',
            'ram_free_mb',
            'ram_usage_percent',
            'total_storage_gb',
            'used_storage_gb',
            'free_storage_gb',
            'storage_usage_percent',
            'battery_percent',
            'battery_health_percent',
            'battery_cycle_count',
            'is_charging',
        ]);
    }

    private function recordDrive(Device $device, DeviceMetricSnapshot $metricSnapshot, Carbon $capturedAt, array $drive): void
    {
        DeviceStorageSnapshot::create([
            'device_id' => $device->id,
            'metric_snapshot_id' => $metricSnapshot->id,
            'drive_name' => $drive['drive_name'],
            'drive_label' => $drive['drive_label'] ?? null,
            'file_system' => $drive['file_system'] ?? null,
            'total_gb' => $drive['total_gb'] ?? null,
            'used_gb' => $drive['used_gb'] ?? null,
            'free_gb' => $drive['free_gb'] ?? null,
            'used_percent' => $drive['used_percent'] ?? null,
        ]);
    }

    private function hasBatteryData(array $payload): bool
    {
        foreach (['battery_percent', 'battery_health_percent', 'battery_cycle_count', 'is_charging'] as $field) {
            if (array_key_exists($field, $payload) && $payload[$field] !== null) {
                return true;
            }
        }

        return false;
    }

    private function recordBattery(Device $device, DeviceMetricSnapshot $metricSnapshot, Carbon $capturedAt, array $payload): void
    {
        DeviceBatterySnapshot::create([
            'device_id' => $device->id,
            'captured_at' => $capturedAt,
            'battery_percent' => $payload['battery_percent'] ?? null,
            'battery_health_percent' => $payload['battery_health_percent'] ?? null,
            'battery_cycle_count' => $payload['battery_cycle_count'] ?? null,
            'battery_status' => match ($payload['is_charging'] ?? null) {
                true => 'Charging',
                false => 'Discharging',
                default => null,
            },
            'is_charging' => $payload['is_charging'] ?? null,
        ]);
    }
}
