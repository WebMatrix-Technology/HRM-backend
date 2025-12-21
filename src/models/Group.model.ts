import mongoose, { Schema, Document } from 'mongoose';

export enum GroupType {
  DEPARTMENT = 'DEPARTMENT',
  PROJECT = 'PROJECT',
  GENERAL = 'GENERAL',
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

const GroupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true },
    description: String,
    type: { type: String, enum: Object.values(GroupType), required: true },
    createdBy: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
    collection: 'groups',
  }
);

export default mongoose.model<IGroup>('Group', GroupSchema);


