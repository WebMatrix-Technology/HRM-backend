"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthlyReport = exports.getAttendance = exports.punchOut = exports.punchIn = void 0;
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
        const attendance = await attendance_service_1.attendanceService.punchOut(employee._id.toString());
        res.status(200).json({ message: 'Punched out successfully', data: attendance });
    }
    catch (error) {
        next(error);
    }
};
exports.punchOut = punchOut;
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
        const endDate = new Date(req.query.endDate || new Date().toISOString().split('T')[0]);
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
//# sourceMappingURL=attendance.controller.js.map