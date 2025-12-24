import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
export declare const createPerformance: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updatePerformance: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getPerformances: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getPerformanceById: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=performance.controller.d.ts.map