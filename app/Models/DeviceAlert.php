<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceAlert extends Model
{
    protected $table = 'trx_device_alerts';

    protected $fillable = [
        'device_id',
        'metric_snapshot_id',
        'alert_code',
        'alert_name',
        'severity_code',
        'alert_message',
        'opened_at',
        'acknowledged_at',
        'resolved_at',
        'acknowledged_by',
        'resolved_by',
        'status_code',
    ];

    protected function casts(): array
    {
        return [
            'opened_at' => 'datetime',
            'acknowledged_at' => 'datetime',
            'resolved_at' => 'datetime',
        ];
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    public function metricSnapshot(): BelongsTo
    {
        return $this->belongsTo(DeviceMetricSnapshot::class, 'metric_snapshot_id');
    }
}
