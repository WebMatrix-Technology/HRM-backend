import express from 'express';
import { taskController } from '../controllers/task.controller';
import { authenticate as protect, authorize } from '../middlewares/auth.middleware';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.post('/', authorize('ADMIN', 'MANAGER', 'HR', 'HR_MANAGER'), taskController.createTask);
router.put('/:id', authorize('ADMIN', 'MANAGER', 'HR', 'HR_MANAGER', 'EMPLOYEE'), taskController.updateTask);
router.delete('/:id', authorize('ADMIN', 'MANAGER', 'HR_MANAGER'), taskController.deleteTask);

export default router;
