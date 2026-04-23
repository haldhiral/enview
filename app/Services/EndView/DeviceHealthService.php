<?php

namespace App\Services\EndView;

use Carbon\CarbonInterface;

class DeviceHealthService
{
    public function score(array $metrics, ?CarbonInterface $lastCheckinAt = null): int
    {
        $score = 100;
        $penalty = (int) config('endview.health.penalty_points', 20);

        if ($this->isAtLeast($metrics['cpu_usage_percent'] ?? null, 'cpu_usage_warning_percent')) {
            $score -= $penalty;
        }

        if ($this->isAtLeast($metrics['ram_usage_percent'] ?? null, 'ram_usage_warning_percent')) {
            $score -= $penalty;
        }

        if ($this->isAtLeast($metrics['storage_usage_percent'] ?? null, 'storage_usage_warning_percent')) {
            $score -= $penalty;
        }

        if ($this->batteryHealthIsLow($metrics['battery_health_percent'] ?? null)) {
            $score -= $penalty;
        }

        if ($this->isOffline($lastCheckinAt)) {
            $score -= $penalty;
        }

        return max(0, min(100, $score));
    }

    public function statusForScore(int $score, ?CarbonInterface $lastCheckinAt = null): string
    {
        if ($this->isOffline($lastCheckinAt)) {
            return 'OFFLINE';
        }

        if ($score >= (int) config('endview.health.online_score', 80)) {
            return 'ONLINE';
        }

        if ($score >= (int) config('endview.health.warning_score', 60)) {
            return 'WARNING';
        }

        return 'CRITICAL';
    }

    public function isOffline(?CarbonInterface $lastCheckinAt): bool
    {
        if ($lastCheckinAt === null) {
            return false;
        }

        return $lastCheckinAt->lt(now()->subMinutes((int) config('endview.offline_threshold_minutes', 15)));
    }

    public function storageHealthScore(mixed $storageUsagePercent): int
    {
        if ($this->isAtLeast($storageUsagePercent, 'storage_usage_warning_percent')) {
            return 80;
        }

        return 100;
    }

    private function isAtLeast(mixed $value, string $thresholdKey): bool
    {
        if ($value === null || $value === '') {
            return false;
        }

        return (float) $value >= (float) config("endview.health.{$thresholdKey}", 90);
    }

    private function batteryHealthIsLow(mixed $value): bool
    {
        if ($value === null || $value === '') {
            return false;
        }

        return (float) $value < (float) config('endview.health.battery_health_warning_percent', 60);
    }
}
