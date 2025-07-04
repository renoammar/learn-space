import { useForm } from '@inertiajs/react';
import React, { FormEvent } from 'react';

// --- Type Definitions ---
// It's good practice to define the types the component will use.
interface Submission {
    id: number;
    content: string;
    submitted_at: string;
    student: {
        id: number;
        name: string;
    };
    grade?: number | null;
    feedback?: string | null;
}

interface SubmissionGraderProps {
    submission: Submission;
}

// --- The SubmissionGrader Component ---
const SubmissionGrader: React.FC<SubmissionGraderProps> = ({ submission }) => {
    const { data, setData, post, processing, errors } = useForm({
        grade: submission.grade || '',
        feedback: submission.feedback || '',
    });

    const handleGradeSubmit = (e: FormEvent) => {
        e.preventDefault();
        // This posts the form data to the grading route
        post(route('submissions.grade', { submission: submission.id }), {
            preserveScroll: true, // Keeps the user's scroll position after the request
        });
    };

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <li className="rounded-lg border bg-gray-50 p-4 transition-shadow hover:shadow-sm">
            {/* Student and submission info */}
            <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-800">{submission.student.name}</p>
                <p className="text-xs text-gray-500">Submitted: {formatDate(submission.submitted_at)}</p>
            </div>
            <p className="mt-2 text-sm whitespace-pre-wrap text-gray-700">{submission.content}</p>

            {/* Grading Form */}
            <form onSubmit={handleGradeSubmit} className="mt-4 space-y-3 border-t pt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-1">
                        <label htmlFor={`grade-${submission.id}`} className="block text-sm font-medium text-gray-700">
                            Grade (0-100)
                        </label>
                        <input
                            id={`grade-${submission.id}`}
                            type="number"
                            value={data.grade}
                            onChange={(e) => setData('grade', e.target.value)}
                            className="form-input mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            min="0"
                            max="100"
                            step="0.01"
                        />
                        {errors.grade && <p className="mt-1 text-xs text-red-600">{errors.grade}</p>}
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor={`feedback-${submission.id}`} className="block text-sm font-medium text-gray-700">
                            Feedback
                        </label>
                        <textarea
                            id={`feedback-${submission.id}`}
                            value={data.feedback}
                            onChange={(e) => setData('feedback', e.target.value)}
                            rows={2}
                            className="form-textarea mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Provide feedback for the student..."
                        ></textarea>
                        {errors.feedback && <p className="mt-1 text-xs text-red-600">{errors.feedback}</p>}
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Save Grade'}
                    </button>
                </div>
            </form>
        </li>
    );
};

export default SubmissionGrader;
