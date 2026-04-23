"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceService = void 0;
const database_1 = __importDefault(require("../config/database"));
const error_middleware_1 = require("../middlewares/error.middleware");
const models_1 = require("../models");
const Attendance_model_1 = __importDefault(require("../models/Attendance.model"));
exports.attendanceService = {
    punchIn: async (employeeId, workFromHome = false) => {
        await (0, database_1.default)();
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        // Check if already punched in today
        const existing = await Attendance_model_1.default.findOne({
            employeeId,
            date: today,
        });
        if (existing?.punchIn) {
            throw new error_middleware_1.AppError('Already punched in today', 400);
        }
        const attendance = await Attendance_model_1.default.findOneAndUpdate({
            employeeId,
            date: today,
        }, {
            $set: {
                punchIn: new Date(),
                workFromHome,
                status: models_1.AttendanceStatus.PRESENT,
            },
        }, {
            upsert: true,
            new: true,
        });
        return attendance;
    },
    punchOut: async (employeeId, idleTime = 0) => {
        await (0, database_1.default)();
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const attendance = await Attendance_model_1.default.findOne({
            employeeId,
            date: today,
        });
        if (!attendance) {
            throw new error_middleware_1.AppError('No punch in record found for today', 400);
        }
        if (attendance.punchOut) {
            throw new error_middleware_1.AppError('Already punched out today', 400);
        }
        attendance.punchOut = new Date();
        attendance.idleTime = idleTime;
        // Calculate productive time (total seconds - idle seconds)
        if (attendance.punchIn) {
            const totalElapsedSeconds = Math.floor((attendance.punchOut.getTime() - attendance.punchIn.getTime()) / 1000);
            attendance.productiveTime = Math.max(0, totalElapsedSeconds - idleTime);
        }
        await attendance.save();
        return attendance;
    },
    startBreak: async (employeeId) => {
        await (0, database_1.default)();
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const attendance = await Attendance_model_1.default.findOne({
            employeeId,
            date: today,
        });
        if (!attendance) {
            throw new error_middleware_1.AppError('No punch in record found for today', 400);
        }
        if (attendance.punchOut) {
            throw new error_middleware_1.AppError('Already punched out today', 400);
        }
        if (!attendance.breaks) {
            attendance.breaks = [];
        }
        // Check if a break is already active
        const activeBreak = attendance.breaks.find((b) => !b.endTime);
        if (activeBreak) {
            throw new error_middleware_1.AppError('Already on a break', 400);
        }
        attendance.breaks.push({ startTime: new Date() });
        await attendance.save();
        return attendance;
    },
    endBreak: async (employeeId) => {
        await (0, database_1.default)();
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const attendance = await Attendance_model_1.default.findOne({
            employeeId,
            date: today,
        });
        if (!attendance) {
            throw new error_middleware_1.AppError('No punch in record found for today', 400);
        }
        if (attendance.punchOut) {
            throw new error_middleware_1.AppError('Already punched out today', 400);
        }
        if (!attendance.breaks || attendance.breaks.length === 0) {
            throw new error_middleware_1.AppError('No active break found', 400);
        }
        const activeBreak = attendance.breaks.find((b) => !b.endTime);
        if (!activeBreak) {
            throw new error_middleware_1.AppError('No active break found', 400);
        }
        activeBreak.endTime = new Date();
        await attendance.save();
        return attendance;
    },
    getAttendance: async (employeeId, startDate, endDate) => {
        await (0, database_1.default)();
        const attendances = await Attendance_model_1.default.find({
            employeeId,
            date: {
                $gte: startDate,
                $lte: endDate,
            },
        })
            .sort({ date: -1 })
            .lean();
        return attendances;
    },
    getMonthlyReport: async (employeeId, month, year) => {
        await (0, database_1.default)();
        const startDate = new Date(Date.UTC(year, month - 1, 1));
        const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
        const totalDays = new Date(year, month, 0).getDate();
        const attendances = await Attendance_model_1.default.find({
            employeeId,
            date: {
                $gte: startDate,
                $lte: endDate,
            },
        })
            .sort({ date: -1 })
            .lean();
        const presentDays = attendances.filter((a) => a.status === models_1.AttendanceStatus.PRESENT).length;
        const absentDays = attendances.filter((a) => a.status === models_1.AttendanceStatus.ABSENT).length;
        const lateDays = attendances.filter((a) => a.status === models_1.AttendanceStatus.LATE).length;
        const wfhDays = attendances.filter((a) => a.workFromHome).length;
        return {
            totalDays,
            presentDays,
            absentDays,
            lateDays,
            wfhDays,
            attendances,
        };
    },
};
//# sourceMappingURL=attendance.service.js.map