import { useForm } from '@inertiajs/react';
import { AlertTriangle, Calendar, Clock, MapPin, X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

interface Classroom {
    id: number;
    name: string;
}

interface CreateScheduleEventModalProps {
    onClose: () => void;
    classrooms: Classroom[];
}

const CreateScheduleEventModal: React.FC<CreateScheduleEventModalProps> = ({ onClose, classrooms }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        type: 'event',
        start_date: '',
        end_date: '',
        scope: 'school',
        classroom_id: '',
    });

    // Handle escape key and click outside
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.addEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('schedule.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'exam':
                return '📝';
            case 'deadline':
                return '⏰';
            case 'holiday':
                return '🎉';
            default:
                return '📅';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'exam':
                return 'bg-red-50 border-red-200 text-red-700';
            case 'deadline':
                return 'bg-orange-50 border-orange-200 text-orange-700';
            case 'holiday':
                return 'bg-green-50 border-green-200 text-green-700';
            default:
                return 'bg-blue-50 border-blue-200 text-blue-700';
        }
    };

    return (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm duration-200">
            <div
                ref={modalRef}
                className="animate-in zoom-in-95 mx-4 w-full max-w-2xl rounded-2xl border border-gray-100 bg-white shadow-2xl duration-200"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#152259]/10">
                            <Calendar className="h-5 w-5 text-[#152259]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-[#152259]">Create New Schedule Event</h2>
                            <p className="text-sm text-gray-500">Add an event to the school calendar</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
                        aria-label="Close modal"
                    >
                        <X className="h-4 w-4 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6 p-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                            Event Title *
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-[#152259] focus:ring-2 focus:ring-[#152259]/20 ${
                                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200'
                            }`}
                            placeholder="Enter event title..."
                            required
                        />
                        {errors.title && (
                            <div className="flex items-center gap-2 text-sm text-red-600">
                                <AlertTriangle className="h-4 w-4" />
                                {errors.title}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                            className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 transition-colors focus:border-[#152259] focus:ring-2 focus:ring-[#152259]/20"
                            placeholder="Add event details..."
                        />
                    </div>

                    {/* Type and Scope Row */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="type" className="block text-sm font-medium text-gray-900">
                                Event Type
                            </label>
                            <div className="relative">
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 transition-colors focus:border-[#152259] focus:ring-2 focus:ring-[#152259]/20"
                                >
                                    <option value="event">📅 General Event</option>
                                    <option value="exam">📝 Exam</option>
                                    <option value="deadline">⏰ Deadline</option>
                                    <option value="holiday">🎉 Holiday</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {/* Type preview */}
                            <div
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${getTypeColor(data.type)}`}
                            >
                                <span>{getTypeIcon(data.type)}</span>
                                {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="scope" className="block text-sm font-medium text-gray-900">
                                Event Scope
                            </label>
                            <div className="relative">
                                <select
                                    id="scope"
                                    value={data.scope}
                                    onChange={(e) => setData('scope', e.target.value)}
                                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 transition-colors focus:border-[#152259] focus:ring-2 focus:ring-[#152259]/20"
                                >
                                    <option value="school">🏫 Entire School</option>
                                    {classrooms.length > 0 && <option value="classroom">🏛️ Specific Classroom</option>}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Classroom Selection (conditional) */}
                    {data.scope === 'classroom' && (
                        <div className="animate-in slide-in-from-top-2 space-y-2 duration-200">
                            <label htmlFor="classroom_id" className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                <MapPin className="h-4 w-4" />
                                Select Classroom *
                            </label>
                            <div className="relative">
                                <select
                                    id="classroom_id"
                                    value={data.classroom_id}
                                    onChange={(e) => setData('classroom_id', e.target.value)}
                                    className={`w-full appearance-none rounded-lg border bg-white px-4 py-3 transition-colors focus:border-[#152259] focus:ring-2 focus:ring-[#152259]/20 ${
                                        errors.classroom_id ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                    }`}
                                    required
                                >
                                    <option value="">Choose a classroom...</option>
                                    {classrooms.map((classroom) => (
                                        <option key={classroom.id} value={classroom.id}>
                                            {classroom.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {errors.classroom_id && (
                                <div className="flex items-center gap-2 text-sm text-red-600">
                                    <AlertTriangle className="h-4 w-4" />
                                    {errors.classroom_id}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Date Range */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="start_date" className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                <Clock className="h-4 w-4" />
                                Start Date & Time *
                            </label>
                            <input
                                id="start_date"
                                type="datetime-local"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-[#152259] focus:ring-2 focus:ring-[#152259]/20 ${
                                    errors.start_date ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                }`}
                                required
                            />
                            {errors.start_date && (
                                <div className="flex items-center gap-2 text-sm text-red-600">
                                    <AlertTriangle className="h-4 w-4" />
                                    {errors.start_date}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="end_date" className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                <Clock className="h-4 w-4" />
                                End Date & Time
                                <span className="text-xs font-normal text-gray-400">(Optional)</span>
                            </label>
                            <input
                                id="end_date"
                                type="datetime-local"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                                className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-[#152259] focus:ring-2 focus:ring-[#152259]/20 ${
                                    errors.end_date ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                }`}
                                min={data.start_date} // Prevent end date before start date
                            />
                            {errors.end_date && (
                                <div className="flex items-center gap-2 text-sm text-red-600">
                                    <AlertTriangle className="h-4 w-4" />
                                    {errors.end_date}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-gray-200 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 sm:flex-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#152259] px-6 py-3 font-medium text-white transition-colors hover:bg-[#152259]/90 focus:ring-2 focus:ring-[#152259]/20 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                        >
                            {processing ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Calendar className="h-4 w-4" />
                                    Create Event
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateScheduleEventModal;
