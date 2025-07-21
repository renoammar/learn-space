import { Link } from '@inertiajs/react';
import { FC, MouseEvent, ReactNode } from 'react';

type SidebarItemProps = {
    href?: string;
    icon: ReactNode;
    text: string;
    isActive?: boolean;
    onClick: (text: string) => void;
    disabled?: boolean;
    tooltip?: string;
};

const SidebarItem: FC<SidebarItemProps> = ({ href, icon, text, isActive = false, onClick, disabled = false, tooltip }) => {
    // Use a broader type compatible with both <Link> and <div>
    const handleClick = (e: MouseEvent<Element>) => {
        if (disabled) {
            e.preventDefault();
            return;
        }
        onClick(text);
    };

    const baseClasses = 'relative flex items-center space-x-3 rounded-md px-3 py-2 group';
    const activeClasses = isActive ? 'bg-blue-500 text-white' : 'transition-colors duration-200 hover:bg-blue-500 hover:text-white';
    const disabledClasses = 'cursor-not-allowed opacity-50';
    const finalClasses = `${baseClasses} ${disabled ? disabledClasses : activeClasses}`;

    const itemContent = (
        <>
            {icon}
            <span className="ml-3">{text}</span>
            {disabled && tooltip && (
                <span className="absolute left-full z-50 ml-2 w-max rounded-md bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {tooltip}
                </span>
            )}
        </>
    );

    if (href && !disabled) {
        return (
            <Link href={href} className={finalClasses} onClick={handleClick}>
                {itemContent}
            </Link>
        );
    }

    return (
        <div className={finalClasses} onClick={handleClick} role="button" tabIndex={0}>
            {itemContent}
        </div>
    );
};

export default SidebarItem;
