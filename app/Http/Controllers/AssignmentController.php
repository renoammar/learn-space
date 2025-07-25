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
            'submission_type' => 'required|in:single,multiple', // Add validation
        ]);

        $classroom->assignments()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'due_date' => $validated['due_date'],
            'submission_type' => $validated['submission_type'], // Save the value
            'user_id' => $user->id,
        ]);

        return redirect()->route('classrooms.manage', $classroom->id)->with('success_message', 'Assignment created successfully.');
    }

    public function show(Assignment $assignment)
    {
        $user = Auth::user();
        $classroom = $assignment->classroom;

        // Eager load relationships for efficiency
        $assignment->load(['submissions.student', 'user']);

        if ($user->role === 'student' && !$classroom->students()->where('users.id', $user->id)->exists()) {
            abort(403);
        }

        $mySubmission = null;
        if ($user->role === 'student') {
            // Find the student's specific submission
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

        $existingSubmission = AssignmentSubmission::where('assignment_id', $assignment->id)
                                                  ->where('student_id', $user->id)
                                                  ->first();

        // Check for single submission type
        if ($assignment->submission_type === 'single' && $existingSubmission) {
            return back()->with('error_message', 'This assignment can only be submitted once.');
        }

        $validated = $request->validate([
            'content' => 'required|string',
        ]);
        
        $updateData = [
            'content' => $validated['content'],
            'submitted_at' => now(),
            'status' => 'submitted', // Reset status on new submission
        ];

        // If resubmitting, clear previous grade and feedback
        if ($existingSubmission && $assignment->submission_type === 'multiple') {
            $updateData['grade'] = null;
            $updateData['feedback'] = null;
        }

        AssignmentSubmission::updateOrCreate(
            ['assignment_id' => $assignment->id, 'student_id' => $user->id],
            $updateData
        );

        return back()->with('success_message', 'Assignment submitted successfully!');
    }

    /**
     * Store the grade and feedback for a submission.
     */
    public function grade(Request $request, AssignmentSubmission $submission)
    {
        $user = Auth::user();
        $classroom = $submission->assignment->classroom;

        // Authorization: Ensure the user is a teacher or principal for this classroom
        if (!$classroom->teachers()->where('users.id', $user->id)->exists() && $user->role !== 'principal') {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'grade' => 'required|numeric|min:0|max:100', // Example validation
            'feedback' => 'nullable|string|max:5000',
        ]);

        $submission->update([
            'grade' => $validated['grade'],
            'feedback' => $validated['feedback'],
            'status' => 'reviewed', // Update status to show it's been graded
        ]);

        return back()->with('success_message', 'Grade saved successfully!');
    }
}