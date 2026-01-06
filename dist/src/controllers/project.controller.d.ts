import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
export declare const getProjects: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getProject: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const createProject: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateProject: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteProject: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const addProjectMembers: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const removeProjectMember: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateProjectProgress: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getProjectStats: (_req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAvailableManagers: (_req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getProjectTemplates: (_req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const exportProjects: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=project.controller.d.ts.map