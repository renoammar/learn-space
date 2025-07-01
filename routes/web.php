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
        if ($user->role === 'teacher' || $user->role === 'principal') {
            if ($user->role === 'principal') {
                 $school = School::where('principal_id', $user->id)->first();
            } else {
                $school = $user->school;
            }
        }
        return Inertia::render('home', [
            'school' => $school
        ]);
    })->name('home');
    
    Route::get('/add-teacher-toschool',function () {
        return Inertia::render('addTeacherToSchool');
    })->name('add.teacher.toschool');

    Route::post('/schools/add-teacher', [SchoolController::class, 'addTeacher'])
        ->name('schools.addTeacher')
        ->middleware('role:principal');
    
    // START OF FIX
    Route::get('/add-student-toschool', function () {
        return Inertia::render('addStudentToSchool');
    })->name('add.student.toschool');

    Route::post('/schools/add-student', [SchoolController::class, 'addStudent'])
        ->name('schools.addStudent')
        ->middleware('role:principal');
    // END OF FIX

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
    // Assignment Routes
Route::post('/classrooms/{classroom}/assignments', [\App\Http\Controllers\AssignmentController::class, 'store'])->name('assignments.store');
Route::get('/assignments/{assignment}', [\App\Http\Controllers\AssignmentController::class, 'show'])->name('assignments.show');
Route::post('/assignments/{assignment}/submit', [\App\Http\Controllers\AssignmentController::class, 'submit'])->name('assignments.submit');

// Student Enrollment Routes
Route::post('/classrooms/{classroom}/enroll-student', [ClassroomController::class, 'enrollStudent'])->name('classrooms.enrollStudent');
Route::delete('/classrooms/{classroom}/remove-student/{student}', [ClassroomController::class, 'removeStudent'])->name('classrooms.removeStudent');
    // --- FIX: ADD THE MISSING SCHOOL MEMBERS ROUTE ---
    Route::get('/school/members', [SchoolController::class, 'showMembers'])->name('school.members');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';