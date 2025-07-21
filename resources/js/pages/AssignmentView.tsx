import SubmissionGrader from '@/MyComponents/SubmissionGrader';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React, { FormEvent } from 'react';
import Layout from './Layout';

// --- Type Definitions ---
interface AuthenticatedUser {
    id: number;
    name: string;
    email: string;
    role: 'principal' | 'teacher' | 'student';
}

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

interface Assignment {
    id: number;
    classroom_id: number;
    title: string;
    description: string | null;
    due_date: string;
    submissions: Submission[];
    user: { name: string };
    submission_type: 'single' | 'multiple'; // Added submission_type
}

interface PageProps {
    assignment: Assignment;
    mySubmission: Submission | null;
    auth: { user: AuthenticatedUser };
    flash?: { success_message?: string; error_message?: string };
    [key: string]: unknown;
}

// --- Main Assignment View Component ---
const AssignmentView: React.FC & { layout?: (page: React.ReactNode) => React.ReactNode } = () => {
    const { props } = usePage<PageProps>();
    const { assignment, auth, mySubmission, flash } = props;
    const isTeacher = auth.user.role === 'teacher' || auth.user.role === 'principal';
    const hasSubmittedSingle = assignment.submission_type === 'single' && mySubmission;

    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        content: mySubmission?.content || '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('assignments.submit', { assignment: assignment.id }), {
            preserveScroll: true,
        });
    };

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return 'No due date';
        return new Date(dateString).toLocaleString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <Head title={assignment.title} />
            <div className="mx-auto min-h-screen max-w-4xl space-y-6 bg-[#F8FAFC] px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-2">
                    <Link
                        href={route('classrooms.manage', { id: assignment.classroom_id })}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-blue-700"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Classroom</span>
                    </Link>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow">
                    <div className="border-b border-gray-200 pb-4">
                        <h1 className="text-3xl font-bold text-gray-900">{assignment.title}</h1>
                        <p className="mt-2 text-gray-600">Due: {formatDate(assignment.due_date)}</p>
                        <p className="text-sm text-gray-500">Created by: {assignment.user?.name}</p>
                    </div>
                    {assignment.description && (
                        <div className="prose prose-sm mt-4 max-w-none text-gray-700">
                            <p>{assignment.description}</p>
                        </div>
                    )}
                </div>

                {isTeacher ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Submissions ({assignment.submissions.length})</h2>
                        {assignment.submissions.length > 0 ? (
                            <ul className="space-y-4">
                                {assignment.submissions.map((submission) => (
                                    <SubmissionGrader key={submission.id} submission={submission} />
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No students have submitted this assignment yet.</p>
                        )}
                    </div>
                ) : (
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-800">{mySubmission ? 'Your Submission' : 'Submit Your Work'}</h2>
                        {flash?.success_message && wasSuccessful && (
                            <div className="mb-4 rounded-md bg-green-100 p-3 text-sm text-green-700">{flash.success_message}</div>
                        )}
                        {flash?.error_message && <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">{flash.error_message}</div>}

                        {mySubmission?.grade !== null && typeof mySubmission?.grade !== 'undefined' && (
                            <div className="mb-6 rounded-lg border-2 border-green-200 bg-green-50 p-4">
                                <h3 className="text-lg font-semibold text-green-800">Your Grade & Feedback</h3>
                                <p className="text-4xl font-bold text-green-700">{mySubmission.grade}</p>
                                {mySubmission.feedback && (
                                    <div className="prose prose-sm mt-2 text-green-900">
                                        <p className="font-medium">Feedback:</p>
                                        <p>{mySubmission.feedback}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {hasSubmittedSingle ? (
                            <div className="rounded-lg border bg-gray-100 p-4">
                                <h3 className="font-semibold text-gray-800">Submission Sent</h3>
                                <p className="mt-2 text-sm text-gray-600">This assignment only allows one submission. Your work has been recorded.</p>
                                <div className="mt-4 rounded-md border bg-white p-3 text-sm whitespace-pre-wrap text-gray-700">
                                    {mySubmission.content}
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <textarea
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    rows={10}
                                    className="w-full rounded-md border border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Type your answer here..."
                                ></textarea>
                                {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
                                <div className="mt-4 flex items-center justify-end gap-4">
                                    {assignment.submission_type === 'multiple' && mySubmission && (
                                        <p className="text-xs text-gray-500">You can update your submission until the due date.</p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Submitting...' : mySubmission ? 'Update Submission' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

AssignmentView.layout = (page: React.ReactNode) => <Layout>{page}</Layout>;

export default AssignmentView;
