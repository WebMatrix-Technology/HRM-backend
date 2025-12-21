import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all users (accessible to all authenticated users)
router.get('/', getUsers);

// Get user by ID (accessible to all authenticated users)
router.get('/:id', getUserById);

// Update, delete - only Admin
router.put('/:id', authorize('ADMIN'), updateUser);
router.delete('/:id', authorize('ADMIN'), deleteUser);

export default router;


