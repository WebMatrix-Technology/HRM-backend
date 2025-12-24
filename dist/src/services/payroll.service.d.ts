export interface ProcessPayrollData {
    employeeId: string;
    month: number;
    year: number;
    basicSalary: number;
    allowances?: number;
    deductions?: number;
    pf?: number;
    esic?: number;
    tds?: number;
}
export declare const payrollService: {
    processPayroll: (data: ProcessPayrollData) => Promise<(import("../models").IPayroll & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    getPayrolls: (employeeId?: string, month?: number, year?: number) => Promise<(import("../models").IPayroll & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getPayrollById: (id: string) => Promise<import("../models").IPayroll & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    markAsPaid: (id: string) => Promise<import("mongoose").Document<unknown, {}, import("../models").IPayroll, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IPayroll & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
};
//# sourceMappingURL=payroll.service.d.ts.map