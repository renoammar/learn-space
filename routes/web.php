<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\SchoolController;
use App\Models\School;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('WelcomePage');
})->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/home', function () {
        $user = Auth::user();
        $school = null;
        if ($user->role === 'teacher') {
            $school = School::where('principal_id', $user->id)->first();
        } elseif ($user->role === 'principal') {
            $school = School::where('principal_id', $user->id)->first();
        }
        return Inertia::render('home', [
            'school' => $school
        ]);
    })->name('home');
     // --- ADD THIS ROUTE FOR ADDING A TEACHER TO A SCHOOL ---
     Route::get('/add-teacher-toschool',function () {
        return Inertia::render('AddTeacherToSchool');
    })->name('add.teacher.toschool');
    Route::post('/schools/add-teacher', [SchoolController::class, 'addTeacher'])
        ->name('schools.addTeacher')
        ->middleware('role:principal');
    // Buat sekolah (hanya untuk principal)
    Route::get('/schools/create', [SchoolController::class, 'create'])
        ->name('schools.create')
        ->middleware('role:principal');
    Route::post('/schools', [SchoolController::class, 'store'])
        ->name('schools.store')
        ->middleware('role:principal');

    // Halaman Kelas untuk Guru
    Route::get('/students-classes', [ClassroomController::class, 'index'])->name('students.classes');
    Route::post('/classrooms', [ClassroomController::class, 'store'])->name('classrooms.store');
    Route::get('/classrooms/{id}/manage', [ClassroomController::class, 'manage'])
        ->name('classrooms.manage');
    Route::post('/classrooms/{class_instance_id}/add-teacher', [ClassroomController::class, 'addTeacher'])
    ->name('classrooms.add-teacher');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
