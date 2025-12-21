import mongoose, { Document } from 'mongoose';
export declare enum GroupRole {
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
    MEMBER = "MEMBER"
}
export interface IGroupMember extends Document {
    _id: mongoose.Types.ObjectId;
    groupId: mongoose.Types.ObjectId;
    employeeId: mongoose.Types.ObjectId;
    role: GroupRole;
    joinedAt: Date;
}
declare const _default: mongoose.Model<IGroupMember, {}, {}, {}, mongoose.Document<unknown, {}, IGroupMember, {}, mongoose.DefaultSchemaOptions> & IGroupMember & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IGroupMember>;
export default _default;
//# sourceMappingURL=GroupMember.model.d.ts.map