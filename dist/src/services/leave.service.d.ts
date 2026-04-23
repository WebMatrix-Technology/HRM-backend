import { LeaveType, LeaveStatus } from '../models';
export interface CreateLeaveData {
    employeeId: string;
    type: LeaveType;
    startDate: Date;
    endDate: Date;
    reason: string;
}
export declare const leaveService: {
    applyLeave: (data: CreateLeaveData) => Promise<{
        id: import("mongoose").Types.ObjectId | undefined;
        _id?: import("mongoose").Types.ObjectId | undefined;
        employeeId?: import("mongoose").Types.ObjectId | undefined;
        type?: LeaveType | undefined;
        startDate?: Date | undefined;
        endDate?: Date | undefined;
        days?: number | undefined;
        reason?: string | undefined;
        status?: LeaveStatus | undefined;
        approvedBy?: import("mongoose").Types.ObjectId;
        approvedAt?: Date;
        rejectionReason?: string;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
        $locals?: Record<string, unknown> | undefined;
        $op?: "save" | "validate" | "remove" | null | undefined;
        $where?: Record<string, unknown> | undefined;
        baseModelName?: string;
        collection?: import("mongoose").Collection<import("bson").Document> | undefined;
        db?: import("mongoose").Connection | undefined;
        errors?: import("mongoose").Error.ValidationError;
        isNew?: boolean | undefined;
        schema?: import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
            [x: number]: unknown;
            [x: symbol]: unknown;
            [x: string]: unknown;
        }, import("mongoose").Document<unknown, {}, {
            [x: number]: unknown;
            [x: symbol]: unknown;
            [x: string]: unknown;
        }, {
            id: string;
        }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<{
            [x: number]: unknown;
            [x: symbol]: unknown;
            [x: string]: unknown;
        } & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }, "id"> & {
            id: string;
        }, {
            [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
        } | {
            [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
                [x: number]: unknown;
                [x: symbol]: unknown;
                [x: string]: unknown;
            }, {
                id: string;
            }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<{
                [x: number]: unknown;
                [x: symbol]: unknown;
                [x: string]: unknown;
            } & Required<{
                _id: unknown;
            }> & {
                __v: number;
            }, "id"> & {
                id: string;
            }> | undefined;
        }, {
            [x: number]: {};
            [x: symbol]: {};
            [x: string]: {};
        } & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }> | undefined;
        __v?: number | undefined;
    }>;
    approveLeave: (leaveId: string, approvedBy: string, approverRole: string) => Promise<{
        id: import("mongoose").Types.ObjectId;
        _id: import("mongoose").Types.ObjectId;
        employeeId: import("mongoose").Types.ObjectId;
        type: LeaveType;
        startDate: Date;
        endDate: Date;
        days: number;
        reason: string;
        status: LeaveStatus;
        approvedBy?: import("mongoose").Types.ObjectId;
        approvedAt?: Date;
        rejectionReason?: string;
        createdAt: Date;
        updatedAt: Date;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    rejectLeave: (leaveId: string, approvedBy: string, rejectionReason: string, approverRole: string) => Promise<{
        id: import("mongoose").Types.ObjectId;
        _id: import("mongoose").Types.ObjectId;
        employeeId: import("mongoose").Types.ObjectId;
        type: LeaveType;
        startDate: Date;
        endDate: Date;
        days: number;
        reason: string;
        status: LeaveStatus;
        approvedBy?: import("mongoose").Types.ObjectId;
        approvedAt?: Date;
        rejectionReason?: string;
        createdAt: Date;
        updatedAt: Date;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    getLeaves: (employeeId?: string, status?: LeaveStatus) => Promise<any[]>;
    getLeaveBalance: (employeeId: string, month?: number, year?: number) => Promise<{
        total: number;
        used: number;
        remaining: number;
    }>;
};
//# sourceMappingURL=leave.service.d.ts.map