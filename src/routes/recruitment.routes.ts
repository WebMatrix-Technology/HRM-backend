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

router.post('/jobs', authorize('ADMIN', 'HR'), createJobPosting);
router.put('/jobs/:id/status', authorize('ADMIN', 'HR'), updateJobStatus);
router.get('/applications', authorize('ADMIN', 'HR'), getApplications);
router.put('/applications/:id/status', authorize('ADMIN', 'HR'), updateApplicationStatus);

export default router;

