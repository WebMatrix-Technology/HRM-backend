import mongoose, { Document } from 'mongoose';
export declare enum PayrollStatus {
    PENDING = "PENDING",
    PROCESSED = "PROCESSED",
    PAID = "PAID"
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
declare const _default: mongoose.Model<IPayroll, {}, {}, {}, mongoose.Document<unknown, {}, IPayroll, {}, mongoose.DefaultSchemaOptions> & IPayroll & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IPayroll>;
export default _default;
//# sourceMappingURL=Payroll.model.d.ts.map