import { useForm } from '@inertiajs/react';
import React from 'react';

interface CreateAssignmentModalProps {
    classroomId: number;
    onClose: () => void;
}

const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({ classroomId, onClose }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        due_date: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('assignments.store', { classroom: classroomId }), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-lg">
            <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-xl">
                <h2 className="mb-4 text-xl font-semibold text-[#152259]">Create New Assignment</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="mb-2 block text-sm font-medium text-[#152259]">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded-lg border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-600 focus:ring-blue-600 focus:outline-none"
                            required
                        />
                        {errors.title && <div className="mt-1 text-sm text-red-600">{errors.title}</div>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="mb-2 block text-sm font-medium text-[#152259]">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={4}
                            className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-600 focus:ring-blue-600"
                        />
                        {errors.description && <div className="mt-1 text-sm text-red-600">{errors.description}</div>}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="due_date" className="mb-2 block text-sm font-medium text-[#152259]">
                            Due Date
                        </label>
                        <input
                            id="due_date"
                            type="date"
                            value={data.due_date}
                            onChange={(e) => setData('due_date', e.target.value)}
                            className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-600 focus:ring-blue-600"
                        />
                        {errors.due_date && <div className="mt-1 text-sm text-red-600">{errors.due_date}</div>}
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-[#152259] hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-75"
                        >
                            {processing ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAssignmentModal;
