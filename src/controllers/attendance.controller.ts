import { Response, NextFunction } from 'express';
import { attendanceService } from '../services/attendance.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import connectDB from '../config/database';
import Employee from '../models/Employee.model';

export const punchIn = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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

    const workFromHome = req.body.workFromHome || false;
    const attendance = await attendanceService.punchIn(employee._id.toString(), workFromHome);
    res.status(200).json({ message: 'Punched in successfully', data: attendance });
  } catch (error) {
    next(error);
  }
};

export const punchOut = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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

    const idleTime = req.body.idleTime ? parseInt(req.body.idleTime, 10) : 0;
    const attendance = await attendanceService.punchOut(employee._id.toString(), idleTime);
    res.status(200).json({ message: 'Punched out successfully', data: attendance });
  } catch (error) {
    next(error);
  }
};

export const getAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await connectDB();

    let employeeId: string | undefined = req.params.employeeId;
    if (!employeeId && req.user) {
      const employee = await Employee.findOne({ userId: req.user.userId }).lean();
      employeeId = employee?._id.toString();
    }

    if (!employeeId) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    const startDate = new Date(req.query.startDate as string || new Date().toISOString().split('T')[0]);
    const endDate = new Date(req.query.endDate as string || new Date().toISOString().split('T')[0]);

    const attendances = await attendanceService.getAttendance(employeeId, startDate, endDate);
    res.status(200).json({ data: attendances });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await connectDB();

    let employeeId: string | undefined = req.params.employeeId;
    if (!employeeId && req.user) {
      const employee = await Employee.findOne({ userId: req.user.userId }).lean();
      employeeId = employee?._id.toString();
    }

    if (!employeeId) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();

    const report = await attendanceService.getMonthlyReport(employeeId, month, year);
    res.status(200).json({ data: report });
  } catch (error) {
    next(error);
  }
};
