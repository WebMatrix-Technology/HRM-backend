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
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = process.env.NODE_ENV === 'production' ? '/tmp/uploads' : 'uploads/';
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Public routes (or authenticated for internal employees to view jobs)
router.get('/jobs', getJobs);
router.get('/jobs/:id', getJobById);
router.post('/jobs/:id/apply', upload.single('resumeFile'), applyForJob);

// Protected routes (HR/Admin only)
router.use(authenticate);
router.post('/jobs', createJob);
router.put('/jobs/:id', updateJob);
router.get('/candidates', getCandidates);
router.put('/candidates/:id/status', updateCandidateStatus);

export default router;
