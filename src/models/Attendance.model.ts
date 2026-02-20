import mongoose, { Schema, Document } from 'mongoose';

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  HALF_DAY = 'HALF_DAY',
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
  idleTime?: number; // Accumulated idle seconds
  productiveTime?: number; // Total seconds
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true },
    punchIn: Date,
    punchOut: Date,
    workFromHome: { type: Boolean, default: false },
    status: { type: String, enum: Object.values(AttendanceStatus), default: AttendanceStatus.PRESENT },
    notes: String,
    idleTime: { type: Number, default: 0 },
    productiveTime: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: 'attendances',
  }
);

AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);


