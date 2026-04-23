<?php

namespace App\Services\EndView;

use App\Models\Device;
use App\Models\DeviceAlert;
use App\Models\DeviceCheckin;
use App\Models\DeviceEventLog;
use App\Models\DeviceMetricSnapshot;
use App\Models\DeviceStorageSnapshot;

class DeviceDetailService
{
    public function __construct(private readonly EndViewPresenter $presenter)
    {
    }

    public function data(int $deviceId): array
    {
        $device = Device::query()
            ->active()
            ->with(['company', 'site', 'currentUser', 'agent', 'latestMetricSnapshot'])
            ->findOrFail($deviceId);

        $latestMetric = $device->latestMetricSnapshot;

        return [
            'device' => $this->presenter->deviceDetail($device),
            'latest_metric' => $this->presenter->metricSnapshot($latestMetric),
            'metric_history' => $this->metricHistory($device),
            'storage_snapshots' => $this->storageSnapshots($device, $latestMetric),
            'checkins' => DeviceCheckin::query()
                ->where('device_id', $device->id)
                ->latest('checked_in_at')
                ->limit(25)
                ->get()
                ->map(fn(DeviceCheckin $checkin) => $this->presenter->checkin($checkin))
                ->values(),
            'alerts' => DeviceAlert::query()
                ->where('device_id', $device->id)
                ->latest('opened_at')
                ->limit(50)
                ->get()
                ->map(fn(DeviceAlert $alert) => $this->presenter->alert($alert))
                ->values(),
            'event_logs' => DeviceEventLog::query()
                ->where('device_id', $device->id)
                ->latest('event_at')
                ->limit(50)
                ->get()
                ->map(fn(DeviceEventLog $event) => $this->presenter->event($event))
                ->values(),
        ];
    }

    private function metricHistory(Device $device): array
    {
        return DeviceMetricSnapshot::query()
            ->where('device_id', $device->id)
            ->latest('captured_at')
            ->limit(24)
            ->get()
            ->reverse()
            ->map(fn(DeviceMetricSnapshot $snapshot) => $this->presenter->metricSnapshot($snapshot))
            ->values()
            ->all();
    }

    private function storageSnapshots(Device $device, ?DeviceMetricSnapshot $latestMetric): array
    {
        $query = DeviceStorageSnapshot::query()->where('device_id', $device->id);

        if ($latestMetric) {
            $query->where('metric_snapshot_id', $latestMetric->id);
        } else {
            $query->latest('created_at')->limit(8);
        }

        return $query
            ->orderBy('drive_name')
            ->get()
            ->map(fn(DeviceStorageSnapshot $snapshot) => $this->presenter->storageSnapshot($snapshot))
            ->values()
            ->all();
    }
}
