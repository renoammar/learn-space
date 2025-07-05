import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import Layout from './Layout';

// interface AddTeacherToSchoolProps {
//     // Add any props you might receive from the backend
// }
type AddTeacherToSchoolProps = Record<string, never>;
// Define the component type with layout property
interface InertiaPageComponent extends React.FC<AddTeacherToSchoolProps> {
    layout?: (page: React.ReactNode) => React.ReactNode;
}

const AddTeacherToSchool: InertiaPageComponent = () => {
    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm({
        email: '',
    });

    const handleAddTeacher = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('schools.addTeacher'), {
            onSuccess: () => reset('email'),
        });
    };

    return (
        <>
            <Head title="Add Teacher" />
            <div className="mx-auto max-w-xl">
                <div className="mb-6">
                    <Link href={route('home')} className="text-sm text-blue-600 hover:underline">
                        &larr; Back to Dashboard
                    </Link>
                </div>
                <div className="rounded-xl bg-white p-6 shadow">
                    <h1 className="mb-2 text-2xl font-bold">Add Teacher to School</h1>
                    <p className="mb-6 text-sm text-gray-600">
                        Enter the email of a registered teacher to add them to your school. The teacher must not already be part of another school.
                    </p>
                    <form onSubmit={handleAddTeacher}>
                        <div className="flex items-start space-x-2">
                            <div className="flex-grow">
                                <label htmlFor="email" className="sr-only">
                                    Teacher's Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="teacher@example.com"
                                    className="form-input w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                                {recentlySuccessful && (
                                    <p className="mt-1 text-sm text-green-500">Teacher added successfully! You can add another one.</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                            >
                                {processing ? 'Adding...' : 'Add Teacher'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

// Apply the main layout to this page
AddTeacherToSchool.layout = (page: React.ReactNode) => <Layout>{page}</Layout>;

export default AddTeacherToSchool;
