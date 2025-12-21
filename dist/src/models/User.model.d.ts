import mongoose, { Document } from 'mongoose';
export declare enum Role {
    ADMIN = "ADMIN",
    HR = "HR",
    MANAGER = "MANAGER",
    EMPLOYEE = "EMPLOYEE"
}
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    role: Role;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IUser>;
export default _default;
//# sourceMappingURL=User.model.d.ts.map