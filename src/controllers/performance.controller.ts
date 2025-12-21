import { Response, NextFunction } from 'express';
import { performanceService } from '../services/performance.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import connectDB from '../config/database';
import Employee from '../models/Employee.model';

export const createPerformance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const performance = await performanceService.createPerformance(req.body);
    res.status(201).json({ message: 'Performance review created successfully', data: performance });
  } catch (error) {
    next(error);
  }
};

export const updatePerformance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    await connectDB();

    const employee = await Employee.findOne({ userId: req.user.userId }).lean();

    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    const performance = await performanceService.updatePerformance(id, req.body, employee._id.toString());
    res.status(200).json({ message: 'Performance review updated successfully', data: performance });
  } catch (error) {
    next(error);
  }
};

export const getPerformances = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const employeeId = req.query.employeeId as string | undefined;
    const performances = await performanceService.getPerformances(employeeId);
    res.status(200).json({ data: performances });
  } catch (error) {
    next(error);
  }
};

export const getPerformanceById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const performance = await performanceService.getPerformanceById(id);
    res.status(200).json({ data: performance });
  } catch (error) {
    next(error);
  }
};
