export interface CreatePerformanceData {
    employeeId: string;
    reviewPeriod: string;
    kpis?: any;
    goals?: any;
    achievements?: any;
    rating?: number;
    feedback?: string;
}
export declare const performanceService: {
    createPerformance: (data: CreatePerformanceData) => Promise<(import("../models/Performance.model").IPerformance & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    updatePerformance: (id: string, data: Partial<CreatePerformanceData>, reviewedBy: string, reviewerRole: string) => Promise<import("../models/Performance.model").IPerformance & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getPerformances: (employeeId?: string) => Promise<(import("../models/Performance.model").IPerformance & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getPerformanceById: (id: string) => Promise<import("../models/Performance.model").IPerformance & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAnalytics: () => Promise<{
        trend: {
            period: string;
            averageRating: number;
        }[];
        departmentAverages: {
            department: string;
            averageRating: number;
        }[];
        topPerformers: {
            employee: any;
            averageRating: number;
            reviewCount: number;
        }[];
    }>;
};
//# sourceMappingURL=performance.service.d.ts.map