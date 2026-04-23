<?php

namespace App\Http\Requests\Agent;

use App\Concerns\AuthorizesAgentRequests;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AgentInventoryRequest extends FormRequest
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
            'hostname' => ['required', 'string', 'max:255'],
            'fqdn' => ['nullable', 'string', 'max:255'],
            'os_name' => ['nullable', 'string', 'max:255'],
            'os_version' => ['nullable', 'string', 'max:255'],
            'os_build' => ['nullable', 'string', 'max:255'],
            'os_architecture' => ['nullable', 'string', 'max:40'],
            'manufacturer' => ['nullable', 'string', 'max:255'],
            'model' => ['nullable', 'string', 'max:255'],
            'serial_number' => ['nullable', 'string', 'max:255'],
            'bios_version' => ['nullable', 'string', 'max:255'],
            'cpu_name' => ['nullable', 'string', 'max:255'],
            'cpu_physical_cores' => ['nullable', 'integer', 'min:1', 'max:255'],
            'cpu_logical_cores' => ['nullable', 'integer', 'min:1', 'max:255'],
            'total_memory_mb' => ['nullable', 'integer', 'min:1', 'max:4294967295'],
            'mac_address' => ['nullable', 'string', 'max:32'],
            'ipv4_address' => ['nullable', 'ipv4', 'max:45'],
            'ipv6_address' => ['nullable', 'ipv6', 'max:60'],
            'last_logged_on_username' => ['nullable', 'string', 'max:255'],
            'last_logon_at' => ['nullable', 'date'],
        ];
    }
}
