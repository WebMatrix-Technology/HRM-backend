import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
export declare const createJobPosting: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getJobPostings: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getJobPostingById: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateJobStatus: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const createApplication: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getApplications: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateApplicationStatus: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=recruitment.controller.d.ts.map