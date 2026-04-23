import mongoose, { Document } from 'mongoose';
export declare enum CandidateStatus {
    APPLIED = "APPLIED",
    SCREENING = "SCREENING",
    INTERVIEW = "INTERVIEW",
    OFFER = "OFFER",
    HIRED = "HIRED",
    REJECTED = "REJECTED"
}
export interface INote {
    text: string;
    author: mongoose.Types.ObjectId;
    date: Date;
}
export interface ICandidate extends Document {
    jobId: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    resumeUrl: string;
    coverLetter?: string;
    status: CandidateStatus;
    interviewDate?: Date;
    interviewLocation?: string;
    notes: INote[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ICandidate, {}, {}, {}, mongoose.Document<unknown, {}, ICandidate, {}, mongoose.DefaultSchemaOptions> & ICandidate & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, ICandidate>;
export default _default;
//# sourceMappingURL=Candidate.model.d.ts.map