import { Router } from 'express';
import { punchIn, punchOut, getAttendance, getMonthlyReport, startBreak, endBreak, exportAttendance } from '../controllers/attendance.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/punch-in', punchIn);
router.post('/punch-out', punchOut);
router.post('/start-break', startBreak);
router.post('/end-break', endBreak);
router.get('/export', exportAttendance);
router.get('/:employeeId?', getAttendance);
router.get('/:employeeId?/monthly', getMonthlyReport);

export default router;

