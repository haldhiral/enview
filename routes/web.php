<?php

use App\Http\Controllers\EndView\AlertController;
use App\Http\Controllers\EndView\CheckinController;
use App\Http\Controllers\EndView\DashboardController;
use App\Http\Controllers\EndView\DeviceController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard')->name('home');

Route::get('dashboard', DashboardController::class)->name('dashboard');
Route::get('devices', [DeviceController::class, 'index'])->name('devices.index');
Route::get('devices/{device}/modal-detail', [DeviceController::class, 'modalDetail'])
    ->whereNumber('device')
    ->name('devices.modal-detail');
Route::get('devices/{device}', [DeviceController::class, 'show'])
    ->whereNumber('device')
    ->name('devices.show');
Route::get('alerts', AlertController::class)->name('alerts.index');
Route::get('check-ins', CheckinController::class)->name('checkins.index');

require __DIR__.'/settings.php';
