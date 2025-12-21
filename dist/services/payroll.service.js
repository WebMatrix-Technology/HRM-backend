"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payrollService = void 0;
const database_1 = __importDefault(require("../config/database"));
const error_middleware_1 = require("../middlewares/error.middleware");
const models_1 = require("../models");
const Payroll_model_1 = __importDefault(require("../models/Payroll.model"));
exports.payrollService = {
    processPayroll: async (data) => {
        await (0, database_1.default)();
        // Check if payroll already exists
        const existing = await Payroll_model_1.default.findOne({
            employeeId: data.employeeId,
            month: data.month,
            year: data.year,
        });
        if (existing) {
            throw new error_middleware_1.AppError('Payroll already processed for this month', 400);
        }
        const netSalary = data.basicSalary +
            (data.allowances || 0) -
            (data.deductions || 0) -
            (data.pf || 0) -
            (data.esic || 0) -
            (data.tds || 0);
        const payroll = await Payroll_model_1.default.create({
            ...data,
            basicSalary: data.basicSalary,
            allowances: data.allowances || 0,
            deductions: data.deductions || 0,
            pf: data.pf || undefined,
            esic: data.esic || undefined,
            tds: data.tds || undefined,
            netSalary: netSalary,
            status: models_1.PayrollStatus.PROCESSED,
        });
        const populatedPayroll = await Payroll_model_1.default.findById(payroll._id)
            .populate('employeeId', 'id firstName lastName employeeId')
            .lean();
        return populatedPayroll;
    },
    getPayrolls: async (employeeId, month, year) => {
        await (0, database_1.default)();
        const query = {};
        if (employeeId)
            query.employeeId = employeeId;
        if (month)
            query.month = month;
        if (year)
            query.year = year;
        const payrolls = await Payroll_model_1.default.find(query)
            .populate('employeeId', 'id firstName lastName employeeId')
            .sort({ year: -1, month: -1 })
            .lean();
        return payrolls;
    },
    getPayrollById: async (id) => {
        await (0, database_1.default)();
        const payroll = await Payroll_model_1.default.findById(id)
            .populate('employeeId', 'id firstName lastName employeeId')
            .lean();
        if (!payroll) {
            throw new error_middleware_1.AppError('Payroll not found', 404);
        }
        return payroll;
    },
    markAsPaid: async (id) => {
        await (0, database_1.default)();
        const payroll = await Payroll_model_1.default.findByIdAndUpdate(id, {
            status: models_1.PayrollStatus.PAID,
            paidAt: new Date(),
        }, { new: true });
        if (!payroll) {
            throw new error_middleware_1.AppError('Payroll not found', 404);
        }
        return payroll;
    },
};
//# sourceMappingURL=payroll.service.js.map