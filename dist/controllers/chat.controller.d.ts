import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
export declare const getConversations: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getMessages: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getGroups: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getGroupMessages: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const createGroup: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const addGroupMembers: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const removeGroupMember: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const leaveGroup: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=chat.controller.d.ts.map