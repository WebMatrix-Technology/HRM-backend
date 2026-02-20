import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { createHoliday, getHolidays, deleteHoliday } from '../controllers/holiday.controller';

const router = express.Router();

router.use(authenticate);

router.post('/', createHoliday);
router.get('/', getHolidays);
router.delete('/:id', deleteHoliday);

export default router;
