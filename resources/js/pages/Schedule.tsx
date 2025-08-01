import { Head, usePage } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';
import React, { useState } from 'react';
import CreateScheduleEventModal from '../MyComponents/CreateScheduleEventModal';
import Layout from './Layout';

// --- Type Definitions ---
interface User {
    id: number;
    name: string;
}

interface Classroom {
    id: number;
    name: string;
}

interface ScheduleEvent {
    id: number;
    title: string;
    description: string | null;
    type: string;
    start_date: string;
    end_date: string | null;
    user: User;
    classroom: Classroom | null;
}

interface PageProps {
    events: ScheduleEvent[];
    classrooms: Classroom[];
    isTeacherOrPrincipal: boolean;
    flash?: { success_message?: string };
    [key: string]: any; // Index signature for Inertia.js compatibility
}

const EventTypePill: React.FC<{ type: string }> = ({ type }) => {
    const typeStyles: Record<string, string> = {
        exam: 'bg-red-100 text-red-800',
        holiday: 'bg-green-100 text-green-800',
        deadline: 'bg-yellow-100 text-yellow-800',
        event: 'bg-blue-100 text-blue-800',
    };

    return <span className={`rounded-full px-3 py-1 text-xs font-medium uppercase ${typeStyles[type] || 'bg-gray-100 text-gray-800'}`}>{type}</span>;
};

const SchedulePage: React.FC & { layout?: (page: React.ReactNode) => React.ReactNode } = () => {
    const { props } = usePage<PageProps>();
    const { events, classrooms, isTeacherOrPrincipal, flash } = props;
    const [showCreateModal, setShowCreateModal] = useState(false);
    const canCreateEvents = isTeacherOrPrincipal || props.auth.user.role === 'school_manager';

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString([], {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    const formatDay = (dateString: string) => {
        return new Date(dateString).toLocaleDateString([], {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
    };

    const groupedEvents = events.reduce<Record<string, ScheduleEvent[]>>((acc, event) => {
        const day = new Date(event.start_date).toDateString();
        if (!acc[day]) {
            acc[day] = [];
        }
        acc[day].push(event);
        return acc;
    }, {});

    // Sort the grouped events by date
    const sortedGroupedEvents = Object.entries(groupedEvents).sort(([a], [b]) => {
        return new Date(a).getTime() - new Date(b).getTime();
    });

    return (
        <>
            <Head title="School Schedule" />
            <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
                {/* Flash message display */}
                {flash?.success_message && (
                    <div className="mb-4 rounded-md bg-green-50 p-4">
                        <div className="text-sm text-green-800">{flash.success_message}</div>
                    </div>
                )}

                <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">School Schedule</h1>
                        <p className="mt-1 text-sm text-gray-500">Upcoming events, exams, deadlines, and holidays.</p>
                    </div>
                    {canCreateEvents && (
                        <button onClick={() => setShowCreateModal(true)} className="btn-primary inline-flex items-center gap-2">
                            <PlusCircle size={18} />
                            Create Event
                        </button>
                    )}
                </div>

                <div className="mt-8 space-y-8">
                    {sortedGroupedEvents.length > 0 ? (
                        sortedGroupedEvents.map(([day, dayEvents]) => (
                            <div key={day}>
                                <h2 className="text-lg font-semibold text-gray-700">{formatDay(day)}</h2>
                                <ul className="mt-3 space-y-3">
                                    {dayEvents
                                        .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
                                        .map((event) => (
                                            <li
                                                key={event.id}
                                                className="overflow-hidden rounded-lg bg-white p-4 shadow-sm transition hover:shadow-md"
                                            >
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="flex-grow">
                                                        <div className="flex items-center gap-3">
                                                            <EventTypePill type={event.type} />
                                                            <h3 className="font-semibold text-gray-800">{event.title}</h3>
                                                        </div>
                                                        {event.description && <p className="mt-2 text-sm text-gray-600">{event.description}</p>}
                                                    </div>
                                                    <div className="flex-shrink-0 text-left sm:text-right">
                                                        <p className="text-sm font-medium text-gray-700">{formatDate(event.start_date)}</p>
                                                        {event.classroom && <p className="text-xs text-gray-500">For: {event.classroom.name}</p>}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <div className="mt-10 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                            <h3 className="text-lg font-medium text-gray-900">No upcoming events</h3>
                            <p className="mt-1 text-sm text-gray-500">Check back later or create a new event to get started.</p>
                        </div>
                    )}
                </div>
            </div>

            {showCreateModal && <CreateScheduleEventModal onClose={() => setShowCreateModal(false)} classrooms={classrooms} />}
        </>
    );
};

// Type the layout function properly
SchedulePage.layout = (page: React.ReactNode) => <Layout>{page}</Layout>;

export default SchedulePage;
