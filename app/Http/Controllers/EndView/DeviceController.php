<?php

namespace App\Http\Controllers\EndView;

use App\Http\Controllers\Controller;
use App\Services\EndView\DeviceDetailService;
use App\Services\EndView\DeviceQueryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DeviceController extends Controller
{
    public function index(Request $request, DeviceQueryService $devices): Response
    {
        return Inertia::render('devices/index', $devices->indexData($request));
    }

    public function show(int $device, DeviceDetailService $deviceDetail): Response
    {
        return Inertia::render('devices/show', $deviceDetail->data($device));
    }

    public function modalDetail(int $device, DeviceDetailService $deviceDetail): array
    {
        return $deviceDetail->data($device);
    }
}
