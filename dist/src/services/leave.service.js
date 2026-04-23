"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveService = void 0;
const database_1 = __importDefault(require("../config/database"));
const error_middleware_1 = require("../middlewares/error.middleware");
const models_1 = require("../models");
const Leave_model_1 = __importDefault(require("../models/Leave.model"));
exports.leaveService = {
    applyLeave: async (data) => {
        await (0, database_1.default)();
        // Calculate days
        const days = Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
        if (days <= 0) {
            throw new error_middleware_1.AppError('End date must be after start date', 400);
        }
        const leave = await Leave_model_1.default.create({
            ...data,
            days,
            status: models_1.LeaveStatus.PENDING,
        });
        const populatedLeave = await Leave_model_1.default.findById(leave._id)
            .populate('employeeId', 'id firstName lastName employeeId')
            .lean();
        return { ...populatedLeave, id: populatedLeave?._id };
    },
    approveLeave: async (leaveId, approvedBy, approverRole) => {
        await (0, database_1.default)();
        const leave = await Leave_model_1.default.findById(leaveId).populate('employeeId');
        if (!leave) {
            throw new error_middleware_1.AppError('Leave not found', 404);
        }
        const employeeIdObj = leave.employeeId;
        const targetUserId = employeeIdObj?.userId;
        if (targetUserId) {
            const User = require('../models/User.model').default;
            const targetUser = await User.findById(targetUserId);
            if (targetUser) {
                if (approverRole === 'HR_MANAGER' && (targetUser.role === 'ADMIN' || targetUser.role === 'HR_MANAGER')) {
                    throw new error_middleware_1.AppError('HR Manager cannot approve leaves for Admins or other HR Managers', 403);
                }
            }
        }
        leave.status = models_1.LeaveStatus.APPROVED;
        leave.approvedBy = approvedBy;
        leave.approvedAt = new Date();
        await leave.save();
        return { ...leave.toObject(), id: leave._id };
    },
    rejectLeave: async (leaveId, approvedBy, rejectionReason, approverRole) => {
        await (0, database_1.default)();
        const leave = await Leave_model_1.default.findById(leaveId).populate('employeeId');
        if (!leave) {
            throw new error_middleware_1.AppError('Leave not found', 404);
        }
        const employeeIdObj = leave.employeeId;
        const targetUserId = employeeIdObj?.userId;
        if (targetUserId) {
            const User = require('../models/User.model').default;
            const targetUser = await User.findById(targetUserId);
            if (targetUser) {
                if (approverRole === 'HR_MANAGER' && (targetUser.role === 'ADMIN' || targetUser.role === 'HR_MANAGER')) {
                    throw new error_middleware_1.AppError('HR Manager cannot reject leaves for Admins or other HR Managers', 403);
                }
            }
        }
        leave.status = models_1.LeaveStatus.REJECTED;
        leave.approvedBy = approvedBy;
        leave.approvedAt = new Date();
        leave.rejectionReason = rejectionReason;
        await leave.save();
        return { ...leave.toObject(), id: leave._id };
    },
    getLeaves: async (employeeId, status) => {
        await (0, database_1.default)();
        const query = {};
        if (employeeId)
            query.employeeId = employeeId;
        if (status)
            query.status = status;
        const leaves = await Leave_model_1.default.find(query)
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
        return leaves.map((l) => ({ ...l, id: l._id }));
    },
    getLeaveBalance: async (employeeId, month, year) => {
        await (0, database_1.default)();
        const targetMonth = month || new Date().getMonth() + 1;
        const targetYear = year || new Date().getFullYear();
        // End date of the target month
        const endDate = new Date(Date.UTC(targetYear, targetMonth, 0, 23, 59, 59, 999));
        // Start of the year
        const startDate = new Date(Date.UTC(targetYear, 0, 1));
        const leaves = await Leave_model_1.default.find({
            employeeId,
            status: models_1.LeaveStatus.APPROVED,
            startDate: {
                $gte: startDate,
                $lte: endDate,
            },
        }).lean();
        const usedLeaves = leaves.reduce((sum, leave) => sum + leave.days, 0);
        // Dynamically import Employee model to avoid circular dependencies if any
        const EmployeeModel = (await Promise.resolve().then(() => __importStar(require('../models/Employee.model')))).default;
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
//# sourceMappingURL=leave.service.js.map