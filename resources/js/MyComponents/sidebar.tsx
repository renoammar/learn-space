// File: resources/js/MyComponents/sidebar.tsx

import { usePage } from '@inertiajs/react';
import { FileText, GraduationCap, Home, Settings, Users } from 'lucide-react';
import { FC, useState } from 'react';
import SidebarItem from './sidebarItem';

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
};
const Sidebars: FC = () => {
    const [activeItem, setActiveItem] = useState<string>('Dashboard'); // default active item
    const { props } = usePage<PageProps>();
    const user = props.auth?.user;
    const handleItemClick = (text: string) => {
        setActiveItem(text);
    };

    return (
        <div className="sidebars flex h-screen w-[15%] flex-col justify-between px-4 py-6">
            <div>
                {/* Logo Section */}
                <div className="mb-10 flex flex-col items-start">
                    <div className="flex flex-col items-start justify-center text-2xl font-bold text-white">
                        {/* FIX: Replaced invalid character with a standard emoji */}
                        <span className="text-4xl drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)]">🎓</span>
                        <span>LearnSpace</span>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-2 text-sm text-white">
                    {user?.role === 'teacher' && (
                        <SidebarItem onClick={handleItemClick} icon={<Users size={16} />} text="Teachers" isActive={activeItem === 'Teachers'} />
                    )}
                    <SidebarItem
                        href="/home"
                        onClick={handleItemClick}
                        icon={<Home size={16} />}
                        text="Dashboard"
                        isActive={activeItem === 'Dashboard'}
                    />
                    <SidebarItem
                        href="/students-classes"
                        onClick={handleItemClick}
                        icon={<GraduationCap size={16} />}
                        text="Students / classes"
                        isActive={activeItem === 'Students / classes'}
                    />
                    {/* ADDITION: Added the School Members link */}
                    <SidebarItem
                        href={route('school.members')}
                        onClick={handleItemClick}
                        icon={<Users size={16} />}
                        text="School members"
                        isActive={activeItem === 'School members'}
                    />
                    <SidebarItem
                        onClick={handleItemClick}
                        icon={<Settings size={16} />}
                        text="Settings and profile"
                        isActive={activeItem === 'Settings and profile'}
                    />
                    <SidebarItem onClick={handleItemClick} icon={<FileText size={16} />} text="Schedlue" isActive={activeItem === 'Exams'} />
                </nav>
            </div>

            {/* User Section */}
            <div className="mt-6 rounded-xl bg-white/10 p-3 text-white shadow-inner">
                <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-lg font-bold uppercase shadow-md">
                        {user?.name?.[0] || 'U'}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold">{user?.name}</span>
                        <span className="text-xs text-gray-300">{user?.role}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebars;
