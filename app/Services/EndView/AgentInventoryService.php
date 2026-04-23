<?php

namespace App\Services\EndView;

use App\Exceptions\DeviceNotRegisteredException;
use App\Models\Device;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class AgentInventoryService
{
    public function __construct(private readonly DeviceEventLogService $eventLogs) {}

    /**
     * @return array{device: Device}
     */
    public function update(array $payload): array
    {
        return DB::transaction(function () use ($payload): array {
            $device = $this->findDevice($payload['device_uuid']);

            $device->fill($this->deviceAttributes($payload));
            $device->last_inventory_at = now();
            $device->save();
            $device->refresh();

            $this->eventLogs->log(
                $device,
                'INVENTORY_UPDATED',
                'Hardware and OS inventory was refreshed.',
                'AGENT',
                $device->id,
                $device->last_inventory_at,
            );

            return ['device' => $device];
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
        return Arr::only($payload, [
            'hostname',
            'fqdn',
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
            'last_logon_at',
        ]);
    }
}
