import StudentDashboard from '@/MyComponents/StudentDashboard';
import TeacherDashboard from '@/MyComponents/TeacherDashboard';
import { usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import Layout from './Layout';
// Import shared types
import { PageProps } from '@/MyComponents/type';

function Home() {
    const { props } = usePage<PageProps>();
    const user = props.auth?.user;
    const school = props.school;
    const { pendingAssignments, gradedAssignments, upcomingEvents } = props;

    if (!user) {
        return <div className="p-4 text-lg">Login bg 🤩</div>;
    }

    return (
        <div className="p-4">
            {user.role === 'student' ? (
                <StudentDashboard
                    studentName={user.name}
                    school={school}
                    pendingAssignments={pendingAssignments}
                    gradedAssignments={gradedAssignments}
                    upcomingEvents={upcomingEvents}
                />
            ) : (
                <TeacherDashboard user={user} school={school} />
            )}
        </div>
    );
}

Home.layout = (page: ReactNode) => <Layout>{page}</Layout>;

export default Home;
