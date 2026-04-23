<?php

namespace App\Services\EndView;

use App\Models\Company;
use App\Models\Device;
use App\Models\DeviceAgent;
use App\Models\Site;
use Carbon\CarbonInterface;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AgentRegistrationService
{
    public function __construct(
        private readonly DeviceHealthService $health,
        private readonly DeviceEventLogService $eventLogs,
    ) {}

    /**
     * @return array{device: Device, created: bool}
     */
    public function register(array $payload): array
    {
        return DB::transaction(function () use ($payload): array {
            $now = now();
            $device = Device::query()
                ->where('device_uuid', $payload['device_uuid'])
                ->first();
            $created = ! $device;

            if (! $device) {
                $device = new Device([
                    'company_id' => $this->defaultCompanyId(),
                    'site_id' => $this->defaultSiteId(),
                    'device_uuid' => $payload['device_uuid'],
                    'agent_key' => (string) Str::uuid(),
                    'enrolled_at' => $now,
                    'health_score' => 100,
                    'is_enabled' => true,
                    'is_deleted' => false,
                ]);
            }

            $device->fill($this->deviceAttributes($payload));
            $device->enrolled_at ??= $now;
            $device->last_checkin_at = $this->latestTimestamp($device->last_checkin_at, $now);
            $device->current_status_code = $this->health->statusForScore((int) ($device->health_score ?? 100), $device->last_checkin_at);
            $device->save();

            DeviceAgent::query()->updateOrCreate(
                ['device_id' => $device->id],
                [
                    'agent_version' => $payload['agent_version'],
                    'api_token_hash' => hash('sha256', (string) $device->agent_key),
                    'token_issued_at' => $now,
                    'is_active' => true,
                ],
            );

            $this->eventLogs->log(
                $device,
                'REGISTERED',
                $created
                    ? "{$device->hostname} registered with EndView."
                    : "{$device->hostname} refreshed its EndView registration.",
                'AGENT',
                $device->id,
                $now,
            );

            return [
                'device' => $device->refresh(),
                'created' => $created,
            ];
        });
    }

    private function deviceAttributes(array $payload): array
    {
        $attributes = Arr::only($payload, [
            'device_name',
            'hostname',
            'fqdn',
            'device_type',
            'os_name',
            'os_version',
            'os_build',
            'os_architecture',
            'manufacturer',
            'model',
            'serial_number',
            'bios_version',
            'cpu_name',
            'cpu_physical_cores',
            'cpu_logical_cores',
            'total_memory_mb',
            'mac_address',
            'ipv4_address',
            'ipv6_address',
            'last_logged_on_username',
        ]);

        if (! array_key_exists('last_logged_on_username', $attributes) && filled($payload['current_user_name'] ?? null)) {
            $attributes['last_logged_on_username'] = $payload['current_user_name'];
        }

        return $attributes;
    }

    private function latestTimestamp(?CarbonInterface $current, CarbonInterface $incoming): CarbonInterface
    {
        if ($current && $current->greaterThan($incoming)) {
            return $current;
        }

        return $incoming;
    }

    private function defaultCompanyId(): int
    {
        $configuredCompanyId = config('endview.default_company_id');

        if ($configuredCompanyId) {
            return (int) $configuredCompanyId;
        }

        return (int) Company::query()
            ->where('is_active', true)
            ->orderBy('id')
            ->value('id');
    }

    private function defaultSiteId(): ?int
    {
        $configuredSiteId = config('endview.default_site_id');

        if ($configuredSiteId) {
            return (int) $configuredSiteId;
        }

        return Site::query()
            ->where('is_active', true)
            ->orderBy('id')
            ->value('id');
    }
}
