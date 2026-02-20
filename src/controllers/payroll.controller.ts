import { Response, NextFunction } from 'express';
import { payrollService } from '../services/payroll.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { Role } from '../types';

export const processPayroll = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payroll = await payrollService.processPayroll(req.body);
    res.status(201).json({ message: 'Payroll processed successfully', data: payroll });
  } catch (error) {
    next(error);
  }
};

export const getPayrolls = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let employeeId = req.query.employeeId as string | undefined;
    const month = req.query.month ? parseInt(req.query.month as string) : undefined;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;

    // Access Control
    let targetUserId: string | undefined;
    if (req.user?.role !== Role.ADMIN && req.user?.role !== Role.HR_MANAGER) {
      // For non-privileged users, force them to view only their own payrolls
      targetUserId = req.user?.userId;
      employeeId = undefined; // Ignore specific employeeId query
    }

    const payrolls = await payrollService.getPayrolls(employeeId, month, year, targetUserId);
    res.status(200).json({ data: payrolls });
  } catch (error) {
    next(error);
  }
};

export const getPayrollById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const payroll = await payrollService.getPayrollById(id);
    res.status(200).json({ data: payroll });
  } catch (error) {
    next(error);
  }
};

export const markAsPaid = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const payroll = await payrollService.markAsPaid(id);
    res.status(200).json({ message: 'Payroll marked as paid', data: payroll });
  } catch (error) {
    next(error);
  }
};

export const calculatePayroll = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { employeeId } = req.params;
    const month = req.query.month ? parseInt(req.query.month as string) : new Date().getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();

    const calculationDetails = await payrollService.calculatePayroll(employeeId, month, year);
    res.status(200).json({ data: calculationDetails });
  } catch (error) {
    next(error);
  }
};

