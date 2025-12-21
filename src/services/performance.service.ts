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
};
