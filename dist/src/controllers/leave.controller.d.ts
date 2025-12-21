import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
export declare const applyLeave: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const approveLeave: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const rejectLeave: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getLeaves: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getLeaveBalance: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=leave.controller.d.ts.map