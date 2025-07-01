<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AssignmentController extends Controller
{
    public function store(Request $request, Classroom $classroom)
    {
        $user = Auth::user();

        if (!$classroom->teachers()->where('users.id', $user->id)->exists() && $user->role !== 'principal') {
             abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);

        $classroom->assignments()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'due_date' => $validated['due_date'],
            'user_id' => $user->id,
        ]);

        return redirect()->route('classrooms.manage', $classroom->id)->with('success_message', 'Assignment created successfully.');
    }

    public function show(Assignment $assignment)
    {
        $user = Auth::user();
        $classroom = $assignment->classroom;
        $assignment->load(['submissions.student', 'user']);

        if ($user->role === 'student' && !$classroom->students()->where('users.id', $user->id)->exists()) {
            abort(403);
        }

        $mySubmission = null;
        if ($user->role === 'student') {
            $mySubmission = $assignment->submissions()->where('student_id', $user->id)->first();
        }

        return Inertia::render('AssignmentView', [
            'assignment' => $assignment,
            'mySubmission' => $mySubmission,
        ]);
    }

    public function submit(Request $request, Assignment $assignment)
    {
        $user = Auth::user();
        $classroom = $assignment->classroom;

        if ($user->role !== 'student' || !$classroom->students()->where('users.id', $user->id)->exists()) {
            abort(403, 'You are not enrolled in this class.');
        }

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        AssignmentSubmission::updateOrCreate(
            ['assignment_id' => $assignment->id, 'student_id' => $user->id],
            ['content' => $validated['content'], 'submitted_at' => now()]
        );

        return redirect()->route('classrooms.manage', $assignment->id)->with('success_message', 'Assignment submitted successfully!');
    }
}