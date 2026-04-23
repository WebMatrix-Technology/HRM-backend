import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
export declare const createJob: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getJobs: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getJobById: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateJob: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const applyForJob: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getCandidates: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateCandidateStatus: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=recruitment.controller.d.ts.map