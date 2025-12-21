"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaveBalance = exports.getLeaves = exports.rejectLeave = exports.approveLeave = exports.applyLeave = void 0;
const leave_service_1 = require("../services/leave.service");
const database_1 = __importDefault(require("../config/database"));
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
const applyLeave = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        await (0, database_1.default)();
        const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
        if (!employee) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }
        const leave = await leave_service_1.leaveService.applyLeave({
            ...req.body,
            employeeId: employee._id.toString(),
            startDate: new Date(req.body.startDate),
            endDate: new Date(req.body.endDate),
        });
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
        const leave = await leave_service_1.leaveService.approveLeave(id, employee._id.toString());
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
        const leave = await leave_service_1.leaveService.rejectLeave(id, employee._id.toString(), rejectionReason);
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
        const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
        if (!employee) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }
        const balance = await leave_service_1.leaveService.getLeaveBalance(employee._id.toString());
        res.status(200).json({ data: balance });
    }
    catch (error) {
        next(error);
    }
};
exports.getLeaveBalance = getLeaveBalance;
//# sourceMappingURL=leave.controller.js.map