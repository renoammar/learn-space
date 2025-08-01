// types.ts - Create this file in your types directory

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'principal' | 'teacher' | 'student' | 'school_manager';
}

export interface School {
    id: number;
    name: string;
    owner_id: number;
    created_at: string;
    updated_at: string;
}

export interface Assignment {
    id: number;
    title: string;
    due_date: string;
    classroom_id: number;
}

export interface GradedSubmission {
    id: number;
    grade: number;
    assignment: {
        id: number;
        title: string;
    };
}

export interface ScheduleEvent {
    id: number;
    title: string;
    start_date: string;
    type: string;
}

export interface PageProps {
    auth: {
        user: User | null;
    };
    school: School | null;
    pendingAssignments: Assignment[];
    gradedAssignments: GradedSubmission[];
    upcomingEvents: ScheduleEvent[];
    [key: string]: unknown;
}
