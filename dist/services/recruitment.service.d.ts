import { JobStatus, ApplicationStatus, EmploymentType } from '../models';
export interface CreateJobPostingData {
    title: string;
    department: string;
    description: string;
    requirements?: any;
    location?: string;
    employmentType: EmploymentType;
    salaryRange?: string;
    postedBy: string;
}
export interface CreateApplicationData {
    jobPostingId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    resumeUrl: string;
    coverLetter?: string;
}
export declare const recruitmentService: {
    createJobPosting: (data: CreateJobPostingData) => Promise<import("../models").IJobPosting & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getJobPostings: (status?: JobStatus) => Promise<(import("../models").IJobPosting & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getJobPostingById: (id: string) => Promise<{
        applications: (import("../models").IJobApplication & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        _id: import("mongoose").Types.ObjectId;
        title: string;
        department: string;
        description: string;
        requirements?: Record<string, any>;
        location?: string;
        employmentType: EmploymentType;
        salaryRange?: string;
        status: JobStatus;
        postedBy: import("mongoose").Types.ObjectId;
        postedAt: Date;
        closedAt?: Date;
        createdAt: Date;
        updatedAt: Date;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    updateJobStatus: (id: string, status: JobStatus) => Promise<import("../models").IJobPosting & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    createApplication: (data: CreateApplicationData) => Promise<(import("../models").IJobApplication & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    getApplications: (jobPostingId?: string, status?: ApplicationStatus) => Promise<(import("../models").IJobApplication & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updateApplicationStatus: (id: string, status: ApplicationStatus, interviewDate?: Date, notes?: string) => Promise<import("../models").IJobApplication & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
};
//# sourceMappingURL=recruitment.service.d.ts.map