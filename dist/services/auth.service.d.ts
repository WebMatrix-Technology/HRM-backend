import { Role } from '../models/User.model';
export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    role?: Role;
    phone?: string;
    department?: string;
    position?: string;
}
export interface LoginData {
    email: string;
    password: string;
}
export declare const registerService: (data: RegisterData) => Promise<{
    user: {
        id: string;
        email: string;
        role: Role;
    };
    employee: {
        id: string;
        employeeId: string;
        firstName: string;
        lastName: string;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare const loginService: (data: LoginData) => Promise<{
    user: {
        id: string;
        email: string;
        role: Role;
    };
    employee: {
        id: string;
        employeeId: string;
        firstName: string;
        lastName: string;
    } | null;
    accessToken: string;
    refreshToken: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map