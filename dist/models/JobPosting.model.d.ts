import mongoose, { Document } from 'mongoose';
import { EmploymentType } from './Employee.model';
export declare enum JobStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    DRAFT = "DRAFT"
}
export interface IJobPosting extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    department: string;
    description: string;
    requirements?: Record<string, any>;
    location?: string;
    employmentType: EmploymentType;
    salaryRange?: string;
    status: JobStatus;
    postedBy: mongoose.Types.ObjectId;
    postedAt: Date;
    closedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IJobPosting, {}, {}, {}, mongoose.Document<unknown, {}, IJobPosting, {}, mongoose.DefaultSchemaOptions> & IJobPosting & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IJobPosting>;
export default _default;
//# sourceMappingURL=JobPosting.model.d.ts.map