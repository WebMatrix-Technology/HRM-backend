import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
export declare const createHoliday: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getHolidays: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteHoliday: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=holiday.controller.d.ts.map