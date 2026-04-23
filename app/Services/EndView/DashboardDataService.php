<?php

namespace App\Services\EndView;

use App\Models\Device;
use App\Models\DeviceAlert;
use App\Models\DeviceCheckin;
use App\Models\DeviceEventLog;
use App\Models\DeviceMetricSnapshot;
use App\Models\DeviceStatus;
use Illuminate\Support\Facades\DB;

class DashboardDataService
{
    public function __construct(private readonly EndViewPresenter $presenter)
    {
    }

    public function data(): array
    {
        $devices = Device::query()->active();

        return [
            'last_updated_at' => now()->toIso8601String(),
            'summary' => [
                'total_devices' => (clone $devices)->count(),
                'online_devices' => (clone $devices)->where('current_status_code', 'ONLINE')->count(),
                'offline_devices' => (clone $devices)->where('current_status_code', 'OFFLINE')->count(),
                'warning_devices' => (clone $devices)->where('current_status_code', 'WARNING')->count(),
                'critical_devices' => (clone $devices)->where('current_status_code', 'CRITICAL')->count(),
                'open_alerts' => DeviceAlert::query()->where('status_code', 'OPEN')->count(),
                'acknowledged_alerts' => DeviceAlert::query()->where('status_code', 'ACK')->count(),
                'resolved_alerts' => DeviceAlert::query()->where('status_code', 'RESOLVED')->count(),
            ],
            'status_breakdown' => $this->statusBreakdown(),
            'recent_alerts' => DeviceAlert::query()
                ->with(['device.company', 'device.site'])
                ->latest('opened_at')
                ->limit(8)
                ->get()
                ->map(fn(DeviceAlert $alert) => $this->presenter->alert($alert))
                ->values(),
            'recent_offline_devices' => Device::query()
                ->active()
                ->with(['company', 'site'])
                ->where('current_status_code', 'OFFLINE')
                ->latest('last_checkin_at')
                ->limit(8)
                ->get()
                ->map(fn(Device $device) => $this->presenter->deviceSummary($device))
                ->values(),
            'latest_checkins' => DeviceCheckin::query()
                ->with(['device.company', 'device.site'])
                ->latest('checked_in_at')
                ->limit(8)
                ->get()
                ->map(fn(DeviceCheckin $checkin) => $this->presenter->checkin($checkin))
                ->values(),
            'risky_storage_devices' => $this->riskMetricDevices('storage_usage_percent', 'desc', 8),
            'low_battery_health_devices' => $this->riskMetricDevices('battery_health_percent', 'asc', 8),
            'recent_events' => DeviceEventLog::query()
                ->with(['device.company', 'device.site'])
                ->latest('event_at')
                ->limit(10)
                ->get()
                ->map(fn(DeviceEventLog $event) => $this->presenter->event($event))
                ->values(),
            'metric_trends' => $this->metricTrends(),
        ];
    }

    private function statusBreakdown(): array
    {
        $counts = Device::query()
            ->active()
            ->select('current_status_code', DB::raw('COUNT(*) as aggregate'))
            ->groupBy('current_status_code')
            ->pluck('aggregate', 'current_status_code');

        return DeviceStatus::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn(DeviceStatus $status) => [
                'status_code' => $status->status_code,
                'status_name' => $status->status_name,
                'count' => (int) ($counts[$status->status_code] ?? 0),
            ])
            ->values()
            ->all();
    }

    private function riskMetricDevices(string $metricKey, string $direction, int $limit): array
    {
        $latestSnapshotIds = DeviceMetricSnapshot::query()
            ->selectRaw('MAX(id)')
            ->groupBy('device_id');

        $query = DeviceMetricSnapshot::query()
            ->with(['device.company', 'device.site'])
            ->whereIn('id', $latestSnapshotIds)
            ->whereNotNull($metricKey)
            ->whereHas('device', fn($query) => $query->active());

        $direction === 'desc'
            ? $query->orderByDesc($metricKey)
            : $query->orderBy($metricKey);

        return $query
            ->limit($limit)
            ->get()
            ->map(fn(DeviceMetricSnapshot $snapshot) => $this->presenter->riskMetric($snapshot, $metricKey))
            ->values()
            ->all();
    }

    private function metricTrends(): array
    {
        return DeviceMetricSnapshot::query()
            ->selectRaw(
                'DATE(captured_at) as label, ROUND(AVG(cpu_usage_percent), 1) as cpu_usage_percent, ROUND(AVG(ram_usage_percent), 1) as ram_usage_percent, ROUND(AVG(storage_usage_percent), 1) as storage_usage_percent'
            )
            ->where('captured_at', '>=', now()->subDays(7))
            ->groupByRaw('DATE(captured_at)')
            ->orderBy('label')
            ->get()
            ->map(fn($row) => [
                'label' => $row->label,
                'cpu_usage_percent' => (float) $row->cpu_usage_percent,
                'ram_usage_percent' => (float) $row->ram_usage_percent,
                'storage_usage_percent' => (float) $row->storage_usage_percent,
            ])
            ->values()
            ->all();
    }
}
