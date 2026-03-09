<?php

use App\Http\Controllers\Api\VisitorController;
use App\Http\Controllers\Api\DashboardController;
use Illuminate\Support\Facades\Route;

Route::apiResource('visitors', VisitorController::class);
Route::get('dashboard/stats', [DashboardController::class, 'stats']);
