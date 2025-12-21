import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
export declare const getUsers: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserById: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateUser: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteUser: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=user.controller.d.ts.map