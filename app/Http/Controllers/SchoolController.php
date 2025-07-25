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

    public function store(Request $request): RedirectResponse
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

    public function addTeacher(Request $request): RedirectResponse
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
        $teacher = User::where('email', $request->email)
            ->where('role', 'teacher')
            ->whereNull('school_id')
            ->first();

        if (!$teacher) {
            return back()->with('error', 'Guru tidak ditemukan atau sudah terdaftar di sekolah lain.');
        }

        $teacher->school_id = $school->id;
        $teacher->save();

        // Only refresh the principal's session
        Auth::login($principal->fresh());

        return redirect()->route('home')->with('success', 'Guru berhasil ditambahkan ke sekolah.');
    }

    public function addStudent(Request $request): RedirectResponse
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
        $student = User::where('email', $request->email)
            ->where('role', 'student')
            ->whereNull('school_id')
            ->first();

        if (!$student) {
            return back()->with('error', 'Student not found or already enrolled in another school.');
        }

        $student->school_id = $school->id;
        $student->save();

        // Only refresh the principal's session
        Auth::login($principal->fresh());

        return redirect()->route('add.student.toschool')->with('success', 'Student successfully added to school.');
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

    /**
     * Show the form for editing the school.
     */
    public function edit(): Response
    {
        /** @var User $principal */
        $principal = Auth::user();
        $school = $principal->school;

        if (!$school) {
            return Inertia::render('Error', [
                'message' => 'You do not have a school to edit.',
                'redirect' => route('home')
            ]);
        }

        if ($principal->role !== 'principal' || $principal->id !== $school->principal_id) {
            abort(403, 'Only the principal can edit this school.');
        }

        return Inertia::render('School/Edit', [
            'school' => $school,
        ]);
    }

    /**
     * Update the school's information.
     */
    public function update(Request $request): RedirectResponse
    {
        /** @var User $principal */
        $principal = Auth::user();
        $school = $principal->school;

        if (!$school || $principal->id !== $school->principal_id) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $school->update($validated);

        return redirect()->route('school.edit')->with('success', 'School name updated successfully.');
    }

    /**
     * Delete the school.
     */
    public function destroy(Request $request): RedirectResponse
    {
        /** @var User $principal */
        $principal = Auth::user();
        $school = $principal->school;

        if (!$school || $principal->id !== $school->principal_id) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        // Remove school association from all members before deleting
        $school->members()->update(['school_id' => null]);
        
        $school->delete();

        // Update principal's school_id to null
        $principal->school_id = null;
        $principal->save();

        return redirect()->route('home')->with('status', 'Your school has been deleted.');
    }
}