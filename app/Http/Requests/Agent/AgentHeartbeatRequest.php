<?php

namespace App\Http\Requests\Agent;

use App\Concerns\AuthorizesAgentRequests;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AgentHeartbeatRequest extends FormRequest
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
            'checked_in_at' => ['required', 'date'],
            'current_user_name' => ['nullable', 'string', 'max:255'],
            'ip_address' => ['nullable', 'ip', 'max:45'],
            'mac_address' => ['nullable', 'string', 'max:32'],
            'uptime_seconds' => ['nullable', 'integer', 'min:0'],
            'agent_version' => ['required', 'string', 'max:60'],
            'remarks' => ['nullable', 'string', 'max:255'],
        ];
    }
}
