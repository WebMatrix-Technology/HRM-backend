import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import connectDB from '../config/database';
import Attendance from '../models/Attendance.model';
import Payroll from '../models/Payroll.model';
import Employee from '../models/Employee.model';
import User from '../models/User.model';

export const getAttendanceSummary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await connectDB();

    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Get all attendances in the date range
    const attendances = await Attendance.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .select('status')
      .lean();

    // Group by status manually
    const summary = attendances.reduce((acc: any, attendance: any) => {
      const status = attendance.status;
      if (!acc[status]) {
        acc[status] = 0;
      }
      acc[status]++;
      return acc;
    }, {});

    const result = Object.entries(summary).map(([status, _count]) => ({
      status,
      _count: { _all: _count },
    }));

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const getPayrollSummary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await connectDB();

    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();

    const payrolls = await Payroll.find({
      month,
      year,
    }).lean();

    const totalSalary = payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);
    const totalEmployees = payrolls.length;

    res.status(200).json({
      data: {
        month,
        year,
        totalSalary,
        totalEmployees,
        payrolls,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeStats = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await connectDB();

    const [total, active, employees, users] = await Promise.all([
      Employee.countDocuments(),
      Employee.countDocuments({ isActive: true }),
      Employee.find({ department: { $ne: null } })
        .select('department')
        .lean(),
      User.find().select('role').lean(),
    ]);

    // Group by department manually
    const byDepartmentMap = employees.reduce((acc: any, emp: any) => {
      const dept = emp.department;
      if (dept) {
        if (!acc[dept]) {
          acc[dept] = 0;
        }
        acc[dept]++;
      }
      return acc;
    }, {});

    const byDepartment = Object.entries(byDepartmentMap).map(([department, _count]) => ({
      department,
      _count: { _all: _count },
    }));

    // Group by role manually
    const byRoleMap = users.reduce((acc: any, user: any) => {
      const role = user.role;
      if (!acc[role]) {
        acc[role] = 0;
      }
      acc[role]++;
      return acc;
    }, {});

    const byRole = Object.entries(byRoleMap).map(([role, _count]) => ({
      role,
      _count: { _all: _count },
    }));

    res.status(200).json({
      data: {
        total,
        active,
        inactive: total - active,
        byDepartment,
        byRole,
      },
    });
  } catch (error) {
    next(error);
  }
};
