<?php

namespace App\Concerns;

trait AuthorizesAgentRequests
{
    public function authorize(): bool
    {
        $configuredAgentKey = config('endview.agent_key');

        if ($configuredAgentKey === null || $configuredAgentKey === '') {
            return true;
        }

        $providedAgentKey = (string) $this->header('X-Agent-Key', '');

        return $providedAgentKey !== '' && hash_equals((string) $configuredAgentKey, $providedAgentKey);
    }
}
