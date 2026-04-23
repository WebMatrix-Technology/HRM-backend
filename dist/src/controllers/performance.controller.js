"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = exports.getPerformanceById = exports.getPerformances = exports.updatePerformance = exports.createPerformance = void 0;
const performance_service_1 = require("../services/performance.service");
const database_1 = __importDefault(require("../config/database"));
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
const notification_service_1 = require("../services/notification.service");
const User_model_1 = require("../models/User.model");
const createPerformance = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        await (0, database_1.default)();
        // Resolve the employee from the logged-in user
        const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
        if (!employee) {
            res.status(404).json({ error: 'Employee profile not found' });
            return;
        }
        const performance = await performance_service_1.performanceService.createPerformance({
            ...req.body,
            employeeId: employee._id.toString(), // Always override with the authenticated user's employee ID
        });
        // Notify HR and Admins that a new performance review is added
        notification_service_1.notificationService.notifyRoles([User_model_1.Role.ADMIN, User_model_1.Role.HR_MANAGER], {
            title: 'New Performance Review Submitted',
            message: `${employee.firstName} ${employee.lastName} has submitted a performance review for period ${req.body.reviewPeriod}.`,
            type: 'info',
            link: `/performance`
        }).catch(err => console.error('Failed to notify about performance review:', err));
        res.status(201).json({ message: 'Performance review created successfully', data: performance });
    }
    catch (error) {
        next(error);
    }
};
exports.createPerformance = createPerformance;
const updatePerformance = async (req, res, next) => {
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
        const performance = await performance_service_1.performanceService.updatePerformance(id, req.body, employee._id.toString(), req.user.role);
        // Notify the employee that their performance review has been updated (reviewed)
        if (performance && performance.employeeId) {
            const targetEmployee = await Employee_model_1.default.findById(performance.employeeId).select('userId');
            if (targetEmployee && targetEmployee.userId) {
                notification_service_1.notificationService.createNotification({
                    recipient: targetEmployee.userId,
                    title: 'Performance Review Updated',
                    message: `Your performance review for ${performance.reviewPeriod} has been reviewed/updated.`,
                    type: 'success',
                    link: `/performance`
                }).catch(err => console.error('Failed to notify employee about performance review update:', err));
            }
        }
        res.status(200).json({ message: 'Performance review updated successfully', data: performance });
    }
    catch (error) {
        next(error);
    }
};
exports.updatePerformance = updatePerformance;
const getPerformances = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        await (0, database_1.default)();
        let employeeId = req.query.employeeId;
        // Security: Regular employees can only see their own performance reviews
        if (req.user.role === User_model_1.Role.EMPLOYEE || req.user.role === User_model_1.Role.CLERK) {
            const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
            if (!employee) {
                res.status(404).json({ error: 'Employee profile not found' });
                return;
            }
            employeeId = employee._id.toString();
        }
        const performances = await performance_service_1.performanceService.getPerformances(employeeId);
        res.status(200).json({ data: performances });
    }
    catch (error) {
        next(error);
    }
};
exports.getPerformances = getPerformances;
const getPerformanceById = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        await (0, database_1.default)();
        const { id } = req.params;
        const performance = await performance_service_1.performanceService.getPerformanceById(id);
        if (!performance) {
            res.status(404).json({ error: 'Performance review not found' });
            return;
        }
        // Security check: Regular employees can only view their own reviews
        if (req.user.role === User_model_1.Role.EMPLOYEE || req.user.role === User_model_1.Role.CLERK) {
            const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
            if (!employee || performance.employeeId?._id?.toString() !== employee._id.toString()) {
                res.status(403).json({ error: 'Forbidden: You can only view your own performance reviews' });
                return;
            }
        }
        res.status(200).json({ data: performance });
    }
    catch (error) {
        next(error);
    }
};
exports.getPerformanceById = getPerformanceById;
const getAnalytics = async (_req, res, next) => {
    try {
        const analytics = await performance_service_1.performanceService.getAnalytics();
        res.status(200).json({ data: analytics });
    }
    catch (error) {
        next(error);
    }
};
exports.getAnalytics = getAnalytics;
//# sourceMappingURL=performance.controller.js.map