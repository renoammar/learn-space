import { router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

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
        <div className="mx-auto mt-10 max-w-xl rounded-2xl bg-white p-6 shadow">
            <h1 className="mb-4 text-2xl font-bold">Buat Sekolah Baru</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nama Sekolah
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <button type="submit" className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700">
                    Simpan Sekolah
                </button>
            </form>
        </div>
    );
}
