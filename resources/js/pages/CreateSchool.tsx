import { router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

import GradientBackground from '@/MyComponents/GradientBackground';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head } from '@inertiajs/react';

export default function SchoolCreate() {
    const [name, setName] = useState('');
    const [errors, setErrors] = useState<{ name?: string }>({});

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrors({});

        router.post(
            '/schools',
            { name },
            {
                onError: (err) => setErrors(err),
            },
        );
    };

    return (
        <>
            <Head title="Buat Sekolah" />
            <GradientBackground>
                <div className="flex min-h-screen w-full items-center justify-center px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-8 text-gray-800 shadow-lg">
                        <h1 className="mb-2 text-center text-2xl font-bold">Buat Sekolah Baru</h1>
                        <p className="text-muted-foreground mb-6 text-center text-sm">Masukkan nama sekolah yang ingin didaftarkan.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama Sekolah</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Contoh: SMAN 1 Jakarta"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <Button type="submit" className="mt-2 w-full bg-[#00AEEF] text-white hover:bg-[#008ecc]">
                                Simpan Sekolah
                            </Button>
                        </form>
                    </div>
                </div>
            </GradientBackground>
        </>
    );
}
