import { Router } from 'express';
import { createPerformance, updatePerformance, getPerformances, getPerformanceById, getAnalytics } from '../controllers/performance.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/analytics', authorize('ADMIN', 'HR_MANAGER'), getAnalytics);
router.get('/', getPerformances);
router.get('/:id', getPerformanceById);
router.post('/', authorize('ADMIN', 'HR_MANAGER'), createPerformance);
router.put('/:id', authorize('ADMIN', 'HR_MANAGER'), updatePerformance);

export default router;

