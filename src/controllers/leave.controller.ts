import { Response, NextFunction } from 'express';
import { leaveService } from '../services/leave.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import connectDB from '../config/database';
import Employee from '../models/Employee.model';
import { notificationService } from '../services/notification.service';
import { Role } from '../models/User.model';

export const applyLeave = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await connectDB();

    let employeeId = '';

    // Check if privileged user is assigning leave to someone else
    if (req.body.employeeId && (req.user.role === 'HR_MANAGER' || req.user.role === 'ADMIN')) {
      const targetEmployee = await Employee.findOne({ employeeId: req.body.employeeId });
      if (!targetEmployee) {
        res.status(404).json({ error: 'Target employee not found' });
        return;
      }
      employeeId = targetEmployee._id.toString();
    } else {
      // Default to applying for self
      const employee = await Employee.findOne({ userId: req.user.userId }).lean();
      if (!employee) {
        res.status(404).json({ error: 'Employee not found' });
        return;
      }
      employeeId = employee._id.toString();
    }

    const leave = await leaveService.applyLeave({
      ...req.body,
      employeeId,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
    });

    // Notify HR and Admins
    notificationService.notifyRoles(
      [Role.ADMIN, Role.HR_MANAGER],
      {
        title: 'New Leave Application',
        message: `A new leave request has been submitted and requires review.`,
        type: 'info',
        link: `/leave`
      }
    ).catch(err => console.error('Failed to notify about leave application:', err));

    res.status(201).json({ message: 'Leave applied successfully', data: leave });
  } catch (error) {
    next(error);
  }
};

export const approveLeave = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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

    const leave = await leaveService.approveLeave(id, employee._id.toString(), req.user.role);

    // Notify employee
    if (leave.employeeId && (leave.employeeId as any).userId) {
      notificationService.createNotification({
        recipient: (leave.employeeId as any).userId.toString(),
        title: 'Leave Approved',
        message: `Your leave request from ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(leave.endDate).toLocaleDateString()} has been approved.`,
        type: 'success',
        link: '/leave'
      }).catch(err => console.error('Failed to notify employee about leave approval:', err));
    }

    res.status(200).json({ message: 'Leave approved successfully', data: leave });
  } catch (error) {
    next(error);
  }
};

export const rejectLeave = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { rejectionReason } = req.body;

    await connectDB();

    const employee = await Employee.findOne({ userId: req.user.userId }).lean();

    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    const leave = await leaveService.rejectLeave(id, employee._id.toString(), rejectionReason, req.user.role);

    // Notify employee
    if (leave.employeeId && (leave.employeeId as any).userId) {
      notificationService.createNotification({
        recipient: (leave.employeeId as any).userId.toString(),
        title: 'Leave Rejected',
        message: `Your leave request from ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(leave.endDate).toLocaleDateString()} has been rejected${rejectionReason ? `: ${rejectionReason}` : '.'}`,
        type: 'error',
        link: '/leave'
      }).catch(err => console.error('Failed to notify employee about leave rejection:', err));
    }

    res.status(200).json({ message: 'Leave rejected successfully', data: leave });
  } catch (error) {
    next(error);
  }
};

export const getLeaves = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const employeeId = req.query.employeeId as string | undefined;
    const status = req.query.status as any;

    const leaves = await leaveService.getLeaves(employeeId, status);
    res.status(200).json({ data: leaves });
  } catch (error) {
    next(error);
  }
};

export const getLeaveBalance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await connectDB();

    const employee = await Employee.findOne({ userId: req.user.userId }).lean();

    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    const balance = await leaveService.getLeaveBalance(employee._id.toString());
    res.status(200).json({ data: balance });
  } catch (error) {
    next(error);
  }
};
