import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import Job, { JobStatus } from '../models/Job.model';
import Candidate, { CandidateStatus } from '../models/Candidate.model';
import { AppError } from '../middlewares/error.middleware';
import { Role } from '../types';

export const createJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || (req.user.role !== Role.HR_MANAGER && req.user.role !== Role.ADMIN)) {
      throw new AppError('Unauthorized', 403);
    }

    const job = await Job.create({
      ...req.body,
      postedBy: req.user.userId,
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // If we're filtering, apply filters
    const filter: any = {};
    const { status, department, type } = req.query;

    if (status) filter.status = status;
    if (department) filter.department = department;
    if (type) filter.type = type;

    const jobs = await Job.find(filter).sort({ createdAt: -1 }).populate('postedBy', 'firstName lastName');

    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'firstName lastName');
    if (!job) {
      throw new AppError('Job not found', 404);
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || (req.user.role !== Role.HR_MANAGER && req.user.role !== Role.ADMIN)) {
      throw new AppError('Unauthorized', 403);
    }

    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) {
      throw new AppError('Job not found', 404);
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

export const applyForJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id: jobId } = req.params;
    const { firstName, lastName, email, phone, coverLetter } = req.body;

    let resumeUrl = req.body.resumeUrl;
    if (req.file) {
      resumeUrl = req.file.path.replace(/\\/g, '/'); // Normalize windows paths
    }

    // Check if job exists and is open
    const job = await Job.findById(jobId);
    if (!job || job.status !== JobStatus.OPEN) {
      throw new AppError('Job not found or closed', 404);
    }

    // Check for duplicate application
    const existingCandidate = await Candidate.findOne({ jobId, email });
    if (existingCandidate) {
      throw new AppError('You have already applied for this position', 400);
    }

    const candidate = await Candidate.create({
      jobId,
      firstName,
      lastName,
      email,
      phone,
      resumeUrl,
      coverLetter,
      status: CandidateStatus.APPLIED,
    });

    res.status(201).json({ success: true, message: 'Application submitted successfully', data: candidate });
  } catch (error) {
    next(error);
  }
};

export const getCandidates = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || (req.user.role !== Role.HR_MANAGER && req.user.role !== Role.ADMIN)) {
      throw new AppError('Unauthorized', 403);
    }

    const { jobId, status } = req.query;
    const filter: any = {};

    if (jobId) filter.jobId = jobId;
    if (status) filter.status = status;

    const candidates = await Candidate.find(filter)
      .sort({ createdAt: -1 })
      .populate('jobId', 'title department');

    res.status(200).json({ success: true, data: candidates });
  } catch (error) {
    next(error);
  }
};

export const updateCandidateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!req.user || (req.user.role !== Role.HR_MANAGER && req.user.role !== Role.ADMIN)) {
      throw new AppError('Unauthorized', 403);
    }

    const { status, note } = req.body;

    // Base update
    let update: any = { status };

    // If note is provided, push to notes array
    if (note) {
      update.$push = {
        notes: {
          text: note,
          author: req.user.userId,
          date: new Date(),
        }
      };
    }

    const candidate = await Candidate.findByIdAndUpdate(
      id,
      update,
      { new: true }
    );

    if (!candidate) {
      throw new AppError('Candidate not found', 404);
    }

    res.status(200).json({ success: true, data: candidate });
  } catch (error) {
    next(error);
  }
};
