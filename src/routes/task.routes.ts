import express from 'express';
import { taskController } from '../controllers/task.controller';
import { authenticate as protect, authorize } from '../middlewares/auth.middleware';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.post('/', authorize('ADMIN'), taskController.createTask);
router.put('/:id', authorize('ADMIN', 'EMPLOYEE'), taskController.updateTask);
router.post('/:id/comments', taskController.addComment);
router.delete('/:id', authorize('ADMIN'), taskController.deleteTask);

export default router;
