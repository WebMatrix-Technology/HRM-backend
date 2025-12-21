import mongoose, { Schema, Document } from 'mongoose';

export interface IPerformance extends Document {
  _id: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  reviewPeriod: string;
  kpis?: Record<string, any>;
  goals?: Record<string, any>;
  rating?: number;
  feedback?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PerformanceSchema = new Schema<IPerformance>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    reviewPeriod: { type: String, required: true },
    kpis: Schema.Types.Mixed,
    goals: Schema.Types.Mixed,
    rating: Number,
    feedback: String,
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'Employee' },
    reviewedAt: Date,
  },
  {
    timestamps: true,
    collection: 'performances',
  }
);

export default mongoose.model<IPerformance>('Performance', PerformanceSchema);


