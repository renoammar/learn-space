import { Link } from '@inertiajs/react';
import { BookCheck, Calendar, FileClock, School } from 'lucide-react';
import { FC } from 'react';

// Define types based on what the backend will send
interface Assignment {
    id: number;
    title: string;
    due_date: string;
    classroom_id: number;
}

interface GradedSubmission {
    id: number;
    grade: number;
    assignment: {
        id: number;
        title: string;
    };
}

interface ScheduleEvent {
    id: number;
    title: string;
    start_date: string;
    type: string;
}

// Add school to props
interface StudentSchool {
    id: number;
    name: string;
}

interface StudentDashboardProps {
    studentName: string;
    school: StudentSchool | null; // School can be null
    pendingAssignments: Assignment[];
    gradedAssignments: GradedSubmission[];
    upcomingEvents: ScheduleEvent[];
}

const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const StudentDashboard: FC<StudentDashboardProps> = ({
    studentName,
    school,
    pendingAssignments = [],
    gradedAssignments = [],
    upcomingEvents = [],
}) => {
    // Conditional rendering based on whether the student has a school
    if (!school) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 p-8 text-center">
                <School className="h-16 w-16 text-gray-400" />
                <h1 className="text-2xl font-bold text-gray-800">Welcome, {studentName}!</h1>
                <p className="max-w-md text-gray-600">
                    You are not yet enrolled in a school. Please ask your school's principal to add you. Once you are added, you will be able to join
                    classes and see your assignments here.
                </p>
                <p className="text-sm text-gray-500">Waiting to be invited...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {studentName}!</h1>
                <p className="mt-1 text-gray-600">
                    Here's a quick overview of your assignments from <span className="font-semibold">{school.name}</span>.
                </p>
            </div>

            {/* Assignments Section */}
            <section>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Pending Assignments */}
                    <div className="rounded-2xl bg-white p-6 shadow-md">
                        <div className="mb-4 flex items-center gap-3">
                            <FileClock className="h-6 w-6 text-orange-500" />
                            <h3 className="text-xl font-semibold">Assignment Reminders</h3>
                        </div>
                        {pendingAssignments.length > 0 ? (
                            <ul className="space-y-3">
                                {pendingAssignments.map((assignment) => (
                                    <li key={assignment.id} className="rounded-lg bg-gray-50 p-4 transition hover:bg-gray-100">
                                        <Link href={route('assignments.show', assignment.id)} className="block">
                                            <p className="font-semibold text-blue-700">{assignment.title}</p>
                                            <p className="text-sm text-gray-500">Due: {formatDate(assignment.due_date)}</p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">You're all caught up! No pending assignments.</p>
                        )}
                    </div>

                    {/* Graded Assignments */}
                    <div className="rounded-2xl bg-white p-6 shadow-md">
                        <div className="mb-4 flex items-center gap-3">
                            <BookCheck className="h-6 w-6 text-green-500" />
                            <h3 className="text-xl font-semibold">Recently Graded</h3>
                        </div>
                        {gradedAssignments.length > 0 ? (
                            <ul className="space-y-3">
                                {gradedAssignments.map((submission) => (
                                    <li key={submission.id} className="rounded-lg bg-gray-50 p-4 transition hover:bg-gray-100">
                                        <Link
                                            href={route('assignments.show', submission.assignment.id)}
                                            className="flex items-center justify-between"
                                        >
                                            <p className="font-semibold text-blue-700">{submission.assignment.title}</p>
                                            <span className="rounded-md bg-green-100 px-3 py-1 text-lg font-bold text-green-700">
                                                {submission.grade}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">No recently graded assignments.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Schedule Section */}
            <section>
                <div className="rounded-2xl bg-white p-6 shadow-md">
                    <div className="mb-4 flex items-center gap-3">
                        <Calendar className="h-6 w-6 text-indigo-500" />
                        <h3 className="text-xl font-semibold">Upcoming Schedule</h3>
                    </div>
                    {upcomingEvents.length > 0 ? (
                        <ul className="space-y-3">
                            {upcomingEvents.map((event) => (
                                <li key={event.id} className="rounded-lg bg-gray-50 p-4 transition hover:bg-gray-100">
                                    <Link href={route('schedule.index')} className="block">
                                        <p className="font-semibold text-blue-700">{event.title}</p>
                                        <p className="text-sm text-gray-500">Starts: {formatDate(event.start_date)}</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">You have no upcoming events on your schedule.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default StudentDashboard;
