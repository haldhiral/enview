<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EndpointUser extends Model
{
    protected $table = 'mst_users';

    protected $fillable = [
        'company_id',
        'site_id',
        'employee_no',
        'full_name',
        'username',
        'email',
        'phone_no',
        'department_name',
        'job_title',
        'role_code',
        'password_hash',
        'is_active',
        'last_login_at',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function devices(): HasMany
    {
        return $this->hasMany(Device::class, 'current_user_id');
    }
}
