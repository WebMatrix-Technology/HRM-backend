import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
    getNotifications,
    markAsRead,
    deleteNotification,
} from '../controllers/notification.controller';

const router = express.Router();

router.use(authenticate);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
