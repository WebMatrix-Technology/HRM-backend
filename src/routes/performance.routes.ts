import { Router } from 'express';
import { createPerformance, updatePerformance, getPerformances, getPerformanceById } from '../controllers/performance.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getPerformances);
router.get('/:id', getPerformanceById);
router.post('/', authorize('ADMIN', 'HR', 'MANAGER'), createPerformance);
router.put('/:id', authorize('ADMIN', 'HR', 'MANAGER'), updatePerformance);

export default router;

