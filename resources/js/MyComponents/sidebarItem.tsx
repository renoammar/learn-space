import { Link } from '@inertiajs/react';
import { FC } from 'react';

type SidebarItemProps = {
    href?: string;
    icon: React.ReactNode;
    text: string;
    isActive?: boolean;
    onClick: (text: string) => void;
};

const SidebarItem: FC<SidebarItemProps> = ({ href, icon, text, isActive = false, onClick }) => {
    // Handle the click event differently based on whether it's a link or not
    const handleClick = () => {
        onClick(text);
    };

    // If it has an href, wrap in Link component but handle click properly
    if (href) {
        return (
            <Link
                href={href}
                className={`flex cursor-pointer items-center space-x-3 rounded-md px-3 py-2 ${
                    isActive ? 'bg-blue-500 text-white' : 'transition-colors duration-200 hover:bg-blue-500 hover:text-white'
                }`}
                onClick={handleClick}
            >
                {icon}
                <span className="ml-3">{text}</span>
            </Link>
        );
    }

    // If no href, just return the div with onClick
    return (
        <div
            onClick={handleClick}
            className={`flex cursor-pointer items-center space-x-3 rounded-md px-3 py-2 ${
                isActive ? 'bg-blue-500 text-white' : 'transition-colors duration-200 hover:bg-blue-500 hover:text-white'
            }`}
        >
            {icon}
            <span className="ml-3">{text}</span>
        </div>
    );
};

export default SidebarItem;
