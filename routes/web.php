<?php

use App\Http\Controllers\PlotController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', [PlotController::class, 'index'])->name('dashboard');
    Route::put('/plots/{plot}', [PlotController::class, 'update'])->name('dashboard.update');

    Route::get('/restaurant', function () {
        return Inertia::render('RestaurantPage');
    })->name('restaurant');
    Route::get('/restaurant-orig', function () {
        return Inertia::render('RestaurantPageOrig');
    })->name('restaurant-old');
    Route::get('/restaurant-example', function () {
        return Inertia::render('RestaurantExamplePage');
    })->name('restaurant-example');
    Route::get('/konva-example', function () {
        return Inertia::render('KonvaExamplePage');
    })->name('konva-example');
    Route::get('/grid', function () {
        return Inertia::render('KonvaGridPage');
    })->name('grid');
    Route::get('/grid-claude', function () {
        return Inertia::render('KonvaGridClaudePage');
    })->name('grid-claude');
    Route::get('/grid-gemini', function () {
        return Inertia::render('KonvaGridGeminiPage');
    })->name('grid-gemini');
});
