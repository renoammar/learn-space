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
}
interface Assignment {
    id: number;
    classroom_id: number;
    title: string;
    description: string | null;
    due_date: string;
    submissions: Submission[];
    user: { name: string };
}
interface PageProps {
    assignment: Assignment;
    mySubmission: Submission | null;
    auth: { user: AuthenticatedUser };
    flash?: { success_message?: string };
    [key: string]: any;
}

const AssignmentView: React.FC & { layout?: (page: React.ReactNode) => React.ReactNode } = () => {
    const { props } = usePage<PageProps>();
    const { assignment, auth, mySubmission, flash } = props;
    const isTeacher = auth.user.role === 'teacher' || auth.user.role === 'principal';

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
                {/* --- Back to Classroom Button --- */}
                <div className="mb-2">
                    <Link
                        href={route('classrooms.manage', { id: assignment.classroom_id })}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-blue-700"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Classroom</span>
                    </Link>
                </div>

                {/* Assignment Details */}
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

                {/* Content based on role */}
                {isTeacher ? (
                    // Teacher's View: List of Submissions
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Submissions ({assignment.submissions.length})</h2>
                        {assignment.submissions.length > 0 ? (
                            <ul className="space-y-4">
                                {assignment.submissions.map((submission) => (
                                    <li key={submission.id} className="rounded-md border border-gray-200 p-4">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-gray-800">{submission.student.name}</p>
                                            <p className="text-xs text-gray-500">Submitted: {formatDate(submission.submitted_at)}</p>
                                        </div>
                                        <p className="mt-2 text-sm whitespace-pre-wrap text-gray-600">{submission.content}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No students have submitted this assignment yet.</p>
                        )}
                    </div>
                ) : (
                    // Student's View: Submission Form
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-800">{mySubmission ? 'Your Submission' : 'Submit Your Work'}</h2>
                        {flash?.success_message && wasSuccessful && (
                            <div className="mb-4 rounded-md bg-green-100 p-3 text-sm text-green-700">{flash.success_message}</div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                rows={10}
                                className="w-full rounded-md border border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Type your answer here..."
                            ></textarea>
                            {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Submitting...' : mySubmission ? 'Update Submission' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};

AssignmentView.layout = (page: React.ReactNode) => <Layout>{page}</Layout>;

export default AssignmentView;
