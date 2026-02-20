import connectDB from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import Payroll, { PayrollStatus } from '../models/Payroll.model';
import Employee from '../models/Employee.model';
import mongoose from 'mongoose';

export interface ProcessPayrollData {
  employeeId: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances?: number;
  deductions?: number;
  pf?: number;
  esic?: number;
  tds?: number;
}

export const payrollService = {
  processPayroll: async (data: ProcessPayrollData) => {
    await connectDB();

    // Check if payroll already exists
    const existing = await Payroll.findOne({
      employeeId: data.employeeId,
      month: data.month,
      year: data.year,
    });

    if (existing) {
      throw new AppError('Payroll already processed for this month', 400);
    }

    const netSalary =
      data.basicSalary +
      (data.allowances || 0) -
      (data.deductions || 0) -
      (data.pf || 0) -
      (data.esic || 0) -
      (data.tds || 0);

    const payroll = await Payroll.create({
      ...data,
      basicSalary: data.basicSalary,
      allowances: data.allowances || 0,
      deductions: data.deductions || 0,
      pf: data.pf || undefined,
      esic: data.esic || undefined,
      tds: data.tds || undefined,
      netSalary: netSalary,
      status: PayrollStatus.PROCESSED,
    });

    const populatedPayroll = await Payroll.findById(payroll._id)
      .populate('employeeId', 'id firstName lastName employeeId')
      .lean();

    return populatedPayroll;
  },

  getPayrolls: async (employeeId?: string, month?: number, year?: number, userId?: string) => {
    await connectDB();

    const query: any = {};
    if (employeeId) query.employeeId = employeeId;
    if (month) query.month = month;
    if (year) query.year = year;

    // If userId is provided, find the employee first
    if (userId) {
      const employee = await Employee.findOne({ userId });
      if (employee) {
        query.employeeId = employee._id;
      } else {
        return []; // User has no employee record
      }
    }

    const payrolls = await Payroll.find(query)
      .populate('employeeId', 'id firstName lastName employeeId department position joiningDate pan bankDetails email')
      .sort({ year: -1, month: -1 })
      .lean();

    return payrolls;
  },

  getPayrollById: async (id: string) => {
    await connectDB();

    const payroll = await Payroll.findById(id)
      .populate('employeeId', 'id firstName lastName employeeId')
      .lean();

    if (!payroll) {
      throw new AppError('Payroll not found', 404);
    }

    return payroll;
  },

  markAsPaid: async (id: string) => {
    await connectDB();

    const payroll = await Payroll.findByIdAndUpdate(
      id,
      {
        status: PayrollStatus.PAID,
        paidAt: new Date(),
      },
      { new: true }
    );

    if (!payroll) {
      throw new AppError('Payroll not found', 404);
    }

    return payroll;
  },

  calculatePayroll: async (employeeId: string, month: number, year: number) => {
    await connectDB();

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new AppError('Employee not found', 404);
    }

    // Default to 0 if salary isn't set, though it should be for payroll
    const basicSalary = employee.salary || 0;

    // Fetch attendance report for the month to calculate deductions
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const totalDaysInMonth = endDate.getDate();

    // Use aggregate to quickly get absent count and total idle time
    // We import Attendance model dynamically or rely on mongoose.model if not imported
    const Attendance = mongoose.model('Attendance');

    const attendances = await Attendance.find({
      employeeId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).lean();

    const absentDays = attendances.filter((a: any) => a.status === 'ABSENT').length;

    // Sum up all idle time in seconds
    const totalIdleSeconds = attendances.reduce((acc: number, curr: any) => acc + (curr.idleTime || 0), 0);
    const totalIdleHours = totalIdleSeconds / 3600;

    // Calculations
    const perDaySalary = basicSalary / totalDaysInMonth;
    const perHourSalary = perDaySalary / 8; // Assuming 8-hour workday

    const absentDeduction = absentDays * perDaySalary;
    const idleDeduction = totalIdleHours * perHourSalary;

    // Round deductions to 2 decimal places
    const totalDeductions = Math.round((absentDeduction + idleDeduction) * 100) / 100;

    // Mock standard PF deduction (12% of basic)
    const pf = Math.round(basicSalary * 0.12 * 100) / 100;

    return {
      basicSalary,
      deductions: totalDeductions,
      pf,
      metrics: {
        absentDays,
        idleHours: Math.round(totalIdleHours * 10) / 10,
        absentDeduction: Math.round(absentDeduction * 100) / 100,
        idleDeduction: Math.round(idleDeduction * 100) / 100,
      }
    };
  }
};
