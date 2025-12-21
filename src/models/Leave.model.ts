import mongoose, { Schema, Document } from 'mongoose';

export enum LeaveType {
  SICK = 'SICK',
  CASUAL = 'CASUAL',
  EARNED = 'EARNED',
  UNPAID = 'UNPAID',
  MATERNITY = 'MATERNITY',
  PATERNITY = 'PATERNITY',
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
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

const LeaveSchema = new Schema<ILeave>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    leaveType: { type: String, enum: Object.values(LeaveType), required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: { type: Number, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: Object.values(LeaveStatus), default: LeaveStatus.PENDING },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'Employee' },
    approvedAt: Date,
    rejectionReason: String,
  },
  {
    timestamps: true,
    collection: 'leaves',
  }
);

export default mongoose.model<ILeave>('Leave', LeaveSchema);


