import { Request, Response } from 'express';
export declare const taskController: {
    getTasks: (req: Request, res: Response) => Promise<void>;
    getTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    createTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    updateTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    deleteTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=task.controller.d.ts.map