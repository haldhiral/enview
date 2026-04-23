<?php

namespace App\Services\EndView;

use App\Models\Device;
use App\Models\DeviceCheckin;

class CheckinMonitoringService
{
    public function __construct(private readonly EndViewPresenter $presenter) {}

    public function data(): array
    {
        return [
            'summary' => [
                'late_5m' => $this->lateDeviceCount(5),
                'late_15m' => $this->lateDeviceCount(15),
                'late_30m' => $this->lateDeviceCount(30),
                'late_1h' => $this->lateDeviceCount(60),
            ],
            'latest_checkins' => DeviceCheckin::query()
                ->with(['device.company', 'device.site'])
                ->latest('checked_in_at')
                ->limit(30)
                ->get()
                ->map(fn (DeviceCheckin $checkin) => $this->presenter->checkin($checkin))
                ->values(),
            'offline_candidates' => Device::query()
                ->active()
                ->with(['company', 'site'])
                ->where(function ($query) {
                    $query
                        ->whereNull('last_checkin_at')
                        ->orWhere('last_checkin_at', '<=', now()->subMinutes(15));
                })
                ->orderBy('last_checkin_at')
                ->limit(30)
                ->get()
                ->map(fn (Device $device) => $this->presenter->deviceSummary($device))
                ->values(),
        ];
    }

    private function lateDeviceCount(int $minutes): int
    {
        return Device::query()
            ->active()
            ->where(function ($query) use ($minutes) {
                $query
                    ->whereNull('last_checkin_at')
                    ->orWhere('last_checkin_at', '<=', now()->subMinutes($minutes));
            })
            ->count();
    }
}
