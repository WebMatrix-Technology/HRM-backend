"use strict";
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
        return populatedLeave;
    },
    approveLeave: async (leaveId, approvedBy) => {
        await (0, database_1.default)();
        const leave = await Leave_model_1.default.findByIdAndUpdate(leaveId, {
            status: models_1.LeaveStatus.APPROVED,
            approvedBy,
            approvedAt: new Date(),
        }, { new: true });
        if (!leave) {
            throw new error_middleware_1.AppError('Leave not found', 404);
        }
        return leave;
    },
    rejectLeave: async (leaveId, approvedBy, rejectionReason) => {
        await (0, database_1.default)();
        const leave = await Leave_model_1.default.findByIdAndUpdate(leaveId, {
            status: models_1.LeaveStatus.REJECTED,
            approvedBy,
            approvedAt: new Date(),
            rejectionReason,
        }, { new: true });
        if (!leave) {
            throw new error_middleware_1.AppError('Leave not found', 404);
        }
        return leave;
    },
    getLeaves: async (employeeId, status) => {
        await (0, database_1.default)();
        const query = {};
        if (employeeId)
            query.employeeId = employeeId;
        if (status)
            query.status = status;
        const leaves = await Leave_model_1.default.find(query)
            .populate('employeeId', 'id firstName lastName employeeId')
            .sort({ createdAt: -1 })
            .lean();
        return leaves;
    },
    getLeaveBalance: async (employeeId) => {
        await (0, database_1.default)();
        const currentYear = new Date().getFullYear();
        const leaves = await Leave_model_1.default.find({
            employeeId,
            status: models_1.LeaveStatus.APPROVED,
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
//# sourceMappingURL=leave.service.js.map