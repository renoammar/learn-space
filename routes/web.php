<?php
// routes/web.php

use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\ProfileController; // Example if using Breeze for profile
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});


Route::middleware(['auth', 'verified'])->group(function () {
    
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Classroom Index/List Page
    Route::get('/classrooms', [ClassroomController::class, 'index'])->name('classrooms.index'); 

    // Create Classroom
    Route::post('/classrooms', [ClassroomController::class, 'store'])->name('classrooms.store');

    // Manage a specific Classroom
    Route::get('/classrooms/{id}/manage', [ClassroomController::class, 'manage'])->name('classrooms.manage');

    // Add a Co-Teacher to a Classroom (Principals)
    // Changed route parameter from {classroom} to {class_instance_id} for explicit binding
    Route::post('/classrooms/{class_instance_id}/add-teacher', [ClassroomController::class, 'addTeacher'])
        ->name('classrooms.add-teacher')
        ->where('class_instance_id', '[0-9]+'); // Ensure it's a number

});

// Ensure auth routes are defined (e.g., require __DIR__.'/auth.php'; for Breeze)
if (!app()->routesAreCached() && file_exists(base_path('routes/auth.php'))) {
    require __DIR__.'/auth.php';
}
