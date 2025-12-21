import { EmploymentType, Role } from '../models';
export interface CreateEmployeeData {
    email: string;
    password: string;
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
    employmentType?: EmploymentType;
    salary?: number;
    role?: Role;
}
export interface UpdateEmployeeData {
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
    employmentType?: EmploymentType;
    salary?: number;
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