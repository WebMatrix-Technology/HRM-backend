import { Router } from 'express';
import { getAttendanceSummary, getPayrollSummary, getEmployeeStats } from '../controllers/reports.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/attendance', authorize('ADMIN', 'HR_MANAGER'), getAttendanceSummary);
router.get('/payroll', authorize('ADMIN', 'HR_MANAGER'), getPayrollSummary);
router.get('/employees', getEmployeeStats);

export default router;

