<?php
// app/Http/Controllers/ClassroomController.php

namespace App\Http\Controllers;

use App\Models\School;
use App\Models\Classroom;
use App\Models\User;
use App\Models\Assignment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;

class ClassroomController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $classrooms = collect();

        if ($user->role === 'teacher' || $user->role === 'principal') {
            if (method_exists($user, 'teachingClassrooms')) {
                 $classrooms = $user->teachingClassrooms()->orderBy('name')->get(['classrooms.id', 'classrooms.name', 'classrooms.code']);
            } elseif (method_exists($user, 'classrooms')) {
                 $classrooms = $user->classrooms()->orderBy('name')->get(['classrooms.id', 'classrooms.name', 'classrooms.code']);
            }
        } elseif ($user->role === 'student') {
            if (method_exists($user, 'studentClassrooms')) {
                $classrooms = $user->studentClassrooms()->orderBy('name')->get(['classrooms.id', 'classrooms.name', 'classrooms.code']);
            }
        }
        return Inertia::render('StudentClassesPage', ['classrooms' => $classrooms]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $school = $user->school;
        if (!$school) {
            return redirect()->back()->withInput()->withErrors(['name' => 'User school not found.'])
                             ->with('error_message', 'Could not create classroom. Ensure you are associated with a school.');
        }
        $code = strtoupper(Str::random(6));
        while (Classroom::where('code', $code)->exists()) { $code = strtoupper(Str::random(6)); }
        $classroom = Classroom::create(['name' => $request->name, 'school_id' => $school->id, 'code' => $code]);
        if ($user->role === 'teacher' || $user->role === 'principal') {
            $classroom->teachers()->attach($user->id);
        }
        return redirect()->route('classrooms.index')->with('success_message', 'Classroom "' . $classroom->name . '" created successfully.');
    }

    public function manage(Request $request, $id)
    {
        $classroom = Classroom::with(['teachers', 'students', 'assignments.user', 'school'])->findOrFail($id);
        return Inertia::render('ClassroomManagePage', ['classroom' => $classroom]);
    }

    // Changed parameter from Classroom $classroom to Classroom $class_instance_id
    // Laravel will bind the {class_instance_id} route segment to this $class_instance_id variable as a Classroom model
    public function addTeacher(Request $request, Classroom $class_instance_id)
    {
        $logChannel = 'stderr';
        Log::channel($logChannel)->info('--- Add Teacher Attempt (Explicit Binding) ---');
        Log::channel($logChannel)->info('Request URL: ' . $request->fullUrl());
        Log::channel($logChannel)->info('Route Name: ' . ($request->route() ? $request->route()->getName() : 'N/A'));
        Log::channel($logChannel)->info('Route Parameters (resolved): ', $request->route() ? $request->route()->parameters() : ['N/A']);
        Log::channel($logChannel)->info('Value of route parameter {class_instance_id} from $request->route("class_instance_id"): ' . ($request->route('class_instance_id') ?? 'NULL'));
        
        if ($class_instance_id) {
            Log::channel($logChannel)->info('Injected Classroom object type: ' . get_class($class_instance_id));
            Log::channel($logChannel)->info('Injected Classroom ID (from $class_instance_id->id): ' . ($class_instance_id->id ?: 'NULL'));
            Log::channel($logChannel)->info('Injected Classroom exists (from $class_instance_id->exists): ' . ($class_instance_id->exists ? 'true' : 'false'));
        } else {
            Log::channel($logChannel)->error('CRITICAL: $class_instance_id parameter is NULL.');
            return back()->withInput()->with('error_message', 'Critical server error (classroom injection failed).');
        }

        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();
        if (!$currentUser) {
             Log::channel($logChannel)->error('CRITICAL: User not authenticated.');
             return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Use $class_instance_id instead of $classroom
        if (!$class_instance_id->exists) {
            Log::channel($logChannel)->error('CRITICAL: Injected Classroom model does not exist.');
            $resolvedId = $request->route('class_instance_id');
            return back()->withInput()
                         ->withErrors(['teacher_email' => 'Target classroom (ID from URL: ' . ($resolvedId ?: 'unknown') . ') could not be resolved.'])
                         ->with('error_message', 'Failed to add co-teacher. Classroom not found or ID is invalid.');
        }

        if ($currentUser->role !== 'principal') {
            Log::channel($logChannel)->warning('AuthZ Fail: Not principal.', ['uid' => $currentUser->id, 'role' => $currentUser->role]);
            return back()->withInput()->withErrors(['teacher_email' => 'Not authorized.'])->with('error_message', 'Authorization failed.');
        }

        if ($currentUser->school_id && $class_instance_id->school_id !== $currentUser->school_id) {
             Log::channel($logChannel)->warning('AuthZ Fail: School mismatch.', ['uid' => $currentUser->id, 'uSchool' => $currentUser->school_id, 'cSchool' => $class_instance_id->school_id]);
             return back()->withInput()->withErrors(['teacher_email' => 'Cannot manage classrooms outside your school.'])->with('error_message', 'Access denied.');
        }

        $validated = $request->validate([
            'teacher_email' => ['required', 'email', Rule::exists('users', 'email')->where('role', 'teacher')],
        ]);
        $teacherToAdd = User::where('email', $validated['teacher_email'])->where('role', 'teacher')->firstOrFail();

        if ($class_instance_id->teachers()->where('users.id', $teacherToAdd->id)->exists()) {
            Log::channel($logChannel)->info('Teacher already in class.', ['tid' => $teacherToAdd->id, 'cid' => $class_instance_id->id]);
            return back()->withInput()->with('error_message', 'This teacher is already in the classroom.');
        }

        if ($teacherToAdd->school_id && $class_instance_id->school_id !== $teacherToAdd->school_id) {
           Log::channel($logChannel)->warning('Teacher school mismatch.', ['tid' => $teacherToAdd->id, 'tSchool' => $teacherToAdd->school_id, 'cSchool' => $class_instance_id->school_id]);
           return back()->withInput()->withErrors(['teacher_email' => 'Teacher not in same school.'])->with('error_message', 'Teacher school mismatch.');
        }

        $class_instance_id->teachers()->attach($teacherToAdd->id);
        Log::channel($logChannel)->info('Teacher attached.', ['tid' => $teacherToAdd->id, 'cid' => $class_instance_id->id]);

        return redirect()->route('classrooms.manage', ['id' => $class_instance_id->id])
                         ->with('success_message', $teacherToAdd->name . ' added as co-teacher.');
    }
}
