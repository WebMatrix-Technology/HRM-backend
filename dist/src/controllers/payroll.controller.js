"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePayroll = exports.markAsPaid = exports.getPayrollById = exports.getPayrolls = exports.processPayroll = void 0;
const payroll_service_1 = require("../services/payroll.service");
const types_1 = require("../types");
const notification_service_1 = require("../services/notification.service");
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
const processPayroll = async (req, res, next) => {
    try {
        const payroll = await payroll_service_1.payrollService.processPayroll(req.body);
        // Notify the employee that their payroll has been processed
        if (payroll && payroll.employeeId) {
            // payroll.employeeId might be an ID or a populated object. 
            // If it's the result of processPayroll, it's populated with { id, firstName, ... }
            const empId = payroll.employeeId._id || payroll.employeeId.id || payroll.employeeId;
            Employee_model_1.default.findById(empId).select('userId').then(emp => {
                if (emp && emp.userId) {
                    notification_service_1.notificationService.createNotification({
                        recipient: emp.userId,
                        title: 'Payroll Processed',
                        message: `Your payroll for ${payroll.month}/${payroll.year} has been processed.`,
                        type: 'success',
                        link: `/payroll`
                    });
                }
            }).catch(err => console.error('Failed to notify employee about payroll:', err));
        }
        res.status(201).json({ message: 'Payroll processed successfully', data: payroll });
    }
    catch (error) {
        next(error);
    }
};
exports.processPayroll = processPayroll;
const getPayrolls = async (req, res, next) => {
    try {
        let employeeId = req.query.employeeId;
        const month = req.query.month ? parseInt(req.query.month) : undefined;
        const year = req.query.year ? parseInt(req.query.year) : undefined;
        // Access Control
        let targetUserId;
        if (req.user?.role !== types_1.Role.ADMIN && req.user?.role !== types_1.Role.HR_MANAGER) {
            // For non-privileged users, force them to view only their own payrolls
            targetUserId = req.user?.userId;
            employeeId = undefined; // Ignore specific employeeId query
        }
        const payrolls = await payroll_service_1.payrollService.getPayrolls(employeeId, month, year, targetUserId);
        res.status(200).json({ data: payrolls });
    }
    catch (error) {
        next(error);
    }
};
exports.getPayrolls = getPayrolls;
const getPayrollById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const payroll = await payroll_service_1.payrollService.getPayrollById(id);
        res.status(200).json({ data: payroll });
    }
    catch (error) {
        next(error);
    }
};
exports.getPayrollById = getPayrollById;
const markAsPaid = async (req, res, next) => {
    try {
        const { id } = req.params;
        const payroll = await payroll_service_1.payrollService.markAsPaid(id);
        res.status(200).json({ message: 'Payroll marked as paid', data: payroll });
    }
    catch (error) {
        next(error);
    }
};
exports.markAsPaid = markAsPaid;
const calculatePayroll = async (req, res, next) => {
    try {
        const { employeeId } = req.params;
        const month = req.query.month ? parseInt(req.query.month) : new Date().getMonth() + 1;
        const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
        const calculationDetails = await payroll_service_1.payrollService.calculatePayroll(employeeId, month, year);
        res.status(200).json({ data: calculationDetails });
    }
    catch (error) {
        next(error);
    }
};
exports.calculatePayroll = calculatePayroll;
//# sourceMappingURL=payroll.controller.js.map