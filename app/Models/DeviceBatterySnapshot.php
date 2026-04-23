<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceBatterySnapshot extends Model
{
    protected $table = 'trx_device_battery_snapshots';

    public const UPDATED_AT = null;

    protected $fillable = [
        'device_id',
        'captured_at',
        'battery_percent',
        'battery_health_percent',
        'battery_design_capacity_mwh',
        'battery_full_charge_capacity_mwh',
        'battery_cycle_count',
        'battery_status',
        'is_charging',
    ];

    protected function casts(): array
    {
        return [
            'captured_at' => 'datetime',
            'battery_percent' => 'float',
            'battery_health_percent' => 'float',
            'battery_design_capacity_mwh' => 'integer',
            'battery_full_charge_capacity_mwh' => 'integer',
            'battery_cycle_count' => 'integer',
            'is_charging' => 'boolean',
        ];
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

}
