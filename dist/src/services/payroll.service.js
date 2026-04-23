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
exports.payrollService = void 0;
const database_1 = __importDefault(require("../config/database"));
const error_middleware_1 = require("../middlewares/error.middleware");
const Payroll_model_1 = __importStar(require("../models/Payroll.model"));
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
const Attendance_model_1 = __importDefault(require("../models/Attendance.model"));
const leave_service_1 = require("./leave.service");
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
            (data.hra || 0) +
            (data.specialAllowance || 0) +
            (data.travelAllowance || 0) -
            (data.deductions || 0) -
            (data.pf || 0) -
            (data.tds || 0);
        const payroll = await Payroll_model_1.default.create({
            ...data,
            netSalary: netSalary,
            status: Payroll_model_1.PayrollStatus.PROCESSED,
        });
        const populatedPayroll = await Payroll_model_1.default.findById(payroll._id)
            .populate('employeeId', 'id firstName lastName employeeId')
            .lean();
        return populatedPayroll;
    },
    getPayrolls: async (employeeId, month, year, userId) => {
        await (0, database_1.default)();
        const query = {};
        if (employeeId)
            query.employeeId = employeeId;
        if (month)
            query.month = month;
        if (year)
            query.year = year;
        // If userId is provided, find the employee first
        if (userId) {
            const employee = await Employee_model_1.default.findOne({ userId });
            if (employee) {
                query.employeeId = employee._id;
            }
            else {
                return []; // User has no employee record
            }
        }
        const payrolls = await Payroll_model_1.default.find(query)
            .populate('employeeId', 'id firstName lastName employeeId department position joiningDate pan bankDetails email')
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
            status: Payroll_model_1.PayrollStatus.PAID,
            paidAt: new Date(),
        }, { new: true });
        if (!payroll) {
            throw new error_middleware_1.AppError('Payroll not found', 404);
        }
        return payroll;
    },
    calculatePayroll: async (employeeId, month, year) => {
        await (0, database_1.default)();
        const employee = await Employee_model_1.default.findById(employeeId);
        if (!employee) {
            throw new error_middleware_1.AppError('Employee not found', 404);
        }
        // Default to 0 if salary isn't set, though it should be for payroll
        const basicSalary = employee.basicSalary ?? employee.salary ?? 0;
        const hra = employee.hra || 0;
        const specialAllowance = employee.specialAllowance || 0;
        const travelAllowance = employee.travelAllowance || 0;
        const tds = employee.tds || 0;
        const dbPf = employee.pf;
        // Fetch attendance report for the month to calculate deductions
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const totalDaysInMonth = endDate.getDate();
        const attendances = await Attendance_model_1.default.find({
            employeeId,
            date: {
                $gte: startDate,
                $lte: endDate,
            },
        }).lean();
        const absentDays = attendances.filter((a) => a.status === 'ABSENT').length;
        // Sum up all idle time in seconds
        const totalIdleSeconds = attendances.reduce((acc, curr) => acc + (curr.idleTime || 0), 0);
        const totalIdleHours = totalIdleSeconds / 3600;
        // Fetch Leave Balance
        const leaveBalance = await leave_service_1.leaveService.getLeaveBalance(employeeId, month, year);
        // Loss of Pay (LOP) days are when remaining balance is negative
        const lopDays = leaveBalance.remaining < 0 ? Math.abs(leaveBalance.remaining) : 0;
        // Calculations
        const perDaySalary = basicSalary / totalDaysInMonth;
        const perHourSalary = perDaySalary / 8; // Assuming 8-hour workday
        const absentDeduction = absentDays * perDaySalary;
        const idleDeduction = totalIdleHours * perHourSalary;
        const leaveDeduction = lopDays * perDaySalary;
        // Round deductions to 2 decimal places
        const totalDeductions = Math.round((absentDeduction + idleDeduction + leaveDeduction) * 100) / 100;
        // Mock standard PF deduction (12% of basic)
        const pf = dbPf ?? (Math.round(basicSalary * 0.12 * 100) / 100);
        return {
            basicSalary,
            hra,
            specialAllowance,
            travelAllowance,
            deductions: totalDeductions,
            absentDays,
            leaveDeduction: Math.round(leaveDeduction * 100) / 100,
            idleDeduction: Math.round(idleDeduction * 100) / 100,
            pf,
            tds,
            metrics: {
                absentDays,
                lopDays,
                idleHours: Math.round(totalIdleHours * 10) / 10,
                absentDeduction: Math.round(absentDeduction * 100) / 100,
                idleDeduction: Math.round(idleDeduction * 100) / 100,
                leaveDeduction: Math.round(leaveDeduction * 100) / 100,
            }
        };
    }
};
//# sourceMappingURL=payroll.service.js.map