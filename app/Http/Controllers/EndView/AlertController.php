<?php

namespace App\Http\Controllers\EndView;

use App\Http\Controllers\Controller;
use App\Services\EndView\AlertQueryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AlertController extends Controller
{
    public function __invoke(Request $request, AlertQueryService $alerts): Response
    {
        return Inertia::render('alerts/index', $alerts->indexData($request));
    }
}
