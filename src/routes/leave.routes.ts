import { Router } from 'express';
import { applyLeave, approveLeave, rejectLeave, getLeaves, getLeaveBalance } from '../controllers/leave.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', applyLeave);
router.get('/balance', getLeaveBalance);
router.get('/', getLeaves);
router.post('/:id/approve', authorize('ADMIN', 'HR', 'MANAGER', 'HR_MANAGER'), approveLeave);
router.post('/:id/reject', authorize('ADMIN', 'HR', 'MANAGER', 'HR_MANAGER'), rejectLeave);

export default router;

