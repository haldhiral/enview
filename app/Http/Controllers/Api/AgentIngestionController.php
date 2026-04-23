<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\DeviceNotRegisteredException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Agent\AgentHeartbeatRequest;
use App\Http\Requests\Agent\AgentInventoryRequest;
use App\Http\Requests\Agent\AgentMetricsRequest;
use App\Http\Requests\Agent\RegisterAgentRequest;
use App\Models\Device;
use App\Services\EndView\AgentHeartbeatService;
use App\Services\EndView\AgentInventoryService;
use App\Services\EndView\AgentMetricsService;
use App\Services\EndView\AgentRegistrationService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class AgentIngestionController extends Controller
{
    public function register(RegisterAgentRequest $request, AgentRegistrationService $service): JsonResponse
    {
        $result = $service->register($request->validated());

        return ApiResponse::success(
            $result['created'] ? 'Device registered successfully.' : 'Device registration refreshed successfully.',
            $this->devicePayload($result['device']),
            $result['created'] ? 201 : 200,
        );
    }

    public function heartbeat(AgentHeartbeatRequest $request, AgentHeartbeatService $service): JsonResponse
    {
        try {
            $result = $service->record($request->validated());
        } catch (DeviceNotRegisteredException $exception) {
            return $this->deviceNotRegisteredResponse($exception);
        }

        return ApiResponse::success('Heartbeat received successfully.', [
            ...$this->devicePayload($result['device']),
            'checkin_id' => $result['checkin']->id,
            'current_status_code' => $result['device']->current_status_code,
        ]);
    }

    public function metrics(AgentMetricsRequest $request, AgentMetricsService $service): JsonResponse
    {
        try {
            $result = $service->record($request->validated());
        } catch (DeviceNotRegisteredException $exception) {
            return $this->deviceNotRegisteredResponse($exception);
        }

        return ApiResponse::success('Metrics received successfully.', [
            ...$this->devicePayload($result['device']),
            'metric_snapshot_id' => $result['metric_snapshot']->id,
            'health_score' => $result['device']->health_score,
            'current_status_code' => $result['device']->current_status_code,
            'alerts_opened' => count($result['alerts']['opened']),
            'alerts_resolved' => count($result['alerts']['resolved']),
        ]);
    }

    public function inventory(AgentInventoryRequest $request, AgentInventoryService $service): JsonResponse
    {
        try {
            $result = $service->update($request->validated());
        } catch (DeviceNotRegisteredException $exception) {
            return $this->deviceNotRegisteredResponse($exception);
        }

        return ApiResponse::success('Inventory updated successfully.', $this->devicePayload($result['device']));
    }

    /**
     * @return array{device_id: int, device_uuid: string}
     */
    private function devicePayload(Device $device): array
    {
        return [
            'device_id' => $device->id,
            'device_uuid' => $device->device_uuid,
        ];
    }

    private function deviceNotRegisteredResponse(DeviceNotRegisteredException $exception): JsonResponse
    {
        return ApiResponse::error(
            $exception->getMessage(),
            data: ['device_uuid' => $exception->deviceUuid],
            status: 404,
        );
    }
}
