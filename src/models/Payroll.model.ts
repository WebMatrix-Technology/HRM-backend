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
  allowances: number;
  deductions: number;
  pf?: number;
  esic?: number;
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
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    pf: Number,
    esic: Number,
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


