<?php

namespace App\Services\EndView;

use App\Models\Device;
use App\Models\DeviceEventLog;
use Carbon\CarbonInterface;

class DeviceEventLogService
{
    public function log(
        Device $device,
        string $eventType,
        string $eventMessage,
        string $eventSource = 'AGENT',
        ?int $referenceId = null,
        ?CarbonInterface $eventAt = null,
        ?int $createdBy = null,
    ): DeviceEventLog {
        return DeviceEventLog::create([
            'device_id' => $device->id,
            'event_type' => $eventType,
            'event_source' => $eventSource,
            'reference_id' => $referenceId,
            'event_at' => $eventAt ?? now(),
            'event_message' => $eventMessage,
            'created_by' => $createdBy,
        ]);
    }
}
