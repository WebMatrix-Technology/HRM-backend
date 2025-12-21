import connectDB from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { LeaveType, LeaveStatus } from '../models';
import Leave from '../models/Leave.model';

export interface CreateLeaveData {
  employeeId: string;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
}

export const leaveService = {
  applyLeave: async (data: CreateLeaveData) => {
    await connectDB();

    // Calculate days
    const days = Math.ceil(
      (new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

    if (days <= 0) {
      throw new AppError('End date must be after start date', 400);
    }

    const leave = await Leave.create({
      ...data,
      days,
      status: LeaveStatus.PENDING,
    });

    const populatedLeave = await Leave.findById(leave._id)
      .populate('employeeId', 'id firstName lastName employeeId')
      .lean();

    return populatedLeave;
  },

  approveLeave: async (leaveId: string, approvedBy: string) => {
    await connectDB();

    const leave = await Leave.findByIdAndUpdate(
      leaveId,
      {
        status: LeaveStatus.APPROVED,
        approvedBy,
        approvedAt: new Date(),
      },
      { new: true }
    );

    if (!leave) {
      throw new AppError('Leave not found', 404);
    }

    return leave;
  },

  rejectLeave: async (leaveId: string, approvedBy: string, rejectionReason: string) => {
    await connectDB();

    const leave = await Leave.findByIdAndUpdate(
      leaveId,
      {
        status: LeaveStatus.REJECTED,
        approvedBy,
        approvedAt: new Date(),
        rejectionReason,
      },
      { new: true }
    );

    if (!leave) {
      throw new AppError('Leave not found', 404);
    }

    return leave;
  },

  getLeaves: async (employeeId?: string, status?: LeaveStatus) => {
    await connectDB();

    const query: any = {};
    if (employeeId) query.employeeId = employeeId;
    if (status) query.status = status;

    const leaves = await Leave.find(query)
      .populate('employeeId', 'id firstName lastName employeeId')
      .sort({ createdAt: -1 })
      .lean();

    return leaves;
  },

  getLeaveBalance: async (employeeId: string) => {
    await connectDB();

    const currentYear = new Date().getFullYear();
    const leaves = await Leave.find({
      employeeId,
      status: LeaveStatus.APPROVED,
      startDate: {
        $gte: new Date(`${currentYear}-01-01`),
        $lte: new Date(`${currentYear}-12-31`),
      },
    }).lean();

    const usedLeaves = leaves.reduce((sum, leave) => sum + leave.days, 0);

    // Default annual leave balance (adjust based on your policy)
    const annualBalance = 20;

    return {
      annualBalance,
      usedLeaves,
      remainingLeaves: annualBalance - usedLeaves,
    };
  },
};
