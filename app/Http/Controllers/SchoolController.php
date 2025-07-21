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
        /** @var User $user */
        $user = Auth::user();

        if ($user->role !== 'principal') {
            abort(403, 'Hanya kepala sekolah yang dapat mengakses halaman ini.');
        }

        return Inertia::render('CreateSchool');
    }

    public function store(Request $request)
    {
        /** @var User $principal */
        $principal = Auth::user();

        if ($principal->role !== 'principal') {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $school = $principal->school()->updateOrCreate(
            ['principal_id' => $principal->id],
            ['name' => $request->name]
        );

        if ($principal->school_id !== $school->id) {
            $principal->school_id = $school->id;
            $principal->save();
        }

        // Refresh session with updated user
        Auth::login($principal->fresh());

        // Force full reload so school context updates
        return Inertia::location(route('home'));
    }

    public function addTeacher(Request $request)
    {
        /** @var User $principal */
        $principal = Auth::user();

        if ($principal->role !== 'principal') {
            abort(403, 'Only principals can add teachers.');
        }

        $school = $principal->school;
        if (!$school) {
            return back()->with('error', 'Anda harus memiliki sekolah untuk menambahkan guru.');
        }

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

        /** @var User|null $teacher */
        $teacher = User::where('email', $request->email)->first();

        if (!$teacher) {
            return back()->with('error', 'Guru tidak ditemukan atau sudah terdaftar di sekolah lain.');
        }

        $teacher->school_id = $school->id;
        $teacher->save();

        // Refresh session with up-to-date user
        Auth::login($principal->fresh());
        Auth::login($teacher->fresh()); 

        return Inertia::location(route('home'));
    }

    public function addStudent(Request $request)
    {
        /** @var User $principal */
        $principal = Auth::user();

        if ($principal->role !== 'principal') {
            abort(403, 'Only principals can add students.');
        }

        $school = $principal->school;
        if (!$school) {
            return back()->with('error', 'You must have a school to add a student.');
        }

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

        /** @var User|null $student */
        $student = User::where('email', $request->email)->first();

        if (!$student) {
            return back()->with('error', 'Student not found or already enrolled in another school.');
        }

        $student->school_id = $school->id;
        $student->save();

        // Refresh session for principal
        Auth::login($principal->fresh());

        return Inertia::location(route('add.student.toschool'));
    }

    public function showMembers(): Response
    {
        /** @var User $user */
        $user = Auth::user();
        $school = $user->school;

        if (!$school) {
            return Inertia::render('Error', ['message' => 'You are not associated with any school.']);
        }

        $members = $school->members()->orderBy('role', 'desc')->orderBy('name')->get();

        return Inertia::render('School/Members', [
            'school' => $school,
            'members' => $members,
        ]);
    }
}
