// StudentsClassesPage.tsx
import { router, useForm, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { ReactNode, useState } from 'react';
import Layout from './Layout';

type Classroom = {
    id: number;
    name: string;
    code: string;
};

type School = {
    id: number;
    name: string;
    owner_id: number;
    created_at: string;
    updated_at: string;
};

type PageProps = {
    classrooms: Classroom[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        } | null;
    };
    school: School | null;
};

function StudentsClassesPage() {
    const { props } = usePage<PageProps>();
    const { classrooms = [], school } = props;
    const [showModal, setShowModal] = useState(false);

    // Debug log is correctly placed inside the component
    console.log('Props:', props);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('classrooms.store'), {
            onSuccess: () => {
                reset();
                setShowModal(false);
            },
        });
    };

    return (
        <div className="p-4">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Kelas Siswa</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700"
                >
                    <Plus size={16} className="mr-2" />
                    Tambah Kelas
                </button>
            </div>

            {classrooms.length === 0 ? (
                <div className="rounded-lg bg-white p-6 text-center shadow-md">
                    <p className="text-gray-600">Belum ada kelas. Buat kelas baru untuk memulai.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {classrooms.map((classroom) => (
                        <div key={classroom.id} className="rounded-lg bg-white p-6 shadow-md">
                            <h2 className="text-xl font-semibold">{classroom.name}</h2>
                            <p className="mt-2 text-sm text-gray-600">Kode: {classroom.code}</p>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => router.visit(route('classrooms.manage', { id: classroom.id }))}
                                    className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-600 hover:bg-blue-200"
                                >
                                    Kelola
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Tambah Kelas */}
            {showModal && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <h2 className="mb-4 text-xl font-semibold">Tambah Kelas Baru</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                                    Nama Kelas
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                                    placeholder="Contoh: Kelas 10A - Matematika"
                                />
                                {errors.name && <div className="mt-1 text-sm text-red-600">{errors.name}</div>}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-75"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Define layout for this page
StudentsClassesPage.layout = (page: ReactNode) => <Layout>{page}</Layout>;

export default StudentsClassesPage;
