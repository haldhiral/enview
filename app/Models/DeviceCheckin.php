<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceCheckin extends Model
{
    protected $table = 'trx_device_checkins';

    public const UPDATED_AT = null;

    protected $fillable = [
        'device_id',
        'checked_in_at',
        'status_code',
        'agent_version',
        'current_user_name',
        'ip_address',
        'mac_address',
        'uptime_seconds',
        'remarks',
    ];

    protected function casts(): array
    {
        return [
            'checked_in_at' => 'datetime',
        ];
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }
}
