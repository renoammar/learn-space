import { PageProps as InertiaBasePageProps } from '@inertiajs/core';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertCircle, BookOpen, CheckCircle, Plus, UserPlus, Users } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import CreateAssignmentModal from '../MyComponents/CreateAssignmentModal';
import Layout from './Layout';

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
interface Submission {
    id: number;
    student_id: number;
    status: string;
}
interface Assignment {
    id: number;
    title: string;
    description: string | null;
    due_date: string;
    user?: {
        name: string;
    };
    submissions: Submission[];
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
    const isTeacherOrPrincipal = currentUserRole === 'teacher' || currentUserRole === 'principal';

    type ActiveTab = 'teachers' | 'students' | 'assignments';
    const [activeTab, setActiveTab] = useState<ActiveTab>(isTeacherOrPrincipal ? 'teachers' : 'assignments');
    const [teacherEmail, setTeacherEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState<string | null>(flash?.success_message || null);
    const [errorMessage, setErrorMessage] = useState<string | null>(flash?.error_message || null);
    const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);
    const [studentEmail, setStudentEmail] = useState('');

    const handleEnrollStudent = (e: FormEvent) => {
        e.preventDefault();
        router.post(
            route('classrooms.enrollStudent', { classroom: classroom.id }),
            { student_email: studentEmail },
            {
                onSuccess: () => setStudentEmail(''),
                preserveState: (page) => Object.keys(page.props.errors).length > 0,
                preserveScroll: true,
            },
        );
    };

    const handleRemoveStudent = (studentId: number) => {
        if (confirm('Are you sure you want to remove this student?')) {
            router.delete(route('classrooms.removeStudent', { classroom: classroom.id, student: studentId }), {
                preserveScroll: true,
            });
        }
    };

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
        router.post(
            (window as any).route('classrooms.add-teacher', { class_instance_id: classroom.id }),
            { teacher_email: teacherEmail },
            {
                onSuccess: () => setTeacherEmail(''),
                onError: (errors) => console.error('Error adding co-teacher:', errors),
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
        { key: 'teachers' as ActiveTab, label: 'Teachers', icon: UserPlus, visible: true },
        { key: 'students' as ActiveTab, label: 'Students', icon: Users, visible: true },
        { key: 'assignments' as ActiveTab, label: 'Assignments', icon: BookOpen, visible: true },
    ];

    return (
        <Layout>
            <Head title={`Manage Classroom: ${classroom.name}`} />
            <div className="min-h-screen bg-[#F8FAFC] px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h1 className="text-3xl font-bold text-gray-900">{classroom.name}</h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Class Code: <span className="font-semibold text-blue-600">{classroom.code}</span>
                        </p>
                        {classroom.description && <p className="text-md mt-1 text-gray-500">{classroom.description}</p>}
                    </div>

                    {successMessage && (
                        <div className="mb-6 flex items-center gap-3 rounded-md border border-green-300 bg-green-50 p-4 text-green-700">
                            <CheckCircle size={20} /> <span>{successMessage}</span>
                        </div>
                    )}
                    {errorMessage && (
                        <div className="mb-6 flex items-center gap-3 rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
                            <AlertCircle size={20} /> <span>{errorMessage}</span>
                        </div>
                    )}
                    {pageErrors?.teacher_email && !errorMessage && (
                        <div className="mb-6 flex items-center gap-3 rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
                            <AlertCircle size={20} /> <span>{pageErrors.teacher_email}</span>
                        </div>
                    )}

                    <div className="mb-1">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-4 sm:space-x-6" aria-label="Tabs">
                                {tabItems
                                    .filter((tab) => tab.visible)
                                    .map((tab) => (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap sm:px-3 ${
                                                activeTab === tab.key
                                                    ? 'border-blue-500 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }`}
                                        >
                                            <tab.icon size={18} aria-hidden="true" /> {tab.label}
                                        </button>
                                    ))}
                            </nav>
                        </div>
                    </div>

                    <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="p-6 sm:p-8">
                            {/* TEACHERS TAB */}
                            {activeTab === 'teachers' && (
                                <div>
                                    <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-4 sm:flex-row sm:items-center">
                                        <h2 className="text-xl font-semibold text-gray-900">Co-Teachers List</h2>
                                        {currentUserRole === 'principal' && (
                                            <form onSubmit={handleAddCoTeacher} className="flex w-full items-stretch sm:w-auto sm:max-w-md">
                                                <input
                                                    type="email"
                                                    value={teacherEmail}
                                                    onChange={(e) => setTeacherEmail(e.target.value)}
                                                    placeholder="Co-teacher's email"
                                                    className="form-input flex-grow rounded-l-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                                                    required
                                                />
                                                <button
                                                    type="submit"
                                                    className="inline-flex items-center rounded-r-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                                                >
                                                    <Plus size={18} className="mr-2" /> Add
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                    {classroom.teachers.length > 0 ? (
                                        <ul className="divide-y divide-gray-200">
                                            {classroom.teachers.map((teacher) => (
                                                <li key={teacher.id} className="py-4">
                                                    <p className="text-md font-medium text-gray-800">{teacher.name}</p>
                                                    <p className="text-sm text-gray-500">{teacher.email}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500">No co-teachers have been added yet.</p>
                                    )}
                                </div>
                            )}

                            {/* STUDENTS TAB */}
                            {activeTab === 'students' && (
                                <div>
                                    <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-4 sm:flex-row sm:items-center">
                                        <h2 className="text-xl font-semibold text-gray-900">Enrolled Students</h2>
                                        {isTeacherOrPrincipal && (
                                            <form onSubmit={handleEnrollStudent} className="flex w-full items-stretch sm:w-auto sm:max-w-md">
                                                <input
                                                    type="email"
                                                    value={studentEmail}
                                                    onChange={(e) => setStudentEmail(e.target.value)}
                                                    placeholder="Student's email"
                                                    className="form-input flex-grow rounded-l-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                                                    required
                                                />
                                                <button
                                                    type="submit"
                                                    className="inline-flex items-center rounded-r-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                    {pageErrors.student_email && <div className="mb-4 text-sm text-red-500">{pageErrors.student_email}</div>}
                                    {classroom.students.length > 0 ? (
                                        <ul className="divide-y divide-gray-200">
                                            {classroom.students.map((student) => (
                                                <li key={student.id} className="flex items-center justify-between py-4">
                                                    <div>
                                                        <p className="text-md font-medium text-gray-800">{student.name}</p>
                                                        <p className="text-sm text-gray-500">{student.email}</p>
                                                    </div>
                                                    {isTeacherOrPrincipal && (
                                                        <button
                                                            onClick={() => handleRemoveStudent(student.id)}
                                                            className="rounded-md bg-red-100 px-3 py-1 text-xs text-red-700 hover:bg-red-200"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500">No students are currently enrolled in this class.</p>
                                    )}
                                </div>
                            )}

                            {/* ASSIGNMENTS TAB */}
                            {activeTab === 'assignments' && (
                                <div>
                                    <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
                                        <h2 className="text-xl font-semibold text-gray-900">Class Assignments</h2>
                                        {isTeacherOrPrincipal && (
                                            <button
                                                onClick={() => setShowCreateAssignmentModal(true)}
                                                className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                            >
                                                <Plus size={16} className="mr-2" />
                                                Create Assignment
                                            </button>
                                        )}
                                    </div>
                                    {classroom.assignments.length > 0 ? (
                                        <ul className="space-y-4">
                                            {classroom.assignments.map((assignment) => {
                                                const hasSubmitted =
                                                    !isTeacherOrPrincipal && assignment.submissions && assignment.submissions.length > 0;
                                                return (
                                                    <li
                                                        key={assignment.id}
                                                        className="rounded-md border border-gray-200 p-4 transition-shadow hover:shadow-md"
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-grow">
                                                                <Link
                                                                    href={route('assignments.show', assignment.id)}
                                                                    className="text-lg font-semibold text-blue-700 hover:underline"
                                                                >
                                                                    {assignment.title}
                                                                </Link>
                                                                <p className="text-sm text-gray-500">Due: {formatDate(assignment.due_date)}</p>
                                                                {assignment.description && (
                                                                    <p className="mt-2 text-sm whitespace-pre-line text-gray-600">
                                                                        {assignment.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="ml-4 flex-shrink-0 text-right">
                                                                {isTeacherOrPrincipal ? (
                                                                    <span className="text-sm text-gray-500">
                                                                        By: {assignment.user?.name || 'N/A'}
                                                                    </span>
                                                                ) : hasSubmitted ? (
                                                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                                                                        Done
                                                                    </span>
                                                                ) : (
                                                                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                                                                        To Do
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500">No assignments have been created for this class yet.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showCreateAssignmentModal && <CreateAssignmentModal classroomId={classroom.id} onClose={() => setShowCreateAssignmentModal(false)} />}
        </Layout>
    );
}
