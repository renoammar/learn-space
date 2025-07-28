<?php

use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\ScheduleController; // Import the new controller
use App\Models\School;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('WelcomePage');
})->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/home', function () {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check if user exists (additional safety)
        if (!$user) {
            return redirect()->route('login');
        }

        $user->load('school'); // Eager load school for the user
        $school = $user->school;
        $pendingAssignments = [];
        $gradedAssignments = [];
        $upcomingEvents = []; // Initialize upcomingEvents

        if ($user->role === 'student' && $school) { // Only fetch assignments if student is in a school
            // Get classroom IDs - use the collection directly, not the query builder
            $classroomIds = $user->enrolledClassrooms->pluck('id');

            // Fetch upcoming assignments the student hasn't submitted yet
            $pendingAssignments = \App\Models\Assignment::whereIn('classroom_id', $classroomIds)
                ->whereDoesntHave('submissions', function ($query) use ($user) {
                    $query->where('student_id', $user->id);
                })
                ->orderBy('due_date', 'asc')
                ->limit(5)
                ->get(['id', 'title', 'due_date', 'classroom_id']);

            // Fetch recently graded submissions
            $gradedAssignments = \App\Models\AssignmentSubmission::where('student_id', $user->id)
                ->whereNotNull('grade')
                ->latest('updated_at')
                ->with(['assignment:id,title']) // Eager load only necessary fields
                ->limit(5)
                ->get(['id', 'grade', 'assignment_id', 'updated_at']);

            // Fetch upcoming schedule events
            $upcomingEvents = \App\Models\ScheduleEvent::where('school_id', $school->id)
                ->where(function ($query) use ($classroomIds) {
                    $query->whereNull('classroom_id') // School-wide events
                          ->orWhereIn('classroom_id', $classroomIds); // Classroom-specific events
                })
                ->where('start_date', '>=', now()) // Only future events
                ->orderBy('start_date', 'asc')
                ->limit(5)
                ->get();
        }
        // No need for the teacher/principal specific logic for school, as it's loaded for all users now.

        return Inertia::render('home', [
            'school' => $school,
            'pendingAssignments' => $pendingAssignments,
            'gradedAssignments' => $gradedAssignments,
            'upcomingEvents' => $upcomingEvents,
        ]);
    })->name('home');

    Route::get('/add-teacher-toschool', function () {
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
    Route::post('/classrooms/{classroom}/assignments', [AssignmentController::class, 'store'])->name('assignments.store');
    Route::get('/assignments/{assignment}', [AssignmentController::class, 'show'])->name('assignments.show');
    Route::post('/assignments/{assignment}/submit', [AssignmentController::class, 'submit'])->name('assignments.submit');

    // Student Enrollment Routes
    Route::post('/classrooms/{classroom}/enroll-student', [ClassroomController::class, 'enrollStudent'])->name('classrooms.enrollStudent');
    Route::delete('/classrooms/{classroom}/remove-student/{student}', [ClassroomController::class, 'removeStudent'])->name('classrooms.removeStudent');

    // --- FIX: ADD THE MISSING SCHOOL MEMBERS ROUTE ---
    Route::get('/school/members', [SchoolController::class, 'showMembers'])->name('school.members');

    // New Grading Route
    Route::post('/submissions/{submission}/grade', [AssignmentController::class, 'grade'])
        ->name('submissions.grade')
        ->middleware('auth');

    // New Route for students to join a class with a code
    Route::post('/classrooms/join', [ClassroomController::class, 'join'])->name('classrooms.join');

    // Schedule Routes
    Route::get('/schedule', [ScheduleController::class, 'index'])->name('schedule.index');
    Route::post('/schedule', [ScheduleController::class, 'store'])->name('schedule.store');

    // School Settings Routes (for principals)
    Route::middleware('role:principal')->group(function () {
        Route::get('/school/edit', [SchoolController::class, 'edit'])->name('school.edit');
        Route::put('/school/update', [SchoolController::class, 'update'])->name('school.update');
        Route::delete('/school/destroy', [SchoolController::class, 'destroy'])->name('school.destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';