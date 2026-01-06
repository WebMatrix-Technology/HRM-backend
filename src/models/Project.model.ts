import mongoose, { Schema, Document } from 'mongoose';

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ProjectPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
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

const ProjectMemberSchema = new Schema<IProjectMember>({
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  role: { type: String, default: 'MEMBER' },
  joinedAt: { type: Date, default: Date.now },
});

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { 
      type: String, 
      enum: Object.values(ProjectStatus), 
      default: ProjectStatus.PLANNING 
    },
    priority: { 
      type: String, 
      enum: Object.values(ProjectPriority), 
      default: ProjectPriority.MEDIUM 
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    deadline: { type: Date },
    budget: { type: Number, min: 0 },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    managerId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    members: [ProjectMemberSchema],
    tags: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
    collection: 'projects',
  }
);

// Indexes for better query performance
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ priority: 1 });
ProjectSchema.index({ managerId: 1 });
ProjectSchema.index({ startDate: 1 });
ProjectSchema.index({ deadline: 1 });
ProjectSchema.index({ tags: 1 });
ProjectSchema.index({ name: 'text', description: 'text' });

// Virtual for checking if project is overdue
ProjectSchema.virtual('isOverdue').get(function() {
  if (!this.deadline) return false;
  return this.deadline < new Date() && this.status !== ProjectStatus.COMPLETED;
});

// Ensure virtuals are included when converting to JSON
ProjectSchema.set('toJSON', { virtuals: true });

export default mongoose.model<IProject>('Project', ProjectSchema);

