"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performanceService = void 0;
const database_1 = __importDefault(require("../config/database"));
const error_middleware_1 = require("../middlewares/error.middleware");
const Performance_model_1 = __importDefault(require("../models/Performance.model"));
exports.performanceService = {
    createPerformance: async (data) => {
        await (0, database_1.default)();
        const performance = await Performance_model_1.default.create({
            ...data,
            rating: data.rating || undefined,
            kpis: data.kpis || undefined,
            goals: data.goals || undefined,
        });
        const populatedPerformance = await Performance_model_1.default.findById(performance._id)
            .populate('employeeId', 'id firstName lastName employeeId')
            .lean();
        return populatedPerformance;
    },
    updatePerformance: async (id, data, reviewedBy) => {
        await (0, database_1.default)();
        const updateData = { ...data };
        if (data.rating !== undefined)
            updateData.rating = data.rating;
        if (data.kpis)
            updateData.kpis = data.kpis;
        if (data.goals)
            updateData.goals = data.goals;
        updateData.reviewedBy = reviewedBy;
        updateData.reviewedAt = new Date();
        const performance = await Performance_model_1.default.findByIdAndUpdate(id, updateData, {
            new: true,
        })
            .populate('employeeId', 'id firstName lastName employeeId')
            .lean();
        if (!performance) {
            throw new error_middleware_1.AppError('Performance review not found', 404);
        }
        return performance;
    },
    getPerformances: async (employeeId) => {
        await (0, database_1.default)();
        const query = {};
        if (employeeId)
            query.employeeId = employeeId;
        const performances = await Performance_model_1.default.find(query)
            .populate('employeeId', 'id firstName lastName employeeId')
            .sort({ createdAt: -1 })
            .lean();
        return performances;
    },
    getPerformanceById: async (id) => {
        await (0, database_1.default)();
        const performance = await Performance_model_1.default.findById(id)
            .populate('employeeId', 'id firstName lastName employeeId')
            .lean();
        if (!performance) {
            throw new error_middleware_1.AppError('Performance review not found', 404);
        }
        return performance;
    },
};
//# sourceMappingURL=performance.service.js.map