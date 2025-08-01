import Layout from '@/pages/Layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { GraduationCap, Shield, ShieldOff, UserPlus } from 'lucide-react';
import React from 'react';

// Define the User interface with all possible roles
interface User {
    id: number;
    name: string;
    email: string;
    role: 'principal' | 'teacher' | 'student' | 'school_manager';
}

interface School {
    id: number;
    name: string;
}

interface MembersPageProps {
    school: School;
    members: User[];
    auth: { user: User };
    [key: string]: unknown;
}

const MembersPage: React.FC<MembersPageProps> & { layout?: (page: React.ReactNode) => React.ReactNode } = ({ school, members }) => {
    // Determine if the logged-in user is a principal or school manager
    const { auth } = usePage<MembersPageProps>().props;
    const isPrincipal = auth.user.role === 'principal';
    const isSchoolManager = auth.user.role === 'school_manager';
    const canManageSchool = isPrincipal || isSchoolManager;

    // Filter members by their roles
    const principals = members.filter((member) => member.role === 'principal');
    const managers = members.filter((member) => member.role === 'school_manager');
    const teachers = members.filter((member) => member.role === 'teacher');
    const students = members.filter((member) => member.role === 'student');

    // Handle the promotion/demotion of a user
    const handleToggleManager = (userId: number) => {
        if (confirm("Are you sure you want to change this user's manager status?")) {
            router.post(
                route('school.members.toggleManager', { member: userId }),
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const renderUserList = (users: User[], title: string, emptyMessage: string) => (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                {/* Add Teacher/Student buttons for principals and school managers */}
                {canManageSchool && (
                    <div className="flex gap-2">
                        {title === 'Teachers' && (
                            <Link
                                href={route('add.teacher.toschool')}
                                className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                <UserPlus size={16} />
                                Add Teacher
                            </Link>
                        )}
                        {title === 'Students' && (
                            <Link
                                href={route('add.student.toschool')}
                                className="flex items-center gap-2 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
                            >
                                <GraduationCap size={16} />
                                Add Student
                            </Link>
                        )}
                    </div>
                )}
            </div>
            <div className="overflow-hidden rounded-lg bg-white shadow-md">
                <ul className="divide-y divide-gray-200">
                    {users.length > 0 ? (
                        users.map((user) => (
                            <li key={user.id} className="flex items-center justify-between p-4 transition-colors duration-200 hover:bg-gray-50">
                                <div>
                                    <p className="font-medium text-gray-900">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase ${
                                            user.role === 'principal'
                                                ? 'bg-red-500'
                                                : user.role === 'school_manager'
                                                  ? 'bg-purple-500'
                                                  : user.role === 'teacher'
                                                    ? 'bg-indigo-500'
                                                    : 'bg-gray-500' // Fallback for students
                                        }`}
                                    >
                                        {user.role.replace('_', ' ')}
                                    </span>
                                    {/* Show toggle button only for principals, and only on teachers or managers */}
                                    {isPrincipal && (user.role === 'teacher' || user.role === 'school_manager') && (
                                        <button
                                            onClick={() => handleToggleManager(user.id)}
                                            className={`rounded-md p-1.5 transition-colors ${user.role === 'teacher' ? 'hover:bg-green-100' : 'hover:bg-red-100'}`}
                                            title={user.role === 'teacher' ? 'Promote to Manager' : 'Demote to Teacher'}
                                        >
                                            {user.role === 'teacher' ? (
                                                <Shield size={16} className="text-green-600" />
                                            ) : (
                                                <ShieldOff size={16} className="text-red-600" />
                                            )}
                                        </button>
                                    )}
                                </div>
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
                        {/* Quick action buttons for principals and school managers */}
                        {canManageSchool && (
                            <div className="mt-4 flex gap-3">
                                <Link
                                    href={route('add.teacher.toschool')}
                                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    <UserPlus size={16} />
                                    Add Teacher
                                </Link>
                                <Link
                                    href={route('add.student.toschool')}
                                    className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                                >
                                    <GraduationCap size={16} />
                                    Add Student
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <div className="space-y-8">
                            {renderUserList(principals, 'Principals', 'No principals found.')}
                            {renderUserList(managers, 'School Managers', 'No school managers found.')}
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
