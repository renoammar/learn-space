import { useForm } from '@inertiajs/react';
import { AlertTriangle, Lock, Trash2 } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const [showModal, setShowModal] = useState(false);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setShowModal(false);
        clearErrors();
        reset();
    };

    return (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h2 className="mb-2 text-xl font-semibold text-blue-800">Delete Account</h2>
            <p className="mb-4 text-blue-700">Permanently delete your account and all data. This action is irreversible.</p>

            <div className="mb-4 rounded-lg border border-blue-300 bg-blue-100 p-4">
                <p className="mb-2 font-medium text-blue-800">Warning:</p>
                <p className="mb-2 text-blue-800">Once your account is deleted, all of its resources and data will be permanently removed:</p>
                <ul className="list-inside list-disc space-y-1 text-blue-800">
                    <li>Your profile and settings</li>
                    <li>All your files and content</li>
                    <li>Access to shared workspaces</li>
                </ul>
            </div>

            <button
                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                onClick={() => setShowModal(true)}
            >
                <Trash2 className="h-4 w-4" />
                Delete Account
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                        <div className="mb-4 flex items-start gap-3">
                            <div className="rounded-full bg-blue-100 p-2">
                                <AlertTriangle className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-blue-800">Confirm Deletion</h3>
                                <p className="text-sm text-gray-600">Please enter your password to confirm. This cannot be undone.</p>
                            </div>
                        </div>

                        <form onSubmit={deleteUser}>
                            <div className="mb-4">
                                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        ref={passwordInput}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                    />
                                </div>
                                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || !data.password}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-4 w-4" />
                                            Confirm Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
