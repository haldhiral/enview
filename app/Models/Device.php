<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Device extends Model
{
    protected $table = 'trx_devices';

    protected $fillable = [
        'company_id',
        'site_id',
        'current_user_id',
        'device_uuid',
        'agent_key',
        'device_name',
        'hostname',
        'fqdn',
        'device_type',
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
        'enrolled_at',
        'last_checkin_at',
        'last_inventory_at',
        'last_metrics_at',
        'current_status_code',
        'health_score',
        'is_enabled',
        'is_deleted',
    ];

    protected function casts(): array
    {
        return [
            'last_logon_at' => 'datetime',
            'enrolled_at' => 'datetime',
            'last_checkin_at' => 'datetime',
            'last_inventory_at' => 'datetime',
            'last_metrics_at' => 'datetime',
            'health_score' => 'float',
            'is_enabled' => 'boolean',
            'is_deleted' => 'boolean',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query
            ->where('is_enabled', true)
            ->where('is_deleted', false);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function currentUser(): BelongsTo
    {
        return $this->belongsTo(EndpointUser::class, 'current_user_id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(DeviceStatus::class, 'current_status_code', 'status_code');
    }

    public function agent(): HasOne
    {
        return $this->hasOne(DeviceAgent::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(DeviceAssignment::class);
    }

    public function checkins(): HasMany
    {
        return $this->hasMany(DeviceCheckin::class);
    }

    public function latestCheckin(): HasOne
    {
        return $this->hasOne(DeviceCheckin::class)->latestOfMany('checked_in_at');
    }

    public function metricSnapshots(): HasMany
    {
        return $this->hasMany(DeviceMetricSnapshot::class);
    }

    public function latestMetricSnapshot(): HasOne
    {
        return $this->hasOne(DeviceMetricSnapshot::class)->latestOfMany('captured_at');
    }

    public function storageSnapshots(): HasMany
    {
        return $this->hasMany(DeviceStorageSnapshot::class);
    }

    public function batterySnapshots(): HasMany
    {
        return $this->hasMany(DeviceBatterySnapshot::class);
    }

    public function alerts(): HasMany
    {
        return $this->hasMany(DeviceAlert::class);
    }

    public function eventLogs(): HasMany
    {
        return $this->hasMany(DeviceEventLog::class);
    }
}
