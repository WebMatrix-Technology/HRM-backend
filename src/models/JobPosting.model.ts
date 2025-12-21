import mongoose, { Schema, Document } from 'mongoose';
import { EmploymentType } from './Employee.model';

export enum JobStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  DRAFT = 'DRAFT',
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

const JobPostingSchema = new Schema<IJobPosting>(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    description: { type: String, required: true },
    requirements: Schema.Types.Mixed,
    location: String,
    employmentType: { type: String, enum: Object.values(EmploymentType), required: true },
    salaryRange: String,
    status: { type: String, enum: Object.values(JobStatus), default: JobStatus.OPEN },
    postedBy: { type: Schema.Types.ObjectId, required: true },
    postedAt: { type: Date, default: Date.now },
    closedAt: Date,
  },
  {
    timestamps: true,
    collection: 'job_postings',
  }
);

export default mongoose.model<IJobPosting>('JobPosting', JobPostingSchema);


