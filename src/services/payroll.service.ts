import connectDB from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { PayrollStatus } from '../models';
import Payroll from '../models/Payroll.model';

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

  getPayrolls: async (employeeId?: string, month?: number, year?: number) => {
    await connectDB();

    const query: any = {};
    if (employeeId) query.employeeId = employeeId;
    if (month) query.month = month;
    if (year) query.year = year;

    const payrolls = await Payroll.find(query)
      .populate('employeeId', 'id firstName lastName employeeId')
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
};
