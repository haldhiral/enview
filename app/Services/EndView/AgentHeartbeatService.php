<?php

namespace App\Services\EndView;

use App\Exceptions\DeviceNotRegisteredException;
use App\Models\Device;
use App\Models\DeviceAgent;
use App\Models\DeviceCheckin;
use Carbon\CarbonInterface;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AgentHeartbeatService
{
    public function __construct(
        private readonly DeviceHealthService $health,
        private readonly DeviceEventLogService $eventLogs,
    ) {}

    /**
     * @return array{device: Device, checkin: DeviceCheckin}
     */
    public function record(array $payload): array
    {
        return DB::transaction(function () use ($payload): array {
            $device = $this->findDevice($payload['device_uuid']);
            $checkedInAt = Carbon::parse($payload['checked_in_at']);
            $previousStatus = $device->current_status_code;

            $checkin = DeviceCheckin::create([
                'device_id' => $device->id,
                'checked_in_at' => $checkedInAt,
                'status_code' => 'ONLINE',
                'agent_version' => $payload['agent_version'],
                'current_user_name' => $payload['current_user_name'] ?? null,
                'ip_address' => $payload['ip_address'] ?? null,
                'mac_address' => $payload['mac_address'] ?? null,
                'uptime_seconds' => $payload['uptime_seconds'] ?? null,
                'remarks' => $payload['remarks'] ?? null,
            ]);

            $latestCheckinAt = $this->latestTimestamp($device->last_checkin_at, $checkedInAt);
            $device->fill($this->deviceAttributes($payload));
            $device->last_checkin_at = $latestCheckinAt;
            $device->current_status_code = $this->health->statusForScore((int) $device->health_score, $latestCheckinAt);
            $device->save();

            DeviceAgent::query()->updateOrCreate(
                ['device_id' => $device->id],
                [
                    'agent_version' => $payload['agent_version'],
                    'api_token_hash' => hash('sha256', (string) $device->agent_key),
                    'last_seen_ip' => $payload['ip_address'] ?? null,
                    'is_active' => true,
                ],
            );

            $device->refresh();

            $this->eventLogs->log(
                $device,
                'CHECKIN',
                'Agent heartbeat was processed.',
                'AGENT',
                $checkin->id,
                $checkedInAt,
            );

            $this->logStatusTransition($device, $previousStatus, $checkedInAt);

            return [
                'device' => $device,
                'checkin' => $checkin,
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

    private function deviceAttributes(array $payload): array
    {
        $attributes = [];

        if (filled($payload['current_user_name'] ?? null)) {
            $attributes['last_logged_on_username'] = $payload['current_user_name'];
        }

        if (filled($payload['mac_address'] ?? null)) {
            $attributes['mac_address'] = $payload['mac_address'];
        }

        if (filled($payload['ip_address'] ?? null)) {
            $field = filter_var($payload['ip_address'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)
                ? 'ipv6_address'
                : 'ipv4_address';

            $attributes[$field] = $payload['ip_address'];
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

    private function logStatusTransition(Device $device, ?string $previousStatus, CarbonInterface $occurredAt): void
    {
        if ($previousStatus === 'OFFLINE' && $device->current_status_code !== 'OFFLINE') {
            $this->eventLogs->log(
                $device,
                'DEVICE_ONLINE',
                "{$device->hostname} resumed check-ins.",
                'SYSTEM',
                null,
                $occurredAt,
            );
        }

        if ($previousStatus !== 'OFFLINE' && $device->current_status_code === 'OFFLINE') {
            $this->eventLogs->log(
                $device,
                'DEVICE_OFFLINE',
                "{$device->hostname} exceeded the check-in threshold.",
                'SYSTEM',
                null,
                $occurredAt,
            );
        }
    }
}
