import type { SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { KeyRound, Mail, User } from 'lucide-react';
import { FormEventHandler, useRef } from 'react';

import DeleteUser from '@/MyComponents/DeleteUser';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/pages/Layout';

type ProfileForm = {
    name: string;
    email: string;
};

const ProfileSettingsPage: React.FC<{ mustVerifyEmail: boolean; status?: string }> & { layout?: (page: React.ReactNode) => React.ReactNode } = ({
    mustVerifyEmail,
    status,
}) => {
    const { auth } = usePage<SharedData>().props;
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    // Form for Profile Information
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
    });

    // Form for Password Update
    const {
        data: passwordData,
        setData: setPasswordData,
        put: updatePassword,
        errors: passwordErrors,
        processing: passwordProcessing,
        recentlySuccessful: passwordRecentlySuccessful,
        reset: resetPassword,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitProfile: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    const submitPassword: FormEventHandler = (e) => {
        e.preventDefault();
        updatePassword(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => resetPassword(),
            onError: (errors) => {
                if (errors.password) {
                    resetPassword('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    resetPassword('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <>
            <Head title="Profile & Password Settings" />
            <div className="mx-auto max-w-2xl space-y-8 p-6">
                {/* Header Section */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
                    <p className="text-gray-600">Manage your account information, password, and preferences.</p>
                </div>

                {/* Main Content */}
                <div className="space-y-8">
                    {/* Profile Information Card */}
                    <div className="flex items-stretch justify-around gap-6">
                        <Card className="flex flex-1 flex-col border-0 shadow-lg">
                            <CardHeader className="pb-6">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-blue-100 p-2">
                                        <User className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Profile Information</CardTitle>
                                        <CardDescription>Update your account's profile information.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submitProfile} className="space-y-6">
                                    {/* Form fields remain the same */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                                className="pl-10"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>

                                    {mustVerifyEmail && auth.user.email_verified_at === null && (
                                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                            {/* ... email verification notice ... */}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 border-t pt-4">
                                        <Button disabled={processing} className="min-w-[100px] bg-green-600 text-white">
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-green-600">Saved.</p>
                                        </Transition>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Change Password Card */}
                        <Card className="flex flex-1 flex-col border-0 shadow-lg">
                            <CardHeader className="pb-6">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-slate-100 p-2">
                                        <KeyRound className="h-5 w-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Change Password</CardTitle>
                                        <CardDescription>Ensure your account is using a long, random password.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submitPassword} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="current_password">Current Password</Label>
                                        <Input
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            value={passwordData.current_password}
                                            onChange={(e) => setPasswordData('current_password', e.target.value)}
                                            type="password"
                                            autoComplete="current-password"
                                        />
                                        <InputError message={passwordErrors.current_password} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">New Password</Label>
                                        <Input
                                            id="password"
                                            ref={passwordInput}
                                            value={passwordData.password}
                                            onChange={(e) => setPasswordData('password', e.target.value)}
                                            type="password"
                                            autoComplete="new-password"
                                        />
                                        <InputError message={passwordErrors.password} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                        <Input
                                            id="password_confirmation"
                                            value={passwordData.password_confirmation}
                                            onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                            type="password"
                                            autoComplete="new-password"
                                        />
                                        <InputError message={passwordErrors.password_confirmation} />
                                    </div>

                                    <div className="flex items-center gap-4 border-t pt-4">
                                        <Button disabled={passwordProcessing} className="min-w-[140px] bg-green-600 text-white">
                                            {passwordProcessing ? 'Saving...' : 'Change Password'}
                                        </Button>
                                        <Transition
                                            show={passwordRecentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-green-600">Password Updated.</p>
                                        </Transition>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Delete Account Section */}
                    <DeleteUser />
                </div>
            </div>
        </>
    );
};

// Apply the main layout
ProfileSettingsPage.layout = (page: React.ReactNode) => <Layout>{page}</Layout>;

export default ProfileSettingsPage;
