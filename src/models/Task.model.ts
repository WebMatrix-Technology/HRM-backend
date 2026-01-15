import mongoose, { Schema, Document } from 'mongoose';

export enum TaskStatus {
    BACKLOG = 'Backlog',
    READY = 'Ready',
    IN_PROGRESS = 'In Progress',
    IN_REVIEW = 'In Review',
    DONE = 'Done',
}

export enum TaskPriority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
    CRITICAL = 'Critical',
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

const TaskSchema = new Schema<ITask>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        status: {
            type: String,
            enum: Object.values(TaskStatus),
            default: TaskStatus.BACKLOG,
        },
        priority: {
            type: String,
            enum: Object.values(TaskPriority),
            default: TaskPriority.MEDIUM,
        },
        storyPoints: { type: Number, min: 0 },
        projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
        assigneeId: { type: Schema.Types.ObjectId, ref: 'Employee' },
        tags: [{ type: String, trim: true }],
    },
    {
        timestamps: true,
        collection: 'tasks',
    }
);

// Indexes
TaskSchema.index({ projectId: 1 });
TaskSchema.index({ assigneeId: 1 });
TaskSchema.index({ status: 1 });

export default mongoose.model<ITask>('Task', TaskSchema);
