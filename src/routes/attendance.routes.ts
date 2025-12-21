import { Router } from 'express';
import { punchIn, punchOut, getAttendance, getMonthlyReport } from '../controllers/attendance.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/punch-in', punchIn);
router.post('/punch-out', punchOut);
router.get('/:employeeId?', getAttendance);
router.get('/:employeeId?/monthly', getMonthlyReport);

export default router;

