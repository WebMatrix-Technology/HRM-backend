import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
export declare const processPayroll: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getPayrolls: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getPayrollById: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const markAsPaid: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=payroll.controller.d.ts.map