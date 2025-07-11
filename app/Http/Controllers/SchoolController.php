<?php

namespace App\Http\Controllers;

use App\Models\School;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SchoolController extends BaseController
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function create(): Response
    {
        if (Auth::user()->role !== 'principal') {
            abort(403, 'Hanya kepala sekolah yang dapat mengakses halaman ini.');
        }
        return Inertia::render('CreateSchool');
    }

    public function store(Request $request): RedirectResponse
    {
        if (Auth::user()->role !== 'principal') {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        /** @var \App\Models\User $principal */
        $principal = Auth::user();

        // Use the relationship to find or create the school
        // This is cleaner than a separate query
        $school = $principal->school()->updateOrCreate(
            ['principal_id' => $principal->id], // Conditions to find the school
            ['name' => $request->name]          // Attributes to update or create with
        );

        // Associate the principal with the school in their own user record if not already set
        if ($principal->school_id !== $school->id) {
            $principal->school_id = $school->id;
            $principal->save();
        }

        return redirect()->route('home')->with('success', 'Sekolah berhasil disimpan.');
    }

    /**
     * Add a new teacher to the principal's school.
     */
    public function addTeacher(Request $request): RedirectResponse
    {
        /** @var \App\Models\User $principal */
        $principal = Auth::user();

        // Authorization: Check role and ensure principal has a school
        if ($principal->role !== 'principal') {
            abort(403, 'Only principals can add teachers.');
        }

        $school = $principal->school;
        if (!$school) {
            return back()->with('error', 'Anda harus memiliki sekolah untuk menambahkan guru.');
        }

        // Validate that the email exists for a teacher who isn't already in a school
        $request->validate([
            'email' => [
                'required',
                'email',
                Rule::exists('users', 'email')->where(function ($query) {
                    $query->where('role', 'teacher')->whereNull('school_id');
                }),
            ],
        ], [
            'email.exists' => 'Email ini tidak terdaftar sebagai guru atau guru tersebut sudah terdaftar di sekolah lain.',
        ]);

        // Find the teacher. Validation ensures they exist and are eligible.
        $teacher = User::where('email', $request->email)->first();
        
        // This check is good for safety, though validation should prevent this.
        if (!$teacher) {
            return back()->with('error', 'Guru tidak ditemukan atau sudah terdaftar di sekolah lain.');
        }

        // Update teacher's school_id
        $teacher->school_id = $school->id;

        // The save() method will now work because $teacher is a valid Eloquent model instance.
        $teacher->save();

        return redirect()->route('home')->with('success', 'Guru berhasil ditambahkan ke sekolah Anda.');
    }
    public function addStudent(Request $request): RedirectResponse
    {
        /** @var \App\Models\User $principal */
        $principal = Auth::user();

        // Authorization: Check role and ensure principal has a school
        if ($principal->role !== 'principal') {
            abort(403, 'Only principals can add students.');
        }

        $school = $principal->school;
        if (!$school) {
            return back()->with('error', 'You must have a school to add a student.');
        }

        // Validate that the email exists for a student who isn't already in a school
        $request->validate([
            'email' => [
                'required',
                'email',
                Rule::exists('users', 'email')->where(function ($query) {
                    $query->where('role', 'student')->whereNull('school_id');
                }),
            ],
        ], [
            'email.exists' => 'This email is not registered as a student or the student is already enrolled in another school.',
        ]);

        // Find the student. Validation ensures they exist and are eligible.
        $student = User::where('email', $request->email)->first();
        
        // This check is good for safety, though validation should prevent this.
        if (!$student) {
            return back()->with('error', 'Student not found or already enrolled in another school.');
        }

        // Update student's school_id
        $student->school_id = $school->id;
        $student->save();

        return redirect()->route('add.student.toschool')->with('success', 'Student successfully added to your school.');
    }

    /**
     * Display a list of all members in the school.
     */
    public function showMembers(): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $school = $user->school;

        if (!$school) {
            // This will render an error page if the user is not associated with a school.
            return Inertia::render('Error', ['message' => 'You are not associated with any school.']);
        }

        // Fetch all members of the school, ordered by role and then by name.
        $members = $school->members()->orderBy('role', 'desc')->orderBy('name')->get();

        return Inertia::render('School/Members', [
            'school' => $school,
            'members' => $members,
        ]);
    }
}