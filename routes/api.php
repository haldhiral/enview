<?php

use App\Http\Controllers\Api\AgentIngestionController;
use Illuminate\Support\Facades\Route;

Route::prefix('agent')
    ->name('agent.')
    ->controller(AgentIngestionController::class)
    ->group(function (): void {
        Route::post('register', 'register')->name('register');
        Route::post('heartbeat', 'heartbeat')->name('heartbeat');
        Route::post('metrics', 'metrics')->name('metrics');
        Route::post('inventory', 'inventory')->name('inventory');
    });
