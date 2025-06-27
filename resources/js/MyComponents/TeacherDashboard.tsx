// File: resources/js/MyComponents/TeacherDashboard.tsx

import { Link } from '@inertiajs/react';
import React from 'react';

interface School {
    id: number;
    name: string;
}

interface User {
    id: number;
    email: string;
    name: string;
}

interface Props {
    user: User;
    school: School | null;
}

const TeacherDashboard: React.FC<Props> = ({ user, school }) => {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow">
                <h1 className="text-2xl font-bold">Welcome to your dashboard Mr/Mrs {user.name}</h1>
                <p className="mb-6 text-gray-600">{user.email}</p>

                {!school ? (
                    <div>
                        <p className="mb-4 text-red-500">You do not have a school yet.</p>
                        <Link href={route('schools.create')} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                            Create School
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Link href={route('add.teacher.toschool')} className="block rounded-lg border bg-gray-50 p-4 transition hover:bg-gray-100">
                            <h2 className="mb-1 text-lg font-semibold">Add Teacher to School</h2>
                            <p className="text-sm text-gray-600">Invite registered teachers to join your school staff.</p>
                        </Link>

                        <Link href={route('add.student.toschool')} className="block rounded-lg border bg-gray-50 p-4 transition hover:bg-gray-100">
                            <h2 className="mb-1 text-lg font-semibold">Add Student to School</h2>
                            <p className="text-sm text-gray-600">Enroll registered students into your school.</p>
                        </Link>

                        <div className="rounded bg-gray-100 p-4">
                            <h2 className="mb-1 text-lg font-semibold">Manage Classes</h2>
                            <p className="text-sm text-gray-600">Create new classes and manage existing ones.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;
