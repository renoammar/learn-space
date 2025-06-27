// File: resources/js/pages/addStudentToSchool.tsx

import type { SharedData } from '@/types'; // Import the SharedData type
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import Layout from './Layout';

// Define the page's specific props by extending the base SharedData type
interface AddStudentToSchoolPageProps extends SharedData {
    flash?: {
        success?: string;
    };
    // The 'errors' prop is already part of SharedData, but you can be more specific if needed
    errors: {
        email?: string;
    };
}

// The component itself doesn't need to receive props directly
interface InertiaPageComponent extends React.FC {
    layout?: (page: React.ReactNode) => React.ReactNode;
}

const AddStudentToSchool: InertiaPageComponent = () => {
    // Use the correctly typed PageProps with the usePage hook
    const { props } = usePage<AddStudentToSchoolPageProps>();
    const { errors, flash } = props;

    const { data, setData, post, processing, recentlySuccessful, reset } = useForm({
        email: '',
    });

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('schools.addStudent'), {
            onSuccess: () => reset('email'),
        });
    };

    return (
        <>
            <Head title="Add Student" />
            <div className="mx-auto max-w-xl">
                <div className="mb-6">
                    <Link href={route('home')} className="text-sm text-blue-600 hover:underline">
                        &larr; Back to Dashboard
                    </Link>
                </div>
                <div className="rounded-xl bg-white p-6 shadow">
                    <h1 className="mb-2 text-2xl font-bold">Add Student to School</h1>
                    <p className="mb-6 text-sm text-gray-600">
                        Enter the email of a registered student to add them to your school. The student must not already be part of another school.
                    </p>

                    {flash?.success && recentlySuccessful && (
                        <div className="mb-4 rounded-md bg-green-100 p-3 text-sm text-green-700">{flash.success}</div>
                    )}

                    <form onSubmit={handleAddStudent}>
                        <div className="flex items-start space-x-2">
                            <div className="flex-grow">
                                <label htmlFor="email" className="sr-only">
                                    Student's Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="student@example.com"
                                    className="form-input w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                            >
                                {processing ? 'Adding...' : 'Add Student'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

AddStudentToSchool.layout = (page: React.ReactNode) => <Layout>{page}</Layout>;

export default AddStudentToSchool;
