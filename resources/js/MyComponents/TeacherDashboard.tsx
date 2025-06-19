// File: resources/js/MyComponents/TeacherDashboard.tsx

import { Link, useForm } from '@inertiajs/react'; // <-- Import useForm
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
    // Add useForm for the add teacher form
    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm({
        email: '',
    });

    const handleAddTeacher = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('schools.addTeacher'), {
            onSuccess: () => reset('email'), // Clear the form on success
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow">
                <h1 className="text-2xl font-bold">Welcome to your dashboard Mr/Mrs {user.name}</h1>
                <p className="mb-6 text-gray-600">{user.email}</p>

                {!school ? (
                    <div>
                        <p className="mb-4 text-red-500">Anda belum memiliki sekolah.</p>
                        <Link href={route('schools.create')} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                            Buat Sekolah
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* --- START: UPDATED SECTION --- */}
                        <Link href={route('add.teacher.toschool')}>
                            <div className="rounded-lg border bg-gray-50 p-4">
                                <h2 className="mb-2 text-lg font-semibold">Add Teacher to School</h2>
                            </div>
                        </Link>
                        {/* --- END: UPDATED SECTION --- */}

                        <div className="rounded bg-gray-100 p-4">
                            <h2 className="mb-1 text-lg font-semibold">Add classes</h2>
                            <p className="text-sm text-gray-600">Placeholder untuk membuat kelas dan menambahkan materi pembelajaran.</p>
                        </div>
                        <div className="rounded bg-gray-100 p-4">
                            <h2 className="mb-1 text-lg font-semibold">Add students</h2>
                            <p className="text-sm text-gray-600">Placeholder untuk menambahkan murid ke dalam kelas.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;
