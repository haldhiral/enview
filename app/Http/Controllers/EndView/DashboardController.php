<?php

namespace App\Http\Controllers\EndView;

use App\Http\Controllers\Controller;
use App\Services\EndView\DashboardDataService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(DashboardDataService $dashboardData): Response
    {
        return Inertia::render('dashboard', $dashboardData->data());
    }
}
