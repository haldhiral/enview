<?php

namespace App\Http\Controllers\EndView;

use App\Http\Controllers\Controller;
use App\Services\EndView\DashboardDataService;
use App\Services\EndView\DeviceQueryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(
        Request $request,
        DashboardDataService $dashboardData,
        DeviceQueryService $devices,
    ): Response
    {
        return Inertia::render('dashboard', array_merge(
            $dashboardData->data(),
            $devices->indexData($request),
        ));
    }
}
