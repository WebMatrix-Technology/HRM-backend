import mongoose, { Document } from 'mongoose';
export declare enum AttendanceStatus {
    PRESENT = "PRESENT",
    ABSENT = "ABSENT",
    LATE = "LATE",
    HALF_DAY = "HALF_DAY"
}
export interface IAttendance extends Document {
    _id: mongoose.Types.ObjectId;
    employeeId: mongoose.Types.ObjectId;
    date: Date;
    punchIn?: Date;
    punchOut?: Date;
    workFromHome: boolean;
    status: AttendanceStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IAttendance, {}, {}, {}, mongoose.Document<unknown, {}, IAttendance, {}, mongoose.DefaultSchemaOptions> & IAttendance & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IAttendance>;
export default _default;
//# sourceMappingURL=Attendance.model.d.ts.map