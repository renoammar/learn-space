import Layout from '@/pages/Layout';
import { Head } from '@inertiajs/react';
import React from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'principal' | 'teacher' | 'student';
}

interface School {
    id: number;
    name: string;
}

interface MembersPageProps {
    school: School;
    members: User[];
    auth: { user: User };
}

const MembersPage: React.FC<MembersPageProps> & { layout?: (page: React.ReactNode) => React.ReactNode } = ({ school, members }) => {
    const principals = members.filter((member) => member.role === 'principal');
    const teachers = members.filter((member) => member.role === 'teacher');
    const students = members.filter((member) => member.role === 'student');

    const renderUserList = (users: User[], title: string, emptyMessage: string) => (
        <div>
            <h2 className="mb-3 text-xl font-semibold text-gray-800">{title}</h2>
            <div className="overflow-hidden rounded-lg bg-white shadow-md">
                <ul className="divide-y divide-gray-200">
                    {users.length > 0 ? (
                        users.map((user) => (
                            <li key={user.id} className="flex items-center justify-between p-4 transition-colors duration-200 hover:bg-gray-50">
                                <div>
                                    <p className="font-medium text-gray-900">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                                <span className="rounded-full bg-indigo-500 px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase">
                                    {user.role}
                                </span>
                            </li>
                        ))
                    ) : (
                        <p className="p-4 text-gray-500">{emptyMessage}</p>
                    )}
                </ul>
            </div>
        </div>
    );

    return (
        <>
            <Head title={`Members of ${school.name}`} />
            <div className="min-h-full bg-gray-50 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6 border-b border-gray-200 pb-4">
                        <h1 className="text-3xl font-bold text-gray-900">School Members</h1>
                        <p className="text-md mt-1 text-gray-600">
                            A complete list of all principals, teachers, and students at <span className="font-semibold">{school.name}</span>.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <div className="space-y-8">
                            {renderUserList(principals, 'Principals', 'No principals found.')}
                            {renderUserList(teachers, 'Teachers', 'No teachers found.')}
                        </div>
                        <div>{renderUserList(students, 'Students', 'No students found.')}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

MembersPage.layout = (page) => <Layout>{page}</Layout>;

export default MembersPage;
