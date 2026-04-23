import mongoose, { Document } from 'mongoose';
export declare enum JobType {
    FULL_TIME = "FULL_TIME",
    PART_TIME = "PART_TIME",
    CONTRACT = "CONTRACT",
    INTERNSHIP = "INTERNSHIP"
}
export declare enum JobStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    DRAFT = "DRAFT"
}
export interface IJob extends Document {
    title: string;
    description: string;
    department: string;
    location: string;
    type: JobType;
    requirements: string[];
    salaryRange: {
        min: number;
        max: number;
        currency: string;
    };
    status: JobStatus;
    postedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IJob, {}, {}, {}, mongoose.Document<unknown, {}, IJob, {}, mongoose.DefaultSchemaOptions> & IJob & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IJob>;
export default _default;
//# sourceMappingURL=Job.model.d.ts.map