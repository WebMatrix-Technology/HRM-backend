import { Response, NextFunction } from 'express';
import { recruitmentService } from '../services/recruitment.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import connectDB from '../config/database';
import Employee from '../models/Employee.model';

export const createJobPosting = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await connectDB();

    const employee = await Employee.findOne({ userId: req.user.userId }).lean();

    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    const job = await recruitmentService.createJobPosting({
      ...req.body,
      postedBy: employee._id.toString(),
    });

    res.status(201).json({ message: 'Job posting created successfully', data: job });
  } catch (error) {
    next(error);
  }
};

export const getJobPostings = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const status = req.query.status as any;
    const jobs = await recruitmentService.getJobPostings(status);
    res.status(200).json({ data: jobs });
  } catch (error) {
    next(error);
  }
};

export const getJobPostingById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const job = await recruitmentService.getJobPostingById(id);
    res.status(200).json({ data: job });
  } catch (error) {
    next(error);
  }
};

export const updateJobStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const job = await recruitmentService.updateJobStatus(id, status);
    res.status(200).json({ message: 'Job status updated successfully', data: job });
  } catch (error) {
    next(error);
  }
};

export const createApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const application = await recruitmentService.createApplication(req.body);
    res.status(201).json({ message: 'Application submitted successfully', data: application });
  } catch (error) {
    next(error);
  }
};

export const getApplications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobPostingId = req.query.jobPostingId as string | undefined;
    const status = req.query.status as any;
    const applications = await recruitmentService.getApplications(jobPostingId, status);
    res.status(200).json({ data: applications });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, interviewDate, notes } = req.body;
    const application = await recruitmentService.updateApplicationStatus(
      id,
      status,
      interviewDate ? new Date(interviewDate) : undefined,
      notes
    );
    res.status(200).json({ message: 'Application status updated successfully', data: application });
  } catch (error) {
    next(error);
  }
};
