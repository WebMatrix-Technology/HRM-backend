import mongoose, { Document } from 'mongoose';
export declare enum LeaveType {
    SICK = "SICK",
    CASUAL = "CASUAL",
    EARNED = "EARNED",
    UNPAID = "UNPAID",
    MATERNITY = "MATERNITY",
    PATERNITY = "PATERNITY"
}
export declare enum LeaveStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED"
}
export interface ILeave extends Document {
    _id: mongoose.Types.ObjectId;
    employeeId: mongoose.Types.ObjectId;
    leaveType: LeaveType;
    startDate: Date;
    endDate: Date;
    days: number;
    reason: string;
    status: LeaveStatus;
    approvedBy?: mongoose.Types.ObjectId;
    approvedAt?: Date;
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ILeave, {}, {}, {}, mongoose.Document<unknown, {}, ILeave, {}, mongoose.DefaultSchemaOptions> & ILeave & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, ILeave>;
export default _default;
//# sourceMappingURL=Leave.model.d.ts.map