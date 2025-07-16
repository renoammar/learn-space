import { useForm } from '@inertiajs/react';
import React from 'react';

interface Classroom {
    id: number;
    name: string;
}

interface CreateScheduleEventModalProps {
    onClose: () => void;
    classrooms: Classroom[];
}

const CreateScheduleEventModal: React.FC<CreateScheduleEventModalProps> = ({ onClose, classrooms }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        type: 'event',
        start_date: '',
        end_date: '',
        scope: 'school',
        classroom_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('schedule.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-xl font-semibold text-[#152259]">Create New Schedule Event</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="form-input w-full"
                            required
                        />
                        {errors.title && <div className="mt-1 text-xs text-red-600">{errors.title}</div>}
                    </div>

                    <div>
                        <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                            className="form-textarea w-full"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="type" className="mb-1 block text-sm font-medium text-gray-700">
                                Type
                            </label>
                            <select id="type" value={data.type} onChange={(e) => setData('type', e.target.value)} className="form-select w-full">
                                <option value="event">General Event</option>
                                <option value="exam">Exam</option>
                                <option value="deadline">Deadline</option>
                                <option value="holiday">Holiday</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="scope" className="mb-1 block text-sm font-medium text-gray-700">
                                Scope
                            </label>
                            <select id="scope" value={data.scope} onChange={(e) => setData('scope', e.target.value)} className="form-select w-full">
                                <option value="school">Entire School</option>
                                {classrooms.length > 0 && <option value="classroom">Specific Classroom</option>}
                            </select>
                        </div>
                    </div>

                    {data.scope === 'classroom' && (
                        <div>
                            <label htmlFor="classroom_id" className="mb-1 block text-sm font-medium text-gray-700">
                                Classroom
                            </label>
                            <select
                                id="classroom_id"
                                value={data.classroom_id}
                                onChange={(e) => setData('classroom_id', e.target.value)}
                                className="form-select w-full"
                                required
                            >
                                <option value="">Select a classroom...</option>
                                {classrooms.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            {errors.classroom_id && <div className="mt-1 text-xs text-red-600">{errors.classroom_id}</div>}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="start_date" className="mb-1 block text-sm font-medium text-gray-700">
                                Start Date
                            </label>
                            <input
                                id="start_date"
                                type="datetime-local"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                className="form-input w-full"
                                required
                            />
                            {errors.start_date && <div className="mt-1 text-xs text-red-600">{errors.start_date}</div>}
                        </div>
                        <div>
                            <label htmlFor="end_date" className="mb-1 block text-sm font-medium text-gray-700">
                                End Date (Optional)
                            </label>
                            <input
                                id="end_date"
                                type="datetime-local"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                                className="form-input w-full"
                            />
                            {errors.end_date && <div className="mt-1 text-xs text-red-600">{errors.end_date}</div>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" disabled={processing} className="btn-primary">
                            {processing ? 'Creating...' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateScheduleEventModal;
