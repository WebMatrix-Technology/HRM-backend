import connectDB from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { LeaveType, LeaveStatus } from '../models';
import Leave from '../models/Leave.model';

export interface CreateLeaveData {
  employeeId: string;
  type: LeaveType;
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

    return { ...populatedLeave, id: populatedLeave?._id };
  },

  approveLeave: async (leaveId: string, approvedBy: string, approverRole: string) => {
    await connectDB();

    const leave = await Leave.findById(leaveId).populate('employeeId');
    if (!leave) {
      throw new AppError('Leave not found', 404);
    }

    const employeeIdObj = leave.employeeId as unknown as any;
    const targetUserId = employeeIdObj?.userId;
    if (targetUserId) {
      const User = require('../models/User.model').default;
      const targetUser = await User.findById(targetUserId);
      if (targetUser) {
        if (approverRole === 'HR_MANAGER' && (targetUser.role === 'ADMIN' || targetUser.role === 'HR_MANAGER')) {
          throw new AppError('HR Manager cannot approve leaves for Admins or other HR Managers', 403);
        }
      }
    }

    leave.status = LeaveStatus.APPROVED;
    leave.approvedBy = approvedBy as any;
    leave.approvedAt = new Date();
    await leave.save();

    return { ...leave.toObject(), id: leave._id };
  },

  rejectLeave: async (leaveId: string, approvedBy: string, rejectionReason: string, approverRole: string) => {
    await connectDB();

    const leave = await Leave.findById(leaveId).populate('employeeId');
    if (!leave) {
      throw new AppError('Leave not found', 404);
    }

    const employeeIdObj = leave.employeeId as unknown as any;
    const targetUserId = employeeIdObj?.userId;
    if (targetUserId) {
      const User = require('../models/User.model').default;
      const targetUser = await User.findById(targetUserId);
      if (targetUser) {
        if (approverRole === 'HR_MANAGER' && (targetUser.role === 'ADMIN' || targetUser.role === 'HR_MANAGER')) {
          throw new AppError('HR Manager cannot reject leaves for Admins or other HR Managers', 403);
        }
      }
    }

    leave.status = LeaveStatus.REJECTED;
    leave.approvedBy = approvedBy as any;
    leave.approvedAt = new Date();
    leave.rejectionReason = rejectionReason;
    await leave.save();

    return { ...leave.toObject(), id: leave._id };
  },

  getLeaves: async (employeeId?: string, status?: LeaveStatus) => {
    await connectDB();

    const query: any = {};
    if (employeeId) query.employeeId = employeeId;
    if (status) query.status = status;

    const leaves = await Leave.find(query)
      .populate({
        path: 'employeeId',
        select: 'id firstName lastName employeeId userId',
        populate: {
          path: 'userId',
          select: 'role'
        }
      })
      .sort({ createdAt: -1 })
      .lean();

    return leaves.map((l: any) => ({ ...l, id: l._id }));
  },

  getLeaveBalance: async (employeeId: string, month?: number, year?: number) => {
    await connectDB();

    const targetMonth = month || new Date().getMonth() + 1;
    const targetYear = year || new Date().getFullYear();

    // End date of the target month
    const endDate = new Date(Date.UTC(targetYear, targetMonth, 0, 23, 59, 59, 999));
    // Start of the year
    const startDate = new Date(Date.UTC(targetYear, 0, 1));

    const leaves = await Leave.find({
      employeeId,
      status: LeaveStatus.APPROVED,
      startDate: {
        $gte: startDate,
        $lte: endDate,
      },
    }).lean();

    const usedLeaves = leaves.reduce((sum, leave) => sum + leave.days, 0);
    
    // Dynamically import Employee model to avoid circular dependencies if any
    const EmployeeModel = (await import('../models/Employee.model')).default;
    const employee = await EmployeeModel.findById(employeeId).lean();
    
    // Monthly allotment (default to 2 if not set)
    const monthlyAllotment = employee?.monthlyLeaveAllotment && employee.monthlyLeaveAllotment > 0 
      ? employee.monthlyLeaveAllotment 
      : 2;

    // Total accrued up to selected month
    const totalAccrued = monthlyAllotment * targetMonth;

    return {
      total: totalAccrued,
      used: usedLeaves,
      remaining: totalAccrued - usedLeaves,
    };
  },
};
