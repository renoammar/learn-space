// resources/js/Pages/ClassroomManagePage.tsx

import { PageProps as InertiaBasePageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import { AlertCircle, BookOpen, CheckCircle, Plus, UserPlus, Users } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import Layout from './Layout'; // Ensure this path is correct for your project

// --- Type Definitions ---
interface AuthenticatedUser {
    id: number;
    name: string;
    email: string;
    role: 'principal' | 'teacher' | 'student' | 'admin';
    school_id?: number;
}
interface Teacher {
    id: number;
    name: string;
    email: string;
}
interface Student {
    id: number;
    name: string;
    email: string;
}
interface Assignment {
    id: number;
    title: string;
    description: string | null;
    due_date: string;
}
interface Classroom {
    id: number;
    name: string;
    code: string;
    description?: string | null;
    school_id: number;
    teachers: Teacher[];
    students: Student[];
    assignments: Assignment[];
}
interface ComponentPageProps extends InertiaBasePageProps {
    classroom: Classroom;
    auth: { user: AuthenticatedUser };
    flash?: { success_message?: string; error_message?: string };
    errors: Record<string, string>;
}

export default function ClassroomManagePage() {
    const { props } = usePage<ComponentPageProps>();
    const { classroom, auth, errors: pageErrors, flash } = props;
    const currentUserRole = auth.user.role;

    type ActiveTab = 'teachers' | 'students' | 'assignments';
    const [activeTab, setActiveTab] = useState<ActiveTab>('teachers');
    const [teacherEmail, setTeacherEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState<string | null>(flash?.success_message || null);
    const [errorMessage, setErrorMessage] = useState<string | null>(flash?.error_message || null);

    useEffect(() => {
        setSuccessMessage(flash?.success_message || null);
        setErrorMessage(flash?.error_message || null);
        const timer = setTimeout(() => {
            if (flash?.success_message) setSuccessMessage(null);
            if (flash?.error_message) setErrorMessage(null);
        }, 7000);
        return () => clearTimeout(timer);
    }, [flash]);

    const handleAddCoTeacher = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!teacherEmail.trim()) return;

        console.log('Attempting to add teacher to Classroom ID:', classroom.id, 'with email:', teacherEmail);
        router.post(
            // IMPORTANT: Changed parameter name from 'classroom' to 'class_instance_id'
            (window as any).route('classrooms.add-teacher', { class_instance_id: classroom.id }),
            { teacher_email: teacherEmail },
            {
                onSuccess: () => {
                    setTeacherEmail('');
                },
                onError: (errors) => {
                    console.error('Error adding co-teacher:', errors);
                },
                preserveState: (page) => Object.keys(page.props.errors).length > 0,
                preserveScroll: true,
            },
        );
    };

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            return dateString;
        }
    };

    const tabItems = [
        { key: 'teachers' as ActiveTab, label: 'Co-Teachers', icon: UserPlus },
        { key: 'students' as ActiveTab, label: 'Students', icon: Users },
        { key: 'assignments' as ActiveTab, label: 'Assignments', icon: BookOpen },
    ];

    return (
        <Layout>
            {' '}
            {/* Ensure Layout is correctly imported and used */}
            <Head title={`Manage Classroom: ${classroom.name}`} />
            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    {/* Header */}
                    <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">{classroom.name}</h1>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                            Class Code: <span className="font-semibold tracking-wider text-indigo-600 dark:text-indigo-400">{classroom.code}</span>
                        </p>
                        {classroom.description && <p className="text-md mt-1 text-gray-500 dark:text-gray-300">{classroom.description}</p>}
                    </div>

                    {/* Flash Messages */}
                    {successMessage && (
                        <div className="mb-6 flex items-center gap-3 rounded-md border border-green-300 bg-green-50 p-4 text-green-700 dark:border-green-600 dark:bg-green-800/30 dark:text-green-300">
                            <CheckCircle size={20} /> <span>{successMessage}</span>
                        </div>
                    )}
                    {errorMessage && (
                        <div className="mb-6 flex items-center gap-3 rounded-md border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-600 dark:bg-red-800/30 dark:text-red-300">
                            <AlertCircle size={20} /> <span>{errorMessage}</span>
                        </div>
                    )}
                    {pageErrors?.teacher_email && !errorMessage && (
                        <div className="mb-6 flex items-center gap-3 rounded-md border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-600 dark:bg-red-800/30 dark:text-red-300">
                            <AlertCircle size={20} /> <span>{pageErrors.teacher_email}</span>
                        </div>
                    )}

                    {/* Tab Navigation */}
                    <div className="mb-1">
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <nav className="-mb-px flex space-x-4 sm:space-x-6" aria-label="Tabs">
                                {tabItems.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap sm:px-3 ${activeTab === tab.key ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-300' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200'}`}
                                    >
                                        {' '}
                                        <tab.icon size={18} aria-hidden="true" /> {tab.label}{' '}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="mt-8 overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800">
                        <div className="p-6 sm:p-8">
                            {activeTab === 'teachers' && (
                                <div>
                                    <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-4 sm:flex-row sm:items-center dark:border-gray-700">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Co-Teachers List</h2>
                                        {currentUserRole === 'principal' && (
                                            <form onSubmit={handleAddCoTeacher} className="flex w-full items-stretch sm:w-auto sm:max-w-md">
                                                <input
                                                    type="email"
                                                    value={teacherEmail}
                                                    onChange={(e) => setTeacherEmail(e.target.value)}
                                                    placeholder="Co-teacher's email address"
                                                    className="form-input flex-grow rounded-l-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                                                    required
                                                />
                                                <button
                                                    type="submit"
                                                    className="inline-flex items-center justify-center rounded-r-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-800"
                                                >
                                                    <Plus size={18} className="mr-0 sm:mr-2" /> <span className="hidden sm:inline">Add Teacher</span>{' '}
                                                    <span className="sm:hidden">Add</span>
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                    {classroom.teachers.length > 0 ? (
                                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {classroom.teachers.map((teacher) => (
                                                <li key={teacher.id} className="flex items-center justify-between py-4">
                                                    {' '}
                                                    <div>
                                                        {' '}
                                                        <p className="text-md font-medium text-gray-800 dark:text-gray-200">{teacher.name}</p>{' '}
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{teacher.email}</p>{' '}
                                                    </div>{' '}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">No co-teachers have been added yet.</p>
                                    )}
                                </div>
                            )}
                            {activeTab === 'students' && (
                                <div>
                                    {' '}
                                    <h2 className="mb-6 border-b border-gray-200 pb-4 text-xl font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
                                        Enrolled Students
                                    </h2>{' '}
                                    {classroom.students.length > 0 ? (
                                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {' '}
                                            {classroom.students.map((student) => (
                                                <li key={student.id} className="flex items-center justify-between py-4">
                                                    {' '}
                                                    <div>
                                                        {' '}
                                                        <p className="text-md font-medium text-gray-800 dark:text-gray-200">{student.name}</p>{' '}
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>{' '}
                                                    </div>{' '}
                                                </li>
                                            ))}{' '}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">No students are currently enrolled in this class.</p>
                                    )}{' '}
                                </div>
                            )}
                            {activeTab === 'assignments' && (
                                <div>
                                    {' '}
                                    <h2 className="mb-6 border-b border-gray-200 pb-4 text-xl font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
                                        Class Assignments
                                    </h2>{' '}
                                    {classroom.assignments.length > 0 ? (
                                        <ul className="space-y-4">
                                            {' '}
                                            {classroom.assignments.map((assignment) => (
                                                <li key={assignment.id} className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
                                                    {' '}
                                                    <div className="flex items-center justify-between">
                                                        {' '}
                                                        <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400">
                                                            {assignment.title}
                                                        </h3>{' '}
                                                    </div>{' '}
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {' '}
                                                        Due: {formatDate(assignment.due_date)}{' '}
                                                    </p>{' '}
                                                    {assignment.description && (
                                                        <p className="mt-2 text-sm whitespace-pre-line text-gray-600 dark:text-gray-300">
                                                            {' '}
                                                            {assignment.description}{' '}
                                                        </p>
                                                    )}{' '}
                                                </li>
                                            ))}{' '}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">No assignments have been created for this class yet.</p>
                                    )}{' '}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
