import mongoose, { Document } from 'mongoose';
export declare enum ProjectStatus {
    PLANNING = "PLANNING",
    IN_PROGRESS = "IN_PROGRESS",
    ON_HOLD = "ON_HOLD",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare enum ProjectPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
export interface IProjectMember {
    employeeId: mongoose.Types.ObjectId;
    role: string;
    joinedAt: Date;
}
export interface IProject extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    status: ProjectStatus;
    priority: ProjectPriority;
    startDate: Date;
    endDate?: Date;
    deadline?: Date;
    budget?: number;
    progress: number;
    managerId: mongoose.Types.ObjectId;
    members: IProjectMember[];
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IProject, {}, {}, {}, mongoose.Document<unknown, {}, IProject, {}, mongoose.DefaultSchemaOptions> & IProject & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IProject>;
export default _default;
//# sourceMappingURL=Project.model.d.ts.map