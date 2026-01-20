import mongoose, { Document } from 'mongoose';
export declare enum TaskStatus {
    BACKLOG = "Backlog",
    READY = "Ready",
    IN_PROGRESS = "In Progress",
    IN_REVIEW = "In Review",
    DONE = "Done"
}
export declare enum TaskPriority {
    LOW = "Low",
    MEDIUM = "Medium",
    HIGH = "High",
    CRITICAL = "Critical"
}
export interface ITask extends Document {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    storyPoints?: number;
    projectId: mongoose.Types.ObjectId;
    assigneeId?: mongoose.Types.ObjectId;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ITask, {}, {}, {}, mongoose.Document<unknown, {}, ITask, {}, mongoose.DefaultSchemaOptions> & ITask & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, ITask>;
export default _default;
//# sourceMappingURL=Task.model.d.ts.map