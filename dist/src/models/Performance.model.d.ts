import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IPerformance, {}, {}, {}, mongoose.Document<unknown, {}, IPerformance, {}, mongoose.DefaultSchemaOptions> & IPerformance & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IPerformance>;
export default _default;
//# sourceMappingURL=Performance.model.d.ts.map