<?php

namespace App\Services\EndView;

use App\Models\Device;
use App\Models\DeviceAlert;
use App\Models\DeviceMetricSnapshot;

class DeviceAlertService
{
    public function __construct(private readonly DeviceEventLogService $eventLogs) {}

    /**
     * @return array{opened: list<DeviceAlert>, resolved: list<DeviceAlert>}
     */
    public function evaluate(Device $device, DeviceMetricSnapshot $metricSnapshot, array $metrics): array
    {
        $opened = [];
        $resolved = [];

        foreach ($this->definitions($metrics) as $definition) {
            if (! $definition['observed']) {
                continue;
            }

            $openAlert = DeviceAlert::query()
                ->where('device_id', $device->id)
                ->where('alert_code', $definition['alert_code'])
                ->where('status_code', 'OPEN')
                ->latest('opened_at')
                ->first();

            if ($definition['active']) {
                if (! $openAlert) {
                    $opened[] = $this->openAlert($device, $metricSnapshot, $definition);
                }

                continue;
            }

            if ($openAlert) {
                $resolved[] = $this->resolveAlert($device, $openAlert, $metricSnapshot);
            }
        }

        return [
            'opened' => $opened,
            'resolved' => $resolved,
        ];
    }

    /**
     * @return list<array{alert_code: string, alert_name: string, severity_code: string, alert_message: string, observed: bool, active: bool}>
     */
    private function definitions(array $metrics): array
    {
        return [
            $this->percentRule(
                $metrics,
                'cpu_usage_percent',
                'HIGH_CPU',
                'High CPU usage',
                'WARNING',
                'CPU usage reached %s%%.',
                (float) config('endview.health.cpu_usage_warning_percent', 90),
            ),
            $this->percentRule(
                $metrics,
                'ram_usage_percent',
                'HIGH_RAM',
                'High RAM usage',
                'WARNING',
                'RAM usage reached %s%%.',
                (float) config('endview.health.ram_usage_warning_percent', 90),
            ),
            $this->percentRule(
                $metrics,
                'storage_usage_percent',
                'LOW_STORAGE',
                'Low storage',
                'CRITICAL',
                'Storage usage reached %s%%.',
                (float) config('endview.health.storage_usage_warning_percent', 90),
            ),
            $this->percentRule(
                $metrics,
                'battery_health_percent',
                'LOW_BATTERY_HEALTH',
                'Low battery health',
                'WARNING',
                'Battery health dropped to %s%%.',
                (float) config('endview.health.battery_health_warning_percent', 60),
                true,
            ),
        ];
    }

    /**
     * @return array{alert_code: string, alert_name: string, severity_code: string, alert_message: string, observed: bool, active: bool}
     */
    private function percentRule(
        array $metrics,
        string $field,
        string $alertCode,
        string $alertName,
        string $severityCode,
        string $message,
        float $threshold,
        bool $lessThan = false,
    ): array {
        $observed = array_key_exists($field, $metrics) && $metrics[$field] !== null && $metrics[$field] !== '';
        $value = $observed ? (float) $metrics[$field] : null;

        return [
            'alert_code' => $alertCode,
            'alert_name' => $alertName,
            'severity_code' => $severityCode,
            'alert_message' => sprintf($message, $value === null ? 'unknown' : number_format($value, 2)),
            'observed' => $observed,
            'active' => $value !== null && ($lessThan ? $value < $threshold : $value >= $threshold),
        ];
    }

    private function openAlert(Device $device, DeviceMetricSnapshot $metricSnapshot, array $definition): DeviceAlert
    {
        $alert = DeviceAlert::create([
            'device_id' => $device->id,
            'metric_snapshot_id' => $metricSnapshot->id,
            'alert_code' => $definition['alert_code'],
            'alert_name' => $definition['alert_name'],
            'severity_code' => $definition['severity_code'],
            'alert_message' => $definition['alert_message'],
            'opened_at' => $metricSnapshot->captured_at,
            'status_code' => 'OPEN',
        ]);

        $this->eventLogs->log(
            $device,
            'ALERT_OPENED',
            $definition['alert_message'],
            'SYSTEM',
            $alert->id,
            $metricSnapshot->captured_at,
        );

        return $alert;
    }

    private function resolveAlert(Device $device, DeviceAlert $alert, DeviceMetricSnapshot $metricSnapshot): DeviceAlert
    {
        $alert->forceFill([
            'metric_snapshot_id' => $metricSnapshot->id,
            'resolved_at' => $metricSnapshot->captured_at,
            'status_code' => 'RESOLVED',
        ])->save();

        $this->eventLogs->log(
            $device,
            'ALERT_RESOLVED',
            "{$alert->alert_name} recovered.",
            'SYSTEM',
            $alert->id,
            $metricSnapshot->captured_at,
        );

        return $alert;
    }
}
