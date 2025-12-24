import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
export declare const createEmployee: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getEmployees: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getEmployeeById: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateEmployee: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteEmployee: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getDepartments: (_req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=employee.controller.d.ts.map