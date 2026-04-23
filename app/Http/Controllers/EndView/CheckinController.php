<?php

namespace App\Http\Controllers\EndView;

use App\Http\Controllers\Controller;
use App\Services\EndView\CheckinMonitoringService;
use Inertia\Inertia;
use Inertia\Response;

class CheckinController extends Controller
{
    public function __invoke(CheckinMonitoringService $checkins): Response
    {
        return Inertia::render('check-ins/index', $checkins->data());
    }
}
