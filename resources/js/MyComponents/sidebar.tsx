import { usePage } from '@inertiajs/react';
import { CalendarDays, GraduationCap, Home, Settings, Users } from 'lucide-react';
import { FC, useState } from 'react';
import SidebarItem from './sidebarItem';

// Define the types for User and School to ensure type safety
type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

type School = {
    id: number;
    name: string;
};

// Define the expected props for the page, including the authenticated user and their school
type PageProps = {
    auth: {
        user: User | null;
    };
    school: School | null;
};

const Sidebars: FC = () => {
    // Set the initial active item based on the current URL path
    const [activeItem, setActiveItem] = useState<string>(() => {
        const path = window.location.pathname;
        if (path.includes('/home')) return 'Dashboard';
        if (path.includes('/students-classes')) return 'Students / classes';
        if (path.includes('/school/members')) return 'School members';
        if (path.includes('/settings')) return 'Settings and profile';
        if (path.includes('/schedule')) return 'Schedule';
        return 'Dashboard';
    });

    // Correctly extract typed props
    const { auth, school } = usePage<PageProps>().props;

    const user = auth.user;

    const handleItemClick = (text: string) => {
        setActiveItem(text);
    };

    // Determine if the user should be able to access school-related pages.
    const canNavigateSchoolPages = !!school || user?.role === 'principal';

    return (
        <div className="sidebars flex h-screen w-[15%] flex-col justify-between px-4 py-6">
            <div>
                {/* Logo Section */}
                <div className="mb-10 flex flex-col items-start">
                    <div className="flex flex-col items-start justify-center text-2xl font-bold text-white">
                        <span className="text-4xl drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)]">🎓</span>
                        <span>LearnSpace</span>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-2 text-sm text-white">
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
                        disabled={!canNavigateSchoolPages}
                        tooltip="You must be in a school to access this."
                    />
                    <SidebarItem
                        href={route('school.members')}
                        onClick={handleItemClick}
                        icon={<Users size={16} />}
                        text="School members"
                        isActive={activeItem === 'School members'}
                        disabled={!canNavigateSchoolPages}
                        tooltip="You must be in a school to access this."
                    />
                    <SidebarItem
                        href={route('profile.edit')}
                        onClick={handleItemClick}
                        icon={<Settings size={16} />}
                        text="Settings and profile"
                        isActive={activeItem === 'Settings and profile'}
                    />
                    <SidebarItem
                        href={route('schedule.index')}
                        onClick={handleItemClick}
                        icon={<CalendarDays size={16} />}
                        text="Schedule"
                        isActive={activeItem === 'Schedule'}
                        disabled={!canNavigateSchoolPages}
                        tooltip="You must be in a school to access this."
                    />
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
