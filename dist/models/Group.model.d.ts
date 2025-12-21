import mongoose, { Document } from 'mongoose';
export declare enum GroupType {
    DEPARTMENT = "DEPARTMENT",
    PROJECT = "PROJECT",
    GENERAL = "GENERAL"
}
export interface IGroup extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    type: GroupType;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IGroup, {}, {}, {}, mongoose.Document<unknown, {}, IGroup, {}, mongoose.DefaultSchemaOptions> & IGroup & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IGroup>;
export default _default;
//# sourceMappingURL=Group.model.d.ts.map