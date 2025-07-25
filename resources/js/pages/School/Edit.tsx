import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { FormEvent, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/pages/Layout';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface School {
    id: number;
    name: string;
}

interface PageProps {
    school: School;
    flash?: {
        success_message?: string;
    };
    errors: Record<string, string>;
    [key: string]: unknown;
}

const EditSchoolPage: React.FC & { layout?: (page: React.ReactNode) => React.ReactNode } = () => {
    const { props } = usePage<PageProps>();
    const { school, flash } = props;

    // Form for updating the school name
    const { data, setData, put, processing, recentlySuccessful, errors } = useForm({
        name: school.name,
    });

    // Form for deleting the school
    const deleteForm = useForm({
        password: '',
    });
    const passwordInput = useRef<HTMLInputElement>(null);
    const [confirmingSchoolDeletion, setConfirmingSchoolDeletion] = useState(false);

    const updateSchoolName = (e: FormEvent) => {
        e.preventDefault();
        put(route('school.update'), {
            preserveScroll: true,
        });
    };

    const deleteSchool = (e: FormEvent) => {
        e.preventDefault();
        deleteForm.delete(route('school.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => deleteForm.reset(),
        });
    };

    const closeModal = () => {
        setConfirmingSchoolDeletion(false);
        deleteForm.reset();
    };

    return (
        <>
            <Head title={`Edit ${school.name}`} />
            <div className="mx-auto max-w-2xl space-y-8">
                <div className="mb-6">
                    <Link href={route('home')} className="text-sm text-blue-600 hover:underline">
                        &larr; Back to Dashboard
                    </Link>
                </div>

                {flash?.success_message && recentlySuccessful && (
                    <div className="mb-6 flex items-center gap-3 rounded-md border border-green-300 bg-green-50 p-4 text-green-700">
                        <CheckCircle size={20} /> <span>{flash.success_message}</span>
                    </div>
                )}

                {/* Edit School Name Card */}
                <div className="rounded-xl bg-white p-6 shadow">
                    <h2 className="text-xl font-bold">School Information</h2>
                    <p className="mb-6 text-sm text-gray-600">Update your school's name.</p>
                    <form onSubmit={updateSchoolName}>
                        <div>
                            <Label htmlFor="name">School Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div className="mt-4 flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save'}
                            </Button>
                            {recentlySuccessful && <p className="text-sm text-gray-600">Saved.</p>}
                        </div>
                    </form>
                </div>

                {/* Delete School Card */}
                <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 shadow">
                    <h2 className="text-xl font-bold text-red-800">Danger Zone</h2>
                    <p className="mb-4 text-sm text-red-700">
                        Deleting your school is a permanent action. All classrooms, assignments, and member associations will be removed. This cannot
                        be undone.
                    </p>

                    <Dialog open={confirmingSchoolDeletion} onOpenChange={setConfirmingSchoolDeletion}>
                        <DialogTrigger asChild>
                            <Button variant="destructive" className="text-red-900">
                                Delete School
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <AlertTriangle className="text-red-500" /> Are you absolutely sure?
                                </DialogTitle>
                                <DialogDescription className="pt-2">
                                    This action cannot be undone. This will permanently delete your school and all associated data. To confirm, please
                                    enter your password.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={deleteSchool}>
                                <div className="mt-4">
                                    <Label htmlFor="password" className="sr-only">
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        ref={passwordInput}
                                        value={deleteForm.data.password}
                                        onChange={(e) => deleteForm.setData('password', e.target.value)}
                                        placeholder="Password"
                                        autoComplete="current-password"
                                        autoFocus
                                    />
                                    <InputError message={deleteForm.errors.password} className="mt-2" />
                                </div>
                                <DialogFooter className="mt-6">
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary" onClick={closeModal}>
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" variant="destructive" disabled={deleteForm.processing}>
                                        {deleteForm.processing ? 'Deleting...' : 'Delete School'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </>
    );
};

EditSchoolPage.layout = (page: React.ReactNode) => <Layout>{page}</Layout>;

export default EditSchoolPage;
