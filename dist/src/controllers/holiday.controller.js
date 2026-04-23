"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHoliday = exports.getHolidays = exports.createHoliday = void 0;
const Holiday_model_1 = __importDefault(require("../models/Holiday.model"));
const error_middleware_1 = require("../middlewares/error.middleware");
const types_1 = require("../types");
const createHoliday = async (req, res, next) => {
    try {
        const { title, date, type, description, isRecurring } = req.body;
        // Only HR/Admin can create
        if (req.user?.role !== types_1.Role.HR_MANAGER && req.user?.role !== types_1.Role.ADMIN) {
            throw new error_middleware_1.AppError('Unauthorized', 403);
        }
        const newHoliday = await Holiday_model_1.default.create({
            title,
            date: new Date(date),
            type,
            description,
            isRecurring,
            createdBy: req.user.userId,
        });
        res.status(201).json({ success: true, data: newHoliday });
    }
    catch (error) {
        next(error);
    }
};
exports.createHoliday = createHoliday;
const getHolidays = async (req, res, next) => {
    try {
        const { year, month } = req.query;
        const query = {};
        if (year) {
            const startDate = new Date(`${year}-01-01`);
            const endDate = new Date(`${year}-12-31`);
            query.date = { $gte: startDate, $lte: endDate };
            if (month) {
                const m = parseInt(month) - 1; // 0-indexed
                const startMonth = new Date(parseInt(year), m, 1);
                const endMonth = new Date(parseInt(year), m + 1, 0); // Last day of month
                query.date = { $gte: startMonth, $lte: endMonth };
            }
        }
        const holidays = await Holiday_model_1.default.find(query).sort({ date: 1 });
        res.status(200).json({ success: true, data: holidays });
    }
    catch (error) {
        next(error);
    }
};
exports.getHolidays = getHolidays;
const deleteHoliday = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (req.user?.role !== types_1.Role.HR_MANAGER && req.user?.role !== types_1.Role.ADMIN) {
            throw new error_middleware_1.AppError('Unauthorized', 403);
        }
        const holiday = await Holiday_model_1.default.findByIdAndDelete(id);
        if (!holiday) {
            throw new error_middleware_1.AppError('Holiday not found', 404);
        }
        res.status(200).json({ success: true, message: 'Holiday deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteHoliday = deleteHoliday;
//# sourceMappingURL=holiday.controller.js.map