<?php

namespace App\Http\Controllers;

use App\Models\ScheduleEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index()
    {
        // Load both relationships since they're both proper Eloquent relationships
        $user = Auth::user();
        // $user->load(['classrooms', 'enrolledClassrooms']);
        $schoolId = $user->school_id;

        if (!$schoolId) {
            return Inertia::render('Schedule/Index', [
                'events' => [],
                'classrooms' => [],
                'isTeacherOrPrincipal' => false,
            ]);
        }

        // Build the events query with proper logic
        $eventsQuery = ScheduleEvent::where('school_id', $schoolId)
            ->where(function ($query) use ($user) {
                // Events for the whole school (no classroom_id)
                $query->whereNull('classroom_id');
                
                // OR events for specific classrooms the user has access to
                if ($user->role === 'teacher' || $user->role === 'principal') {
                    // Accessing 'classrooms' as a property. This assumes it's an accessor
                    // that returns a collection of the user's classrooms.
                    $classroomIds = $user->classrooms->pluck('id');
                    if ($classroomIds->isNotEmpty()) {
                        $query->orWhereIn('classroom_id', $classroomIds);
                    }
                } elseif ($user->role === 'student') {
                    $classroomIds = $user->enrolledClassrooms->pluck('id');
                    if ($classroomIds->isNotEmpty()) {
                        $query->orWhereIn('classroom_id', $classroomIds);
                    }
                }
            });

        $events = $eventsQuery
            ->with(['user:id,name', 'classroom:id,name'])
            ->orderBy('start_date')
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'description' => $event->description,
                    'type' => $event->type,
                    'start_date' => $event->start_date,
                    'end_date' => $event->end_date,
                    'user' => [
                        'id' => $event->user->id,
                        'name' => $event->user->name,
                    ],
                    'classroom' => $event->classroom ? [
                        'id' => $event->classroom->id,
                        'name' => $event->classroom->name,
                    ] : null,
                ];
            });

        // If the user is a teacher or principal, get their classrooms.
        // We access 'classrooms' as a property, which should trigger the accessor,
        // and then map the resulting collection.
        $classrooms = ($user->role === 'teacher' || $user->role === 'principal') 
            ? $user->classrooms->map(function ($classroom) {
                return [
                    'id' => $classroom->id,
                    'name' => $classroom->name,
                ];
            })
            : [];

        return Inertia::render('Schedule', [
            'events' => $events,
            'classrooms' => $classrooms,
            'isTeacherOrPrincipal' => $user->role === 'teacher' || $user->role === 'principal',
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'teacher' && $user->role !== 'principal') {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|in:exam,holiday,deadline,event',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'scope' => 'required|string|in:school,classroom',
            'classroom_id' => 'nullable|required_if:scope,classroom|exists:classrooms,id',
        ]);

        // When creating a classroom-specific event, verify the teacher is assigned to that classroom.
        // Instead of a relationship query `classrooms()->where(...)`, we use the collection method `contains()`
        // on the `classrooms` property (assuming it's an accessor that returns a collection).
        if ($validated['scope'] === 'classroom' && !$user->classrooms->contains('id', $validated['classroom_id'])) {
            abort(403, 'You are not authorized to create an event for this classroom.');
        }

        ScheduleEvent::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'type' => $validated['type'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'user_id' => $user->id,
            'school_id' => $user->school_id,
            'classroom_id' => $validated['scope'] === 'classroom' ? $validated['classroom_id'] : null,
        ]);

        return redirect()->route('schedule.index')->with('success_message', 'Event created successfully.');
    }
}