import mongoose, { Schema, Document } from 'mongoose';

export enum GroupRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  MEMBER = 'MEMBER',
}

export interface IGroupMember extends Document {
  _id: mongoose.Types.ObjectId;
  groupId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  role: GroupRole;
  joinedAt: Date;
}

const GroupMemberSchema = new Schema<IGroupMember>(
  {
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    role: { type: String, enum: Object.values(GroupRole), default: GroupRole.MEMBER },
    joinedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    collection: 'group_members',
  }
);

GroupMemberSchema.index({ groupId: 1, employeeId: 1 }, { unique: true });

export default mongoose.model<IGroupMember>('GroupMember', GroupMemberSchema);


