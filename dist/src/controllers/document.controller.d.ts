import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
export declare const uploadDocument: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getDocuments: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const downloadDocument: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteDocument: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=document.controller.d.ts.map