export interface CreatePerformanceData {
    employeeId: string;
    reviewPeriod: string;
    kpis?: any;
    goals?: any;
    rating?: number;
    feedback?: string;
}
export declare const performanceService: {
    createPerformance: (data: CreatePerformanceData) => Promise<(import("../models/Performance.model").IPerformance & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    updatePerformance: (id: string, data: Partial<CreatePerformanceData>, reviewedBy: string) => Promise<import("../models/Performance.model").IPerformance & Required<{
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
};
//# sourceMappingURL=performance.service.d.ts.map