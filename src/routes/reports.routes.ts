import { Router } from 'express';
import { getAttendanceSummary, getPayrollSummary, getEmployeeStats } from '../controllers/reports.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'HR', 'MANAGER', 'HR_MANAGER'));

router.get('/attendance', getAttendanceSummary);
router.get('/payroll', getPayrollSummary);
router.get('/employees', getEmployeeStats);

export default router;

