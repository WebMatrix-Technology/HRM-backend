import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import Holiday from '../models/Holiday.model';
import { AppError } from '../middlewares/error.middleware';
import { Role } from '../types';

export const createHoliday = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { title, date, type, description, isRecurring } = req.body;

        // Only HR/Admin can create
        if (req.user?.role !== Role.HR_MANAGER && req.user?.role !== Role.ADMIN) {
            throw new AppError('Unauthorized', 403);
        }

        const newHoliday = await Holiday.create({
            title,
            date: new Date(date),
            type,
            description,
            isRecurring,
            createdBy: req.user.userId,
        });

        res.status(201).json({ success: true, data: newHoliday });
    } catch (error) {
        next(error);
    }
};

export const getHolidays = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { year, month } = req.query;
        const query: any = {};

        if (year) {
            const startDate = new Date(`${year}-01-01`);
            const endDate = new Date(`${year}-12-31`);
            query.date = { $gte: startDate, $lte: endDate };

            if (month) {
                const m = parseInt(month as string) - 1; // 0-indexed
                const startMonth = new Date(parseInt(year as string), m, 1);
                const endMonth = new Date(parseInt(year as string), m + 1, 0); // Last day of month
                query.date = { $gte: startMonth, $lte: endMonth };
            }
        }

        const holidays = await Holiday.find(query).sort({ date: 1 });
        res.status(200).json({ success: true, data: holidays });
    } catch (error) {
        next(error);
    }
};

export const deleteHoliday = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (req.user?.role !== Role.HR_MANAGER && req.user?.role !== Role.ADMIN) {
            throw new AppError('Unauthorized', 403);
        }

        const holiday = await Holiday.findByIdAndDelete(id);

        if (!holiday) {
            throw new AppError('Holiday not found', 404);
        }

        res.status(200).json({ success: true, message: 'Holiday deleted successfully' });
    } catch (error) {
        next(error);
    }
};
