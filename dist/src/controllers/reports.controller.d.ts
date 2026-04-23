import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
export declare const getAttendanceSummary: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getPayrollSummary: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getEmployeeStats: (_req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=reports.controller.d.ts.map