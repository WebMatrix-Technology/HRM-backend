import mongoose, { Document } from 'mongoose';
export declare enum EmploymentType {
    FULL_TIME = "FULL_TIME",
    PART_TIME = "PART_TIME",
    CONTRACT = "CONTRACT",
    INTERN = "INTERN"
}
export interface IEmployee extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    employeeId: string;
    nameTitle?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: Date;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    department?: string;
    position?: string;
    bloodGroup?: string;
    aadhaarNumber?: string;
    personalEmail?: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankIfscCode?: string;
    qualifications?: string;
    skills?: string;
    joiningDate: Date;
    employmentType: EmploymentType;
    salary?: number;
    basicSalary?: number;
    hra?: number;
    specialAllowance?: number;
    travelAllowance?: number;
    pf?: number;
    tds?: number;
    monthlyLeaveAllotment?: number;
    isActive: boolean;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IEmployee, {}, {}, {}, mongoose.Document<unknown, {}, IEmployee, {}, mongoose.DefaultSchemaOptions> & IEmployee & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IEmployee>;
export default _default;
//# sourceMappingURL=Employee.model.d.ts.map