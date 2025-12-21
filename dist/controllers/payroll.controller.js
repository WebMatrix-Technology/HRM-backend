"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsPaid = exports.getPayrollById = exports.getPayrolls = exports.processPayroll = void 0;
const payroll_service_1 = require("../services/payroll.service");
const processPayroll = async (req, res, next) => {
    try {
        const payroll = await payroll_service_1.payrollService.processPayroll(req.body);
        res.status(201).json({ message: 'Payroll processed successfully', data: payroll });
    }
    catch (error) {
        next(error);
    }
};
exports.processPayroll = processPayroll;
const getPayrolls = async (req, res, next) => {
    try {
        const employeeId = req.query.employeeId;
        const month = req.query.month ? parseInt(req.query.month) : undefined;
        const year = req.query.year ? parseInt(req.query.year) : undefined;
        const payrolls = await payroll_service_1.payrollService.getPayrolls(employeeId, month, year);
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
//# sourceMappingURL=payroll.controller.js.map