import { FC } from 'react';

interface StudentDashboardProps {
    studentName: string;
}

const StudentDashboard: FC<StudentDashboardProps> = ({ studentName }) => {
    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold">Selamat datang, {studentName}!</h1>

            {/* Upcoming Classes */}
            <section className="rounded-2xl bg-white p-4 shadow-md">
                <h2 className="mb-2 text-xl font-semibold">Kelas Mendatang</h2>
                <ul className="list-disc pl-6 text-sm text-gray-700">
                    <li>Matematika - Senin, 09:00 WIB</li>
                    <li>Fisika - Selasa, 10:30 WIB</li>
                </ul>
            </section>

            {/* Assignments */}
            <section className="rounded-2xl bg-white p-4 shadow-md">
                <h2 className="mb-2 text-xl font-semibold">Tugas yang Harus Dikerjakan</h2>
                <ul className="list-disc pl-6 text-sm text-gray-700">
                    <li>Essay Sejarah - Deadline 25 April</li>
                    <li>Latihan Soal Kimia - Deadline 27 April</li>
                </ul>
            </section>

            {/* Grades */}
            <section className="rounded-2xl bg-white p-4 shadow-md">
                <h2 className="mb-2 text-xl font-semibold">Nilai Terbaru</h2>
                <div className="text-sm text-gray-700">
                    <p>Matematika: 85</p>
                    <p>Bahasa Inggris: 92</p>
                </div>
            </section>

            {/* Upcoming Exams */}
            <section className="rounded-2xl bg-white p-4 shadow-md">
                <h2 className="mb-2 text-xl font-semibold">Ujian Mendatang</h2>
                <ul className="list-disc pl-6 text-sm text-gray-700">
                    <li>Biologi - 29 April 2025</li>
                    <li>Geografi - 30 April 2025</li>
                </ul>
            </section>

            {/* Announcements */}
            <section className="rounded-2xl bg-white p-4 shadow-md">
                <h2 className="mb-2 text-xl font-semibold">Pengumuman</h2>
                <p className="text-sm text-gray-700">Libur Nasional: 1 Mei 2025</p>
            </section>
        </div>
    );
};

export default StudentDashboard;
