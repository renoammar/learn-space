import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import GradientBackground from '@/MyComponents/GradientBackground';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot password" />
            <GradientBackground>
                <div className="flex min-h-screen w-full items-center justify-center px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-8 text-gray-800 shadow-lg">
                        <h2 className="mb-2 text-center text-2xl font-bold">Forgot your password?</h2>
                        <p className="text-muted-foreground mb-6 text-center text-sm">
                            Enter your email address and we’ll send you a link to reset your password.
                        </p>

                        {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    value={data.email}
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <Button className="mt-2 w-full bg-[#00AEEF] text-white hover:bg-[#008ecc]" disabled={processing}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Email password reset link
                            </Button>
                        </form>

                        <div className="text-muted-foreground mt-6 text-center text-sm">
                            Or, return to{' '}
                            <TextLink href={route('login')} tabIndex={5}>
                                Log in
                            </TextLink>
                        </div>
                    </div>
                </div>
            </GradientBackground>
        </>
    );
}
