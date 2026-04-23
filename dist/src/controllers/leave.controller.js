"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaveBalance = exports.getLeaves = exports.rejectLeave = exports.approveLeave = exports.applyLeave = void 0;
const leave_service_1 = require("../services/leave.service");
const database_1 = __importDefault(require("../config/database"));
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
const notification_service_1 = require("../services/notification.service");
const User_model_1 = require("../models/User.model");
const applyLeave = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        await (0, database_1.default)();
        let employeeId = '';
        // Check if privileged user is assigning leave to someone else
        if (req.body.employeeId && (req.user.role === 'HR_MANAGER' || req.user.role === 'ADMIN')) {
            const targetEmployee = await Employee_model_1.default.findOne({ employeeId: req.body.employeeId });
            if (!targetEmployee) {
                res.status(404).json({ error: 'Target employee not found' });
                return;
            }
            employeeId = targetEmployee._id.toString();
        }
        else {
            // Default to applying for self
            const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
            if (!employee) {
                res.status(404).json({ error: 'Employee not found' });
                return;
            }
            employeeId = employee._id.toString();
        }
        const leave = await leave_service_1.leaveService.applyLeave({
            ...req.body,
            employeeId,
            startDate: new Date(req.body.startDate),
            endDate: new Date(req.body.endDate),
        });
        // Notify HR and Admins
        notification_service_1.notificationService.notifyRoles([User_model_1.Role.ADMIN, User_model_1.Role.HR_MANAGER], {
            title: 'New Leave Application',
            message: `A new leave request has been submitted and requires review.`,
            type: 'info',
            link: `/leave`
        }).catch(err => console.error('Failed to notify about leave application:', err));
        res.status(201).json({ message: 'Leave applied successfully', data: leave });
    }
    catch (error) {
        next(error);
    }
};
exports.applyLeave = applyLeave;
const approveLeave = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { id } = req.params;
        await (0, database_1.default)();
        const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
        if (!employee) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }
        const leave = await leave_service_1.leaveService.approveLeave(id, employee._id.toString(), req.user.role);
        // Notify employee
        if (leave.employeeId && leave.employeeId.userId) {
            notification_service_1.notificationService.createNotification({
                recipient: leave.employeeId.userId.toString(),
                title: 'Leave Approved',
                message: `Your leave request from ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(leave.endDate).toLocaleDateString()} has been approved.`,
                type: 'success',
                link: '/leave'
            }).catch(err => console.error('Failed to notify employee about leave approval:', err));
        }
        res.status(200).json({ message: 'Leave approved successfully', data: leave });
    }
    catch (error) {
        next(error);
    }
};
exports.approveLeave = approveLeave;
const rejectLeave = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { id } = req.params;
        const { rejectionReason } = req.body;
        await (0, database_1.default)();
        const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
        if (!employee) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }
        const leave = await leave_service_1.leaveService.rejectLeave(id, employee._id.toString(), rejectionReason, req.user.role);
        // Notify employee
        if (leave.employeeId && leave.employeeId.userId) {
            notification_service_1.notificationService.createNotification({
                recipient: leave.employeeId.userId.toString(),
                title: 'Leave Rejected',
                message: `Your leave request from ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(leave.endDate).toLocaleDateString()} has been rejected${rejectionReason ? `: ${rejectionReason}` : '.'}`,
                type: 'error',
                link: '/leave'
            }).catch(err => console.error('Failed to notify employee about leave rejection:', err));
        }
        res.status(200).json({ message: 'Leave rejected successfully', data: leave });
    }
    catch (error) {
        next(error);
    }
};
exports.rejectLeave = rejectLeave;
const getLeaves = async (req, res, next) => {
    try {
        const employeeId = req.query.employeeId;
        const status = req.query.status;
        const leaves = await leave_service_1.leaveService.getLeaves(employeeId, status);
        res.status(200).json({ data: leaves });
    }
    catch (error) {
        next(error);
    }
};
exports.getLeaves = getLeaves;
const getLeaveBalance = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        await (0, database_1.default)();
        let employeeId = '';
        const requestedEmployeeId = req.query.employeeId;
        const month = req.query.month ? parseInt(req.query.month) : undefined;
        const year = req.query.year ? parseInt(req.query.year) : undefined;
        // Admin/HR can check balance for any employee
        if (requestedEmployeeId && (req.user.role === 'ADMIN' || req.user.role === 'HR_MANAGER')) {
            employeeId = requestedEmployeeId;
        }
        else {
            // Regular employees can only check their own balance
            const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
            if (!employee) {
                res.status(404).json({ error: 'Employee not found' });
                return;
            }
            employeeId = employee._id.toString();
        }
        const balance = await leave_service_1.leaveService.getLeaveBalance(employeeId, month, year);
        res.status(200).json({ data: balance });
    }
    catch (error) {
        next(error);
    }
};
exports.getLeaveBalance = getLeaveBalance;
//# sourceMappingURL=leave.controller.js.map