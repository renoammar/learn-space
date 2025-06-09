import StudentDashboard from '@/MyComponents/StudentDashboard';
import TeacherDashboard from '@/MyComponents/TeacherDashboard';
import { usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import Layout from './Layout';

type School = {
    id: number;
    name: string;
    owner_id: number;
    created_at: string;
    updated_at: string;
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
    school: School | null; // Tambahkan tipe untuk school
};

function Home() {
    const { props } = usePage<PageProps>();
    const user = props.auth?.user;
    const school = props.school; // Ambil data school dari props

    if (!user) {
        return <div className="p-4 text-lg">Login bg 😎</div>;
    }

    return (
        <div className="p-4">
            {user.role === 'student' ? <StudentDashboard studentName={user.name} /> : <TeacherDashboard user={user} school={school} />}
        </div>
    );
}

Home.layout = (page: ReactNode) => <Layout>{page}</Layout>;
export default Home;
