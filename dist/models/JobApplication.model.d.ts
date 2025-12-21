import mongoose, { Document } from 'mongoose';
export declare enum ApplicationStatus {
    PENDING = "PENDING",
    SHORTLISTED = "SHORTLISTED",
    INTERVIEWED = "INTERVIEWED",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED"
}
export interface IJobApplication extends Document {
    _id: mongoose.Types.ObjectId;
    jobPostingId: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    resumeUrl: string;
    coverLetter?: string;
    status: ApplicationStatus;
    interviewDate?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IJobApplication, {}, {}, {}, mongoose.Document<unknown, {}, IJobApplication, {}, mongoose.DefaultSchemaOptions> & IJobApplication & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IJobApplication>;
export default _default;
//# sourceMappingURL=JobApplication.model.d.ts.map