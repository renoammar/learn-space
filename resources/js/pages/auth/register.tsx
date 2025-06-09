import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'teacher',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Create School Account" />
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-semibold text-gray-800">Welcome, create your school account</h2>
                        <p className="mt-2 text-sm text-gray-500">It is our great pleasure to have you on board!</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <Input
                                type="text"
                                id="name"
                                placeholder="Enter the name of admin"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                required
                            />
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        {/* Email */}
                        <div>
                            <Input
                                type="email"
                                id="email"
                                placeholder="Enter the school email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                required
                            />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        {/* Password */}
                        <div>
                            <Input
                                type="password"
                                id="password"
                                placeholder="Enter password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                required
                            />
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <Input
                                type="password"
                                id="password_confirmation"
                                placeholder="Confirm password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-1" />
                        </div>

                        {/* Role Select */}
                        <div>
                            <select
                                id="role"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                disabled={processing}
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            >
                                {/* tambahkan tanda buka tutup kurung  */}
                                <option value="principal">Kepala Sekolah</option>
                                <option value="teacher">Guru</option>
                                <option value="student">Murid</option>
                            </select>
                            <InputError message={errors.role} className="mt-1" />
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="mt-2 w-full bg-blue-600 text-white" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Next
                        </Button>

                        {/* Login Link */}
                        <div className="mt-4 text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <TextLink href={route('login')} className="text-blue-600">
                                login
                            </TextLink>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
