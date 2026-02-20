import connectDB from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import Performance from '../models/Performance.model';

export interface CreatePerformanceData {
  employeeId: string;
  reviewPeriod: string;
  kpis?: any;
  goals?: any;
  rating?: number;
  feedback?: string;
}

export const performanceService = {
  createPerformance: async (data: CreatePerformanceData) => {
    await connectDB();

    const performance = await Performance.create({
      ...data,
      rating: data.rating || undefined,
      kpis: data.kpis || undefined,
      goals: data.goals || undefined,
    });

    const populatedPerformance = await Performance.findById(performance._id)
      .populate('employeeId', 'id firstName lastName employeeId')
      .lean();

    return populatedPerformance;
  },

  updatePerformance: async (id: string, data: Partial<CreatePerformanceData>, reviewedBy: string) => {
    await connectDB();

    const updateData: any = { ...data };
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.kpis) updateData.kpis = data.kpis;
    if (data.goals) updateData.goals = data.goals;
    updateData.reviewedBy = reviewedBy;
    updateData.reviewedAt = new Date();

    const performance = await Performance.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate('employeeId', 'id firstName lastName employeeId')
      .lean();

    if (!performance) {
      throw new AppError('Performance review not found', 404);
    }

    return performance;
  },

  getPerformances: async (employeeId?: string) => {
    await connectDB();

    const query: any = {};
    if (employeeId) query.employeeId = employeeId;

    const performances = await Performance.find(query)
      .populate('employeeId', 'id firstName lastName employeeId')
      .sort({ createdAt: -1 })
      .lean();

    return performances;
  },

  getPerformanceById: async (id: string) => {
    await connectDB();

    const performance = await Performance.findById(id)
      .populate('employeeId', 'id firstName lastName employeeId')
      .lean();

    if (!performance) {
      throw new AppError('Performance review not found', 404);
    }

    return performance;
  },

  getAnalytics: async () => {
    await connectDB();
    const performances = await Performance.find()
      .populate('employeeId', 'id firstName lastName employeeId department')
      .lean();

    const periodMap = new Map<string, { total: number; count: number }>();
    const deptMap = new Map<string, { total: number; count: number }>();
    const empMap = new Map<string, { employee: any; ratings: number[] }>();

    performances.forEach((p: any) => {
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
