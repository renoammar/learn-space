// resources/js/MyComponents/TeacherDashboard.tsx

import { Link } from '@inertiajs/react';
import { School as SchoolIcon } from 'lucide-react'; // Renamed to avoid conflict with the type
import React from 'react';

interface School {
    id: number;
    name: string;
}

interface User {
    id: number;
    email: string;
    name: string;
    role: 'principal' | 'teacher'; // Be specific about roles this component handles
}

interface Props {
    user: User;
    school: School | null;
}

const TeacherDashboard: React.FC<Props> = ({ user, school }) => {
    // ---- 1. Handle case where user is NOT associated with a school ----
    if (!school) {
        // If the user is a 'principal', prompt them to create their school.
        if (user.role === 'principal') {
            return (
                <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 p-8 text-center">
                    <SchoolIcon className="h-16 w-16 text-gray-400" />
                    <h1 className="text-2xl font-bold text-gray-800">Welcome, Principal {user.name}!</h1>
                    <p className="max-w-md text-gray-600">
                        You have not created a school yet. Get started by creating your school profile to manage teachers, students, and classes.
                    </p>
                    <Link
                        href={route('schools.create')}
                        className="mt-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-blue-700"
                    >
                        Create Your School
                    </Link>
                </div>
            );
        }

        // If the user is a 'teacher', show a message to wait for an invitation.
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 p-8 text-center">
                <SchoolIcon className="h-16 w-16 text-gray-400" />
                <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}!</h1>
                <p className="max-w-md text-gray-600">
                    You are not yet assigned to a school. Please ask your school's principal to add you using your email. Once assigned, you'll be
                    able to create and manage your classes.
                </p>
                <p className="mt-2 text-sm text-gray-500">Waiting for a school invitation...</p>
            </div>
        );
    }

    // ---- 2. Render the dashboard for a user who IS associated with a school ----
    return (
        <div className="bg-gray-50 p-6">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="mt-1 text-gray-600">
                        Welcome back, {user.name}. You are logged in as a {user.role} for <span className="font-semibold">{school.name}</span>.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Principal-specific actions */}
                    {user.role === 'principal' && (
                        <>
                            <Link
                                href={route('add.teacher.toschool')}
                                className="block rounded-lg border bg-white p-6 transition hover:bg-gray-50 hover:shadow-sm"
                            >
                                <h2 className="mb-1 text-lg font-semibold">Add Teacher</h2>
                                <p className="text-sm text-gray-600">Invite registered teachers to join your school staff.</p>
                            </Link>

                            <Link
                                href={route('add.student.toschool')}
                                className="block rounded-lg border bg-white p-6 transition hover:bg-gray-50 hover:shadow-sm"
                            >
                                <h2 className="mb-1 text-lg font-semibold">Add Student</h2>
                                <p className="text-sm text-gray-600">Enroll registered students into your school.</p>
                            </Link>
                        </>
                    )}

                    {/* Actions for both Teachers and Principals */}
                    <Link
                        href={route('students.classes')}
                        className="block rounded-lg border bg-white p-6 transition hover:bg-gray-50 hover:shadow-sm"
                    >
                        <h2 className="mb-1 text-lg font-semibold">Manage Classes</h2>
                        <p className="text-sm text-gray-600">View, create, and manage your classes and assignments.</p>
                    </Link>

                    <Link href={route('school.members')} className="block rounded-lg border bg-white p-6 transition hover:bg-gray-50 hover:shadow-sm">
                        <h2 className="mb-1 text-lg font-semibold">School Members</h2>
                        <p className="text-sm text-gray-600">View all staff and students at your school.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
