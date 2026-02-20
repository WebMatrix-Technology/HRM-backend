import mongoose, { Schema, Document } from 'mongoose';

export enum CandidateStatus {
    APPLIED = 'APPLIED',
    SCREENING = 'SCREENING',
    INTERVIEW = 'INTERVIEW',
    OFFER = 'OFFER',
    HIRED = 'HIRED',
    REJECTED = 'REJECTED',
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
    notes: INote[];
    createdAt: Date;
    updatedAt: Date;
}

const NoteSchema = new Schema<INote>({
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
});

const CandidateSchema = new Schema<ICandidate>(
    {
        jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        resumeUrl: { type: String, required: true },
        coverLetter: { type: String },
        status: { type: String, enum: Object.values(CandidateStatus), default: CandidateStatus.APPLIED },
        notes: [NoteSchema],
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate applications for the same job by the same email
CandidateSchema.index({ jobId: 1, email: 1 }, { unique: true });

export default mongoose.model<ICandidate>('Candidate', CandidateSchema);
