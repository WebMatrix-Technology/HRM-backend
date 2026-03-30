import { Response, NextFunction } from 'express';
import { performanceService } from '../services/performance.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import connectDB from '../config/database';
import Employee from '../models/Employee.model';
import { notificationService } from '../services/notification.service';
import { Role } from '../models/User.model';

export const createPerformance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await connectDB();

    // Resolve the employee from the logged-in user
    const employee = await Employee.findOne({ userId: req.user.userId }).lean();
    if (!employee) {
      res.status(404).json({ error: 'Employee profile not found' });
      return;
    }

    const performance = await performanceService.createPerformance({
      ...req.body,
      employeeId: employee._id.toString(), // Always override with the authenticated user's employee ID
    });

    // Notify HR and Admins that a new performance review is added
    notificationService.notifyRoles(
      [Role.ADMIN, Role.HR_MANAGER],
      {
        title: 'New Performance Review Submitted',
        message: `${employee.firstName} ${employee.lastName} has submitted a performance review for period ${req.body.reviewPeriod}.`,
        type: 'info',
        link: `/performance`
      }
    ).catch(err => console.error('Failed to notify about performance review:', err));

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

    const performance = await performanceService.updatePerformance(id, req.body, employee._id.toString(), req.user.role);

    // Notify the employee that their performance review has been updated (reviewed)
    if (performance && performance.employeeId) {
      const targetEmployee = await Employee.findById(performance.employeeId).select('userId');
      if (targetEmployee && targetEmployee.userId) {
        notificationService.createNotification({
          recipient: targetEmployee.userId,
          title: 'Performance Review Updated',
          message: `Your performance review for ${performance.reviewPeriod} has been reviewed/updated.`,
          type: 'success',
          link: `/performance`
        }).catch(err => console.error('Failed to notify employee about performance review update:', err));
      }
    }

    res.status(200).json({ message: 'Performance review updated successfully', data: performance });
  } catch (error) {
    next(error);
  }
};

export const getPerformances = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await connectDB();

    let employeeId = req.query.employeeId as string | undefined;

    // Security: Regular employees can only see their own performance reviews
    if (req.user.role === Role.EMPLOYEE || req.user.role === Role.CLERK) {
      const employee = await Employee.findOne({ userId: req.user.userId }).lean();
      if (!employee) {
        res.status(404).json({ error: 'Employee profile not found' });
        return;
      }
      employeeId = employee._id.toString();
    }

    const performances = await performanceService.getPerformances(employeeId);
    res.status(200).json({ data: performances });
  } catch (error) {
    next(error);
  }
};

export const getPerformanceById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await connectDB();

    const { id } = req.params;
    const performance = await performanceService.getPerformanceById(id);

    if (!performance) {
      res.status(404).json({ error: 'Performance review not found' });
      return;
    }

    // Security check: Regular employees can only view their own reviews
    if (req.user.role === Role.EMPLOYEE || req.user.role === Role.CLERK) {
      const employee = await Employee.findOne({ userId: req.user.userId }).lean();
      if (!employee || performance.employeeId?._id?.toString() !== employee._id.toString()) {
        res.status(403).json({ error: 'Forbidden: You can only view your own performance reviews' });
        return;
      }
    }

    res.status(200).json({ data: performance });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const analytics = await performanceService.getAnalytics();
    res.status(200).json({ data: analytics });
  } catch (error) {
    next(error);
  }
};
