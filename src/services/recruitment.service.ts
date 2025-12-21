import connectDB from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { JobStatus, ApplicationStatus, EmploymentType } from '../models';
import JobPosting from '../models/JobPosting.model';
import JobApplication from '../models/JobApplication.model';

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

export const recruitmentService = {
  createJobPosting: async (data: CreateJobPostingData) => {
    await connectDB();

    const job = await JobPosting.create({
      ...data,
      status: JobStatus.OPEN,
      requirements: data.requirements || undefined,
    });

    return job.toObject();
  },

  getJobPostings: async (status?: JobStatus) => {
    await connectDB();

    const query: any = {};
    if (status) query.status = status;

    const jobs = await JobPosting.find(query)
      .sort({ postedAt: -1 })
      .lean();

    return jobs;
  },

  getJobPostingById: async (id: string) => {
    await connectDB();

    const job = await JobPosting.findById(id).lean();

    if (!job) {
      throw new AppError('Job posting not found', 404);
    }

    // Get applications for this job posting
    const applications = await JobApplication.find({ jobPostingId: id })
      .populate('jobPostingId', 'id title')
      .lean();

    return {
      ...job,
      applications,
    };
  },

  updateJobStatus: async (id: string, status: JobStatus) => {
    await connectDB();

    const updateData: any = { status };
    if (status === JobStatus.CLOSED) {
      updateData.closedAt = new Date();
    }

    const job = await JobPosting.findByIdAndUpdate(id, updateData, {
      new: true,
    }).lean();

    if (!job) {
      throw new AppError('Job posting not found', 404);
    }

    return job;
  },

  createApplication: async (data: CreateApplicationData) => {
    await connectDB();

    const application = await JobApplication.create({
      ...data,
      status: ApplicationStatus.PENDING,
    });

    const populatedApplication = await JobApplication.findById(application._id)
      .populate('jobPostingId', 'id title')
      .lean();

    return populatedApplication;
  },

  getApplications: async (jobPostingId?: string, status?: ApplicationStatus) => {
    await connectDB();

    const query: any = {};
    if (jobPostingId) query.jobPostingId = jobPostingId;
    if (status) query.status = status;

    const applications = await JobApplication.find(query)
      .populate('jobPostingId', 'id title')
      .sort({ createdAt: -1 })
      .lean();

    return applications;
  },

  updateApplicationStatus: async (id: string, status: ApplicationStatus, interviewDate?: Date, notes?: string) => {
    await connectDB();

    const updateData: any = { status };
    if (interviewDate) updateData.interviewDate = interviewDate;
    if (notes) updateData.notes = notes;

    const application = await JobApplication.findByIdAndUpdate(id, updateData, {
      new: true,
    }).lean();

    if (!application) {
      throw new AppError('Application not found', 404);
    }

    return application;
  },
};
