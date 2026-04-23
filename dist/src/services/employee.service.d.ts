import { EmploymentType, Role } from '../models';
export interface CreateEmployeeData {
    email: string;
    password: string;
    nameTitle?: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    phone?: string;
    dateOfBirth?: Date;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    department?: string;
    position?: string;
    personalEmail?: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankIfscCode?: string;
    employmentType?: EmploymentType;
    salary?: number;
    basicSalary?: number;
    hra?: number;
    specialAllowance?: number;
    travelAllowance?: number;
    pf?: number;
    tds?: number;
    monthlyLeaveAllotment?: number;
    qualifications?: string;
    skills?: string;
    joiningDate?: Date;
    role?: Role;
    isActive?: boolean;
}
export interface UpdateEmployeeData {
    nameTitle?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: Date;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    department?: string;
    position?: string;
    personalEmail?: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankIfscCode?: string;
    employmentType?: EmploymentType;
    salary?: number;
    basicSalary?: number;
    hra?: number;
    specialAllowance?: number;
    travelAllowance?: number;
    pf?: number;
    tds?: number;
    monthlyLeaveAllotment?: number;
    qualifications?: string;
    skills?: string;
    joiningDate?: Date;
    isActive?: boolean;
}
export declare const employeeService: {
    createEmployee: (data: CreateEmployeeData) => Promise<any>;
    getEmployees: (page?: number, limit?: number, filters?: {
        department?: string;
        isActive?: boolean;
    }) => Promise<{
        employees: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getEmployeeById: (id: string) => Promise<any>;
    updateEmployee: (id: string, data: UpdateEmployeeData) => Promise<any>;
    deleteEmployee: (id: string) => Promise<void>;
    getDepartments: () => Promise<string[]>;
};
//# sourceMappingURL=employee.service.d.ts.map