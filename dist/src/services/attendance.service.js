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
        today.setHours(0, 0, 0, 0);
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
    punchOut: async (employeeId) => {
        await (0, database_1.default)();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
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
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const totalDays = endDate.getDate();
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