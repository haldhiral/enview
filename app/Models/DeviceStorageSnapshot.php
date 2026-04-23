<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceStorageSnapshot extends Model
{
    protected $table = 'trx_device_storage_snapshots';

    public const UPDATED_AT = null;

    protected $fillable = [
        'device_id',
        'metric_snapshot_id',
        'drive_name',
        'drive_label',
        'file_system',
        'total_gb',
        'used_gb',
        'free_gb',
        'used_percent',
    ];

    protected function casts(): array
    {
        return [
            'total_gb' => 'float',
            'used_gb' => 'float',
            'free_gb' => 'float',
            'used_percent' => 'float',
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
