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
exports.exportAttendance = exports.getMonthlyReport = exports.getAttendance = exports.endBreak = exports.startBreak = exports.punchOut = exports.punchIn = void 0;
const attendance_service_1 = require("../services/attendance.service");
const database_1 = __importDefault(require("../config/database"));
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
const punchIn = async (req, res, next) => {
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
        const workFromHome = req.body.workFromHome || false;
        const attendance = await attendance_service_1.attendanceService.punchIn(employee._id.toString(), workFromHome);
        res.status(200).json({ message: 'Punched in successfully', data: attendance });
    }
    catch (error) {
        next(error);
    }
};
exports.punchIn = punchIn;
const punchOut = async (req, res, next) => {
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
        const idleTime = req.body.idleTime ? parseInt(req.body.idleTime, 10) : 0;
        const attendance = await attendance_service_1.attendanceService.punchOut(employee._id.toString(), idleTime);
        res.status(200).json({ message: 'Punched out successfully', data: attendance });
    }
    catch (error) {
        next(error);
    }
};
exports.punchOut = punchOut;
const startBreak = async (req, res, next) => {
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
        const attendance = await attendance_service_1.attendanceService.startBreak(employee._id.toString());
        res.status(200).json({ message: 'Break started successfully', data: attendance });
    }
    catch (error) {
        next(error);
    }
};
exports.startBreak = startBreak;
const endBreak = async (req, res, next) => {
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
        const attendance = await attendance_service_1.attendanceService.endBreak(employee._id.toString());
        res.status(200).json({ message: 'Break ended successfully', data: attendance });
    }
    catch (error) {
        next(error);
    }
};
exports.endBreak = endBreak;
const getAttendance = async (req, res, next) => {
    try {
        await (0, database_1.default)();
        let employeeId = req.params.employeeId;
        if (!employeeId && req.user) {
            const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
            employeeId = employee?._id.toString();
        }
        if (!employeeId) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }
        const startDate = new Date(req.query.startDate || new Date().toISOString().split('T')[0]);
        startDate.setUTCHours(0, 0, 0, 0);
        const endDate = new Date(req.query.endDate || new Date().toISOString().split('T')[0]);
        endDate.setUTCHours(23, 59, 59, 999);
        const attendances = await attendance_service_1.attendanceService.getAttendance(employeeId, startDate, endDate);
        res.status(200).json({ data: attendances });
    }
    catch (error) {
        next(error);
    }
};
exports.getAttendance = getAttendance;
const getMonthlyReport = async (req, res, next) => {
    try {
        await (0, database_1.default)();
        let employeeId = req.params.employeeId;
        if (!employeeId && req.user) {
            const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
            employeeId = employee?._id.toString();
        }
        if (!employeeId) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const report = await attendance_service_1.attendanceService.getMonthlyReport(employeeId, month, year);
        res.status(200).json({ data: report });
    }
    catch (error) {
        next(error);
    }
};
exports.getMonthlyReport = getMonthlyReport;
const exportAttendance = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        await (0, database_1.default)();
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const startDate = new Date(Date.UTC(year, month - 1, 1));
        const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
        let filter = {
            date: {
                $gte: startDate,
                $lte: endDate,
            },
        };
        // If a specific employeeId is requested, use it (admins/HR can filter by user)
        const requestedEmployeeId = req.query.employeeId;
        if (requestedEmployeeId) {
            // Admin/HR requesting a specific employee
            filter.employeeId = requestedEmployeeId;
        }
        else if (req.user.role !== 'ADMIN' && req.user.role !== 'HR_MANAGER') {
            // Non-admin users can only export their own data
            const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
            if (!employee) {
                res.status(404).json({ error: 'Employee not found' });
                return;
            }
            filter.employeeId = employee._id;
        }
        // else: admins/HR without a specific employeeId get ALL employees
        // @ts-ignore
        const AttendanceModel = (await Promise.resolve().then(() => __importStar(require('../models/Attendance.model')))).default;
        const attendances = await AttendanceModel.find(filter)
            .populate('employeeId', 'employeeId firstName lastName department')
            .sort({ date: 1 })
            .lean();
        const csvRows = [];
        csvRows.push(['Date', 'Employee ID', 'Name', 'Department', 'Status', 'Punch In', 'Punch Out', 'Work From Home', 'Productive Time (s)'].join(','));
        for (const record of attendances) {
            const emp = record.employeeId;
            const dateStr = record.date ? new Date(record.date).toISOString().split('T')[0] : '';
            const punchInStr = record.punchIn ? new Date(record.punchIn).toLocaleTimeString() : '';
            const punchOutStr = record.punchOut ? new Date(record.punchOut).toLocaleTimeString() : '';
            const row = [
                dateStr,
                emp?.employeeId || '',
                `${emp?.firstName || ''} ${emp?.lastName || ''}`,
                emp?.department || '',
                record.status,
                punchInStr,
                punchOutStr,
                record.workFromHome ? 'Yes' : 'No',
                record.productiveTime || 0
            ];
            const escapedRow = row.map(cell => {
                const cellStr = String(cell);
                return cellStr.includes(',') ? `"${cellStr}"` : cellStr;
            });
            csvRows.push(escapedRow.join(','));
        }
        const csvString = csvRows.join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=attendance_export_${year}_${month}.csv`);
        res.status(200).send(csvString);
    }
    catch (error) {
        next(error);
    }
};
exports.exportAttendance = exportAttendance;
//# sourceMappingURL=attendance.controller.js.map