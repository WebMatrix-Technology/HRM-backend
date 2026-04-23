import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
export declare const punchIn: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const punchOut: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const startBreak: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const endBreak: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAttendance: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getMonthlyReport: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const exportAttendance: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=attendance.controller.d.ts.map