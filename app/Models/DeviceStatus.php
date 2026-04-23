<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DeviceStatus extends Model
{
    protected $table = 'mst_device_statuses';

    protected $primaryKey = 'status_code';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'status_code',
        'status_name',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function devices(): HasMany
    {
        return $this->hasMany(Device::class, 'current_status_code', 'status_code');
    }
}
