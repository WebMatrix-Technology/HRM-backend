import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  applyForJob,
  getCandidates,
  updateCandidateStatus
} from '../controllers/recruitment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Public routes (or authenticated for internal employees to view jobs)
router.get('/jobs', getJobs);
router.get('/jobs/:id', getJobById);
router.post('/jobs/:id/apply', applyForJob);

// Protected routes (HR/Admin only)
router.use(authenticate);
router.post('/jobs', createJob);
router.put('/jobs/:id', updateJob);
router.get('/candidates', getCandidates);
router.put('/candidates/:id/status', updateCandidateStatus);

export default router;
