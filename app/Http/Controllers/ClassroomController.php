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
            // FIX: The 'teachingClassrooms' method did not exist.
            // The 'classrooms' relationship correctly fetches classrooms for teachers.
            $classrooms = $user->classrooms()->orderBy('name')->get(['classrooms.id', 'classrooms.name', 'classrooms.code']);
        } elseif ($user->role === 'student') {
            // FIX: Using the renamed 'enrolledClassrooms' relationship for students.
            $classrooms = $user->enrolledClassrooms()->orderBy('name')->get(['classrooms.id', 'classrooms.name', 'classrooms.code']);
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
        // Change 'classrooms.index' to 'students.classes'
        return redirect()->route('students.classes')->with('success_message', 'Classroom "' . $classroom->name . '" created successfully.');
    }
    public function enrollStudent(Request $request, Classroom $classroom)
{
    $user = Auth::user();
    if (!in_array($user->role, ['teacher', 'principal', 'school_manager'])) {
        abort(403);
    }
    if ($user->role !== 'teacher' && $user->role !== 'principal') {
        abort(403);
    }
    if ($user->school_id !== $classroom->school_id) {
        abort(403, 'You can only manage students within your own school.');
    }

    $validated = $request->validate([
        'student_email' => ['required', 'email', Rule::exists('users', 'email')->where(function ($query) use ($classroom) {
            $query->where('role', 'student')->where('school_id', $classroom->school_id);
        })],
    ], [
        'student_email.exists' => 'No student with this email was found in your school, or they are not assigned to a school.',
    ]);

    $student = User::where('email', $validated['student_email'])->firstOrFail();

    if ($classroom->students()->where('users.id', $student->id)->exists()) {
        return back()->with('error_message', 'This student is already enrolled.');
    }

    $classroom->students()->attach($student->id);

    return redirect()->route('classrooms.manage', $classroom->id)->with('success_message', 'Student successfully enrolled.');
}

public function removeStudent(Request $request, Classroom $classroom, User $student)
{
    $user = Auth::user();
    if (!in_array($user->role, ['teacher', 'principal','school_manager'])) {
        abort(403);
    }
    if ($user->role !== 'teacher' && $user->role !== 'principal') {
        abort(403);
    }
    if ($user->school_id !== $classroom->school_id) {
        abort(403, 'You can only manage students within your own school.');
    }

    $classroom->students()->detach($student->id);

    return redirect()->route('classrooms.manage', $classroom->id)->with('success_message', 'Student successfully removed.');
}


    // In app/Http/Controllers/ClassroomController.php

public function manage(Request $request, $id)
{
    $classroom = Classroom::with(['teachers', 'students', 'assignments.user', 'school'])->findOrFail($id);
    $user = Auth::user();

    // If the user is a student, load their submissions for the assignments in this class
    if ($user->role === 'student') {
        // This loads the 'submissions' relationship on each assignment, but only for the current student.
        $classroom->load(['assignments.submissions' => function ($query) use ($user) {
            $query->where('student_id', $user->id);
        }]);
    }

    return Inertia::render('ClassroomManagePage', ['classroom' => $classroom]);
}

    // Changed parameter from Classroom $classroom to Classroom $class_instance_id
    // Laravel will bind the {class_instance_id} route segment to this $class_instance_id variable as a Classroom model
public function addTeacher(Request $request, Classroom $class_instance_id)
{
    $logChannel = 'stderr';
    Log::channel($logChannel)->info('--- Add Teacher Attempt (Explicit Binding) ---', $request->route()->parameters());

    /** @var \App\Models\User $currentUser */
    $currentUser = Auth::user();
    if (!in_array($currentUser->role, ['principal', 'school_manager'])) {
        return back()->with('error_message', 'Only principals or school managers can add teachers.');
    }
    // Authorization: Ensure the current user is a principal of the same school as the classroom
    // if ($currentUser->role !== 'principal') {
    //     return back()->with('error_message', 'Only principals can add teachers.');
    // }
    
    // Eager load the school relationship for the current user to get their school_id
    $principalSchoolId = $currentUser->school()->value('id');
    if ($class_instance_id->school_id !== $principalSchoolId) {
        return back()->with('error_message', 'You can only manage classrooms within your own school.');
    }

    // Validate request
    $validated = $request->validate([
        'teacher_email' => ['required', 'email', Rule::exists('users', 'email')->where('role', 'teacher')],
    ]);

    $teacherToAdd = User::where('email', $validated['teacher_email'])->where('role', 'teacher')->firstOrFail();

    // Check if teacher is already in the classroom
    if ($class_instance_id->teachers()->where('users.id', $teacherToAdd->id)->exists()) {
        return back()->with('error_message', 'This teacher is already in the classroom.');
    }
    
    // If teacher doesn't have a school, assign them to this school.
    if (is_null($teacherToAdd->school_id)) {
        $teacherToAdd->school_id = $class_instance_id->school_id;
        $teacherToAdd->save();
        Log::channel($logChannel)->info('Assigned school to new teacher.', ['tid' => $teacherToAdd->id, 'school_id' => $class_instance_id->school_id]);
    } 
    // If teacher already has a school, ensure it matches the classroom's school.
    elseif ($teacherToAdd->school_id !== $class_instance_id->school_id) {
        return back()->withErrors(['teacher_email' => 'This teacher belongs to a different school.'])
                     ->with('error_message', 'Cannot add a teacher from another school.');
    }
    
    // Attach the teacher to the classroom
    $class_instance_id->teachers()->attach($teacherToAdd->id);
    Log::channel($logChannel)->info('Teacher attached successfully.', ['tid' => $teacherToAdd->id, 'cid' => $class_instance_id->id]);

    return redirect()->route('classrooms.manage', ['id' => $class_instance_id->id])
                     ->with('success_message', $teacherToAdd->name . ' has been successfully added as a co-teacher.');
}

    public function join(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->role !== 'student') {
            abort(403, 'Only students can join classes with a code.');
        }

        $validated = $request->validate([
            'code' => ['required', 'string', 'size:6', Rule::exists('classrooms', 'code')],
        ], [
            'code.exists' => 'No classroom found with this code.',
            'code.size' => 'The code must be exactly 6 characters long.',
        ]);

        $classroom = Classroom::where('code', $validated['code'])->firstOrFail();

        if ($user->school_id !== $classroom->school_id) {
            return back()->with('error_message', 'You can only join classrooms within your own school.');
        }

        if ($classroom->students()->where('users.id', $user->id)->exists()) {
            return back()->with('error_message', 'You are already enrolled in this class.');
        }

        $classroom->students()->attach($user->id);

        return redirect()->route('students.classes')->with('success_message', 'Successfully joined the class: ' . $classroom->name);
    }
}