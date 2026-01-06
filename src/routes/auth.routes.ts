import { Router } from 'express';
import { register, login, getMe, changePassword, adminChangeUserPassword } from '../controllers/auth.controller';
import { registerValidation, loginValidation } from '../validations/auth.validation';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authenticate, getMe);
router.put('/change-password', authenticate, changePassword);
router.put('/admin/change-user-password', authenticate, authorize('ADMIN'), adminChangeUserPassword);

export default router;

