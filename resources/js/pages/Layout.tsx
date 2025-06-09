import Sidebars from '@/MyComponents/sidebar';
import { useForm, usePage } from '@inertiajs/react';
import React from 'react';

type LayoutProps = {
    children?: React.ReactNode;
};
type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

type PageProps = {
    auth: {
        user: User | null;
    };
    school: School | null;
};

type School = {
    id: number;
    name: string;
    owner_id: number;
    created_at: string;
    updated_at: string;
};

export default function Layout({ children }: LayoutProps) {
    const { post } = useForm();
    const { props } = usePage<PageProps>();
    const user = props.auth?.user;
    const school = props.school;

    const handleLogout = () => {
        post(route('logout'));
    };

    return (
        <div className="flex h-screen">
            <Sidebars />
            <div className="flex flex-1 flex-col overflow-auto">
                {/* Header */}
                <div className="flex items-center justify-between bg-white p-4 shadow">
                    <div className="flex flex-col">
                        <div className="mb-1 text-xs tracking-wider text-gray-500 uppercase">School Management System</div>
                        <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                            <span className="text-primary-600 capitalize">{school?.name}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-gray-700">Hi, {user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <a href={route('login')} className="text-sm text-blue-600 hover:underline">
                                Login bg
                            </a>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4">{children}</div>
            </div>
        </div>
    );
}
