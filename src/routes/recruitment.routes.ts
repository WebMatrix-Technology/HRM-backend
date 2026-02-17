import { Router } from 'express';
import {
  createJobPosting,
  getJobPostings,
  getJobPostingById,
  updateJobStatus,
  createApplication,
  getApplications,
  updateApplicationStatus,
} from '../controllers/recruitment.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/applications', createApplication);
router.get('/jobs', getJobPostings);
router.get('/jobs/:id', getJobPostingById);

// Protected routes
router.use(authenticate);

router.post('/jobs', authorize('ADMIN', 'HR', 'HR_MANAGER'), createJobPosting);
router.put('/jobs/:id/status', authorize('ADMIN', 'HR', 'HR_MANAGER'), updateJobStatus);
router.get('/applications', authorize('ADMIN', 'HR', 'HR_MANAGER'), getApplications);
router.put('/applications/:id/status', authorize('ADMIN', 'HR', 'HR_MANAGER'), updateApplicationStatus);

export default router;

