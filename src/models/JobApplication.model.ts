import mongoose, { Schema, Document } from 'mongoose';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEWED = 'INTERVIEWED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
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

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    jobPostingId: { type: Schema.Types.ObjectId, ref: 'JobPosting', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    resumeUrl: { type: String, required: true },
    coverLetter: String,
    status: { type: String, enum: Object.values(ApplicationStatus), default: ApplicationStatus.PENDING },
    interviewDate: Date,
    notes: String,
  },
  {
    timestamps: true,
    collection: 'job_applications',
  }
);

export default mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);


