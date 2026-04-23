<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DeviceMetricSnapshot extends Model
{
    protected $table = 'trx_device_metric_snapshots';

    public const UPDATED_AT = null;

    protected $fillable = [
        'device_id',
        'captured_at',
        'cpu_usage_percent',
        'cpu_temperature_c',
        'cpu_health_percent',
        'ram_total_mb',
        'ram_used_mb',
        'ram_free_mb',
        'ram_usage_percent',
        'total_storage_gb',
        'used_storage_gb',
        'free_storage_gb',
        'storage_usage_percent',
        'battery_percent',
        'battery_health_percent',
        'battery_cycle_count',
        'is_charging',
        'is_online',
        'health_score',
    ];

    protected function casts(): array
    {
        return [
            'captured_at' => 'datetime',
            'cpu_usage_percent' => 'float',
            'cpu_temperature_c' => 'float',
            'cpu_health_percent' => 'float',
            'ram_usage_percent' => 'float',
            'total_storage_gb' => 'float',
            'used_storage_gb' => 'float',
            'free_storage_gb' => 'float',
            'storage_usage_percent' => 'float',
            'battery_percent' => 'float',
            'battery_health_percent' => 'float',
            'battery_cycle_count' => 'integer',
            'is_charging' => 'boolean',
            'is_online' => 'boolean',
            'health_score' => 'float',
        ];
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    public function storageSnapshots(): HasMany
    {
        return $this->hasMany(DeviceStorageSnapshot::class, 'metric_snapshot_id');
    }

    public function alerts(): HasMany
    {
        return $this->hasMany(DeviceAlert::class, 'metric_snapshot_id');
    }
}
