import { LeaveType, LeaveStatus } from '../models';
export interface CreateLeaveData {
    employeeId: string;
    leaveType: LeaveType;
    startDate: Date;
    endDate: Date;
    reason: string;
}
export declare const leaveService: {
    applyLeave: (data: CreateLeaveData) => Promise<(import("../models").ILeave & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    approveLeave: (leaveId: string, approvedBy: string) => Promise<import("mongoose").Document<unknown, {}, import("../models").ILeave, {}, import("mongoose").DefaultSchemaOptions> & import("../models").ILeave & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    rejectLeave: (leaveId: string, approvedBy: string, rejectionReason: string) => Promise<import("mongoose").Document<unknown, {}, import("../models").ILeave, {}, import("mongoose").DefaultSchemaOptions> & import("../models").ILeave & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getLeaves: (employeeId?: string, status?: LeaveStatus) => Promise<(import("../models").ILeave & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getLeaveBalance: (employeeId: string) => Promise<{
        annualBalance: number;
        usedLeaves: number;
        remainingLeaves: number;
    }>;
};
//# sourceMappingURL=leave.service.d.ts.map