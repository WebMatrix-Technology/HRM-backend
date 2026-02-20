import mongoose, { Schema, Document } from 'mongoose';

export enum JobType {
    FULL_TIME = 'FULL_TIME',
    PART_TIME = 'PART_TIME',
    CONTRACT = 'CONTRACT',
    INTERNSHIP = 'INTERNSHIP',
}

export enum JobStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    DRAFT = 'DRAFT',
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

const JobSchema = new Schema<IJob>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        department: { type: String, required: true },
        location: { type: String, required: true },
        type: { type: String, enum: Object.values(JobType), default: JobType.FULL_TIME },
        requirements: [{ type: String }],
        salaryRange: {
            min: { type: Number, required: true },
            max: { type: Number, required: true },
            currency: { type: String, default: 'INR' },
        },
        status: { type: String, enum: Object.values(JobStatus), default: JobStatus.OPEN },
        postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IJob>('Job', JobSchema);
