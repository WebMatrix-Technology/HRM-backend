import mongoose, { Schema, Document } from 'mongoose';

export enum PayrollStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  PAID = 'PAID',
}

export interface IPayroll extends Document {
  _id: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  month: number;
  year: number;
  basicSalary: number;
  hra?: number;
  specialAllowance?: number;
  travelAllowance?: number;
  deductions: number;
  absentDays?: number;
  leaveDeduction?: number;
  idleDeduction?: number;
  pf?: number;
  tds?: number;
  netSalary: number;
  payslipUrl?: string;
  status: PayrollStatus;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PayrollSchema = new Schema<IPayroll>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    basicSalary: { type: Number, required: true },
    hra: { type: Number, default: 0 },
    specialAllowance: { type: Number, default: 0 },
    travelAllowance: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    absentDays: { type: Number, default: 0 },
    leaveDeduction: { type: Number, default: 0 },
    idleDeduction: { type: Number, default: 0 },
    pf: Number,
    tds: Number,
    netSalary: { type: Number, required: true },
    payslipUrl: String,
    status: { type: String, enum: Object.values(PayrollStatus), default: PayrollStatus.PENDING },
    paidAt: Date,
  },
  {
    timestamps: true,
    collection: 'payrolls',
  }
);

PayrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model<IPayroll>('Payroll', PayrollSchema);


