<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceEventLog extends Model
{
    protected $table = 'trx_device_event_logs';

    public const UPDATED_AT = null;

    protected $fillable = [
        'device_id',
        'event_type',
        'event_source',
        'reference_id',
        'event_at',
        'event_message',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'event_at' => 'datetime',
            'reference_id' => 'integer',
            'created_by' => 'integer',
        ];
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }
}
