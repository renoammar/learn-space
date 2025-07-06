// StudentsClassesPage.tsx
import { router, useForm, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FormEvent, ReactNode, useEffect, useState } from 'react';
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
    errors: Record<string, string>;
    flash?: {
        success_message?: string;
        error_message?: string;
    };
};

function StudentsClassesPage() {
    const { props } = usePage<PageProps>();
    const { classrooms = [], auth, errors: pageErrors, flash } = props;
    const user = auth.user;
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const {
        data: joinData,
        setData: setJoinData,
        post: postJoin,
        processing: processingJoin,
        errors: joinErrors,
        reset: resetJoin,
        wasSuccessful: joinWasSuccessful,
    } = useForm({
        code: '',
    });

    const [successMessage, setSuccessMessage] = useState(flash?.success_message || null);
    const [errorMessage, setErrorMessage] = useState(flash?.error_message || null);

    useEffect(() => {
        setSuccessMessage(flash?.success_message || null);
        setErrorMessage(flash?.error_message || null);
        const timer = setTimeout(() => {
            setSuccessMessage(null);
            setErrorMessage(null);
        }, 5000);
        return () => clearTimeout(timer);
    }, [flash]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('classrooms.store'), {
            onSuccess: () => {
                reset();
                setShowModal(false);
            },
        });
    };

    const handleJoinSubmit = (e: FormEvent) => {
        e.preventDefault();
        postJoin(route('classrooms.join'), {
            onSuccess: () => resetJoin(),
            preserveScroll: true,
        });
    };

    return (
        <div className="p-4">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">My Classes</h1>
                {user?.role !== 'student' && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700"
                    >
                        <Plus size={16} className="mr-2" />
                        Create Class
                    </button>
                )}
            </div>

            {successMessage && <div className="mb-4 rounded-md bg-green-100 p-3 text-green-700">{successMessage}</div>}
            {errorMessage && <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">{errorMessage}</div>}

            {user?.role === 'student' && (
                <div className="mb-8 rounded-lg border bg-white p-6 shadow-md">
                    <h2 className="text-xl font-semibold">Join a new class</h2>
                    <p className="mt-1 mb-4 text-sm text-gray-600">Enter the class code provided by your teacher.</p>
                    <form onSubmit={handleJoinSubmit} className="flex items-start gap-2">
                        <div className="flex-grow">
                            <input
                                type="text"
                                id="code"
                                value={joinData.code}
                                onChange={(e) => setJoinData('code', e.target.value.toUpperCase())}
                                className="form-input w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="Enter 6-character class code"
                                maxLength={6}
                                required
                            />
                            {joinErrors.code && <div className="mt-1 text-sm text-red-600">{joinErrors.code}</div>}
                            {pageErrors.code && <div className="mt-1 text-sm text-red-600">{pageErrors.code}</div>}
                        </div>
                        <button
                            type="submit"
                            disabled={processingJoin}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processingJoin ? 'Joining...' : 'Join'}
                        </button>
                    </form>
                </div>
            )}

            {classrooms.length === 0 ? (
                <div className="rounded-lg bg-white p-6 text-center shadow-md">
                    <p className="text-gray-600">You are not enrolled in any classes yet. Join a class to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {classrooms.map((classroom) => (
                        <div key={classroom.id} className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                            <h2 className="text-xl font-semibold">{classroom.name}</h2>
                            <p className="mt-2 text-sm text-gray-600">Code: {classroom.code}</p>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => router.visit(route('classrooms.manage', { id: classroom.id }))}
                                    className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200"
                                >
                                    Manage
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && user?.role !== 'student' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-lg">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <h2 className="mb-4 text-xl font-semibold">Create New Class</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                                    Class Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                                    placeholder="e.g., Grade 10 - Mathematics"
                                />
                                {errors.name && <div className="mt-1 text-sm text-red-600">{errors.name}</div>}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        reset();
                                        setShowModal(false);
                                    }}
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-75"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

StudentsClassesPage.layout = (page: ReactNode) => <Layout>{page}</Layout>;

export default StudentsClassesPage;
