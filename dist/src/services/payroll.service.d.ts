export interface ProcessPayrollData {
    employeeId: string;
    month: number;
    year: number;
    basicSalary: number;
    hra?: number;
    specialAllowance?: number;
    travelAllowance?: number;
    deductions?: number;
    absentDays?: number;
    leaveDeduction?: number;
    idleDeduction?: number;
    pf?: number;
    tds?: number;
}
export declare const payrollService: {
    processPayroll: (data: ProcessPayrollData) => Promise<(import("../models/Payroll.model").IPayroll & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    getPayrolls: (employeeId?: string, month?: number, year?: number, userId?: string) => Promise<(import("../models/Payroll.model").IPayroll & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getPayrollById: (id: string) => Promise<import("../models/Payroll.model").IPayroll & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    markAsPaid: (id: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Payroll.model").IPayroll, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Payroll.model").IPayroll & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    calculatePayroll: (employeeId: string, month: number, year: number) => Promise<{
        basicSalary: number;
        hra: number;
        specialAllowance: number;
        travelAllowance: number;
        deductions: number;
        absentDays: number;
        leaveDeduction: number;
        idleDeduction: number;
        pf: number;
        tds: number;
        metrics: {
            absentDays: number;
            lopDays: number;
            idleHours: number;
            absentDeduction: number;
            idleDeduction: number;
            leaveDeduction: number;
        };
    }>;
};
//# sourceMappingURL=payroll.service.d.ts.map