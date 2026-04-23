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
            achievements: data.achievements || undefined,
        });
        const populatedPerformance = await Performance_model_1.default.findById(performance._id)
            .populate('employeeId', 'id firstName lastName employeeId')
            .lean();
        return populatedPerformance;
    },
    updatePerformance: async (id, data, reviewedBy, reviewerRole) => {
        await (0, database_1.default)();
        const existingPerformance = await Performance_model_1.default.findById(id).populate('employeeId');
        if (!existingPerformance) {
            throw new error_middleware_1.AppError('Performance review not found', 404);
        }
        const employeeIdObj = existingPerformance.employeeId;
        const targetUserId = employeeIdObj?.userId;
        if (targetUserId) {
            const User = require('../models/User.model').default;
            const targetUser = await User.findById(targetUserId);
            if (targetUser) {
                if (reviewerRole === 'HR_MANAGER' && (targetUser.role === 'ADMIN' || targetUser.role === 'HR_MANAGER')) {
                    throw new error_middleware_1.AppError('HR Manager cannot update performance for Admins or other HR Managers', 403);
                }
                if (reviewerRole === 'MANAGER' && targetUser.role !== 'EMPLOYEE') {
                    throw new error_middleware_1.AppError('Manager can only update performance reviews for Employees', 403);
                }
            }
        }
        const updateData = { ...data };
        if (data.rating !== undefined)
            updateData.rating = data.rating;
        if (data.kpis)
            updateData.kpis = data.kpis;
        if (data.goals)
            updateData.goals = data.goals;
        if (data.achievements)
            updateData.achievements = data.achievements;
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
            .populate({
            path: 'employeeId',
            select: 'id firstName lastName employeeId userId',
            populate: {
                path: 'userId',
                select: 'role'
            }
        })
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
    getAnalytics: async () => {
        await (0, database_1.default)();
        const performances = await Performance_model_1.default.find()
            .populate('employeeId', 'id firstName lastName employeeId department')
            .lean();
        const periodMap = new Map();
        const deptMap = new Map();
        const empMap = new Map();
        performances.forEach((p) => {
            if (typeof p.rating === 'number') {
                // Trend Data
                const periodStats = periodMap.get(p.reviewPeriod) || { total: 0, count: 0 };
                periodStats.total += p.rating;
                periodStats.count += 1;
                periodMap.set(p.reviewPeriod, periodStats);
                if (p.employeeId) {
                    // Department Data
                    const dept = p.employeeId.department || 'Unassigned';
                    const deptStats = deptMap.get(dept) || { total: 0, count: 0 };
                    deptStats.total += p.rating;
                    deptStats.count += 1;
                    deptMap.set(dept, deptStats);
                    // Employee Data
                    const empId = p.employeeId._id?.toString() || p.employeeId.id;
                    const empStats = empMap.get(empId) || { employee: p.employeeId, ratings: [] };
                    empStats.ratings.push(p.rating);
                    empMap.set(empId, empStats);
                }
            }
        });
        const trend = Array.from(periodMap.entries()).map(([period, stats]) => ({
            period,
            averageRating: parseFloat((stats.total / stats.count).toFixed(2)),
        })).sort((a, b) => a.period.localeCompare(b.period));
        const departmentAverages = Array.from(deptMap.entries()).map(([department, stats]) => ({
            department,
            averageRating: parseFloat((stats.total / stats.count).toFixed(2)),
        })).sort((a, b) => b.averageRating - a.averageRating);
        const topPerformers = Array.from(empMap.values())
            .map(emp => ({
            employee: emp.employee,
            averageRating: parseFloat((emp.ratings.reduce((a, b) => a + b, 0) / emp.ratings.length).toFixed(2)),
            reviewCount: emp.ratings.length,
        }))
            .filter(emp => emp.averageRating >= 4.0)
            .sort((a, b) => b.averageRating - a.averageRating)
            .slice(0, 10);
        return {
            trend,
            departmentAverages,
            topPerformers,
        };
    },
};
//# sourceMappingURL=performance.service.js.map