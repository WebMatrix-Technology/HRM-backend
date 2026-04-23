"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployeeStats = exports.getPayrollSummary = exports.getAttendanceSummary = void 0;
const database_1 = __importDefault(require("../config/database"));
const Attendance_model_1 = __importDefault(require("../models/Attendance.model"));
const Payroll_model_1 = __importDefault(require("../models/Payroll.model"));
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const getAttendanceSummary = async (req, res, next) => {
    try {
        await (0, database_1.default)();
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        // Get all attendances in the date range
        const attendances = await Attendance_model_1.default.find({
            date: {
                $gte: startDate,
                $lte: endDate,
            },
        })
            .select('status')
            .lean();
        // Group by status manually
        const summary = attendances.reduce((acc, attendance) => {
            const status = attendance.status;
            if (!acc[status]) {
                acc[status] = 0;
            }
            acc[status]++;
            return acc;
        }, {});
        const result = Object.entries(summary).map(([status, _count]) => ({
            status,
            _count: { _all: _count },
        }));
        res.status(200).json({ data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.getAttendanceSummary = getAttendanceSummary;
const getPayrollSummary = async (req, res, next) => {
    try {
        await (0, database_1.default)();
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const payrolls = await Payroll_model_1.default.find({
            month,
            year,
        }).lean();
        const totalSalary = payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);
        const totalEmployees = payrolls.length;
        res.status(200).json({
            data: {
                month,
                year,
                totalSalary,
                totalEmployees,
                payrolls,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getPayrollSummary = getPayrollSummary;
const getEmployeeStats = async (_req, res, next) => {
    try {
        await (0, database_1.default)();
        const [total, active, employees, users] = await Promise.all([
            Employee_model_1.default.countDocuments(),
            Employee_model_1.default.countDocuments({ isActive: true }),
            Employee_model_1.default.find({ department: { $ne: null } })
                .select('department')
                .lean(),
            User_model_1.default.find().select('role').lean(),
        ]);
        // Group by department manually
        const byDepartmentMap = employees.reduce((acc, emp) => {
            const dept = emp.department;
            if (dept) {
                if (!acc[dept]) {
                    acc[dept] = 0;
                }
                acc[dept]++;
            }
            return acc;
        }, {});
        const byDepartment = Object.entries(byDepartmentMap).map(([department, _count]) => ({
            department,
            _count: { _all: _count },
        }));
        // Group by role manually
        const byRoleMap = users.reduce((acc, user) => {
            const role = user.role;
            if (!acc[role]) {
                acc[role] = 0;
            }
            acc[role]++;
            return acc;
        }, {});
        const byRole = Object.entries(byRoleMap).map(([role, _count]) => ({
            role,
            _count: { _all: _count },
        }));
        res.status(200).json({
            data: {
                total,
                active,
                inactive: total - active,
                byDepartment,
                byRole,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getEmployeeStats = getEmployeeStats;
//# sourceMappingURL=reports.controller.js.map