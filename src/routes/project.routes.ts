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
} from '../controllers/project.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '../models/User.model';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET routes
router.get('/', authorize(Role.ADMIN, Role.HR_MANAGER), getProjects);
router.get('/stats', authorize(Role.ADMIN, Role.HR_MANAGER), getProjectStats);
router.get('/managers', authorize(Role.ADMIN, Role.HR_MANAGER), getAvailableManagers);
router.get('/templates', authorize(Role.ADMIN, Role.HR_MANAGER), getProjectTemplates);
router.get('/export', authorize(Role.ADMIN, Role.HR_MANAGER), exportProjects);
router.get('/:id', authorize(Role.ADMIN, Role.HR_MANAGER), getProject);

// POST routes
router.post('/', authorize(Role.ADMIN, Role.HR_MANAGER), createProject);
router.post('/:id/members', authorize(Role.ADMIN, Role.HR_MANAGER), addProjectMembers);

// PUT routes
router.put('/:id', authorize(Role.ADMIN, Role.HR_MANAGER), updateProject);

// PATCH routes
router.patch('/:id/progress', authorize(Role.ADMIN, Role.HR_MANAGER), updateProjectProgress);

// DELETE routes
router.delete('/:id', authorize(Role.ADMIN), deleteProject);
router.delete('/:id/members/:memberId', authorize(Role.ADMIN, Role.HR_MANAGER), removeProjectMember);

export default router;





