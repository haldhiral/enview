<?php

namespace App\Http\Requests\Agent;

use App\Concerns\AuthorizesAgentRequests;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AgentMetricsRequest extends FormRequest
{
    use AuthorizesAgentRequests;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'device_uuid' => ['required', 'uuid', 'max:36'],
            'captured_at' => ['required', 'date'],
            'cpu_usage_percent' => ['nullable', 'numeric', 'between:0,100'],
            'cpu_temperature_c' => ['nullable', 'numeric', 'between:-100,150'],
            'cpu_health_percent' => ['nullable', 'numeric', 'between:0,100'],
            'ram_total_mb' => ['nullable', 'integer', 'min:1', 'max:4294967295'],
            'ram_used_mb' => ['nullable', 'integer', 'min:0', 'max:4294967295'],
            'ram_free_mb' => ['nullable', 'integer', 'min:0', 'max:4294967295'],
            'ram_usage_percent' => ['nullable', 'numeric', 'between:0,100'],
            'total_storage_gb' => ['nullable', 'numeric', 'min:0', 'max:99999999.99'],
            'used_storage_gb' => ['nullable', 'numeric', 'min:0', 'max:99999999.99'],
            'free_storage_gb' => ['nullable', 'numeric', 'min:0', 'max:99999999.99'],
            'storage_usage_percent' => ['nullable', 'numeric', 'between:0,100'],
            'battery_percent' => ['nullable', 'numeric', 'between:0,100'],
            'battery_health_percent' => ['nullable', 'numeric', 'between:0,100'],
            'battery_cycle_count' => ['nullable', 'integer', 'min:0', 'max:4294967295'],
            'is_charging' => ['nullable', 'boolean'],
            'drives' => ['nullable', 'array', 'max:64'],
            'drives.*' => ['array'],
            'drives.*.drive_name' => ['required', 'string', 'max:20'],
            'drives.*.drive_label' => ['nullable', 'string', 'max:255'],
            'drives.*.file_system' => ['nullable', 'string', 'max:40'],
            'drives.*.total_gb' => ['nullable', 'numeric', 'min:0', 'max:99999999.99'],
            'drives.*.used_gb' => ['nullable', 'numeric', 'min:0', 'max:99999999.99'],
            'drives.*.free_gb' => ['nullable', 'numeric', 'min:0', 'max:99999999.99'],
            'drives.*.used_percent' => ['nullable', 'numeric', 'between:0,100'],
        ];
    }
}
