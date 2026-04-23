<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceAgent extends Model
{
    protected $table = 'trx_device_agents';

    protected $fillable = [
        'device_id',
        'agent_version',
        'api_token_hash',
        'token_issued_at',
        'token_expires_at',
        'last_seen_ip',
        'last_seen_user_agent',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'token_issued_at' => 'datetime',
            'token_expires_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }
}
