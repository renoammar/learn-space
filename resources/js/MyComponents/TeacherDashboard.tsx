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
                        <p className="mb-4 text-red-500">Anda belum memiliki sekolah.</p>
                        <Link
                            href={route('schools.create')} // Ganti jika route berbeda
                            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Buat Sekolah
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="rounded bg-gray-100 p-4">
                            <h2 className="mb-1 text-lg font-semibold">Add other admins</h2>
                            <p className="text-sm text-gray-600">
                                {/* TODO: Ganti placeholder ini dengan form untuk menambahkan admin */}
                                Placeholder untuk menambahkan admin lainnya ke sekolah Anda.
                            </p>
                        </div>
                        <div className="rounded bg-gray-100 p-4">
                            <h2 className="mb-1 text-lg font-semibold">Add classes</h2>
                            <p className="text-sm text-gray-600">
                                {/* TODO: Ganti placeholder ini dengan fitur membuat kelas */}
                                Placeholder untuk membuat kelas dan menambahkan materi pembelajaran.
                            </p>
                        </div>
                        <div className="rounded bg-gray-100 p-4">
                            <h2 className="mb-1 text-lg font-semibold">Add students</h2>
                            <p className="text-sm text-gray-600">
                                {/* TODO: Ganti placeholder ini dengan fitur menambahkan murid */}
                                Placeholder untuk menambahkan murid ke dalam kelas.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;
