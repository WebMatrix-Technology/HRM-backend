import { Router } from 'express';
import { processPayroll, getPayrolls, getPayrollById, markAsPaid, calculatePayroll } from '../controllers/payroll.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getPayrolls);
router.get('/:employeeId/calculate', authorize('ADMIN', 'HR_MANAGER'), calculatePayroll);
router.get('/:id', getPayrollById);
router.post('/', authorize('ADMIN', 'HR_MANAGER'), processPayroll);
router.post('/:id/paid', authorize('ADMIN', 'HR_MANAGER'), markAsPaid);

export default router;

