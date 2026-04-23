import { Router } from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addProjectMembers,
  removeProjectMember,
  updateProjectProgress,
  getProjectStats,
  getAvailableManagers,
  getProjectTemplates,
  exportProjects,
  uploadProjectReport,
} from '../controllers/project.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '../models/User.model';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

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
    // Unique filename: timestamp-originalName
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for reports
});

// All routes require authentication
router.use(authenticate);

// GET routes
router.get('/', authorize(Role.ADMIN, Role.MANAGER, Role.CLERK, Role.EMPLOYEE), getProjects);
router.get('/stats', authorize(Role.ADMIN, Role.MANAGER), getProjectStats);
router.get('/managers', authorize(Role.ADMIN, Role.MANAGER), getAvailableManagers);
router.get('/templates', authorize(Role.ADMIN, Role.MANAGER), getProjectTemplates);
router.get('/export', authorize(Role.ADMIN, Role.MANAGER), exportProjects);
router.get('/:id', authorize(Role.ADMIN, Role.MANAGER, Role.CLERK, Role.EMPLOYEE), getProject);

// POST routes
router.post('/', authorize(Role.ADMIN, Role.MANAGER), createProject);
router.post('/:id/report', authorize(Role.ADMIN, Role.MANAGER), upload.single('reportFile'), uploadProjectReport);
router.post('/:id/members', authorize(Role.ADMIN, Role.MANAGER), addProjectMembers);

// PUT routes
router.put('/:id', authorize(Role.ADMIN, Role.MANAGER), updateProject);

// PATCH routes
router.patch('/:id/progress', authorize(Role.ADMIN, Role.MANAGER), updateProjectProgress);

// DELETE routes
router.delete('/:id', authorize(Role.ADMIN), deleteProject);
router.delete('/:id/members/:memberId', authorize(Role.ADMIN, Role.MANAGER), removeProjectMember);

export default router;





