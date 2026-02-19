import mongoose, { Schema, Document } from 'mongoose';

export enum Role {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  HR_MANAGER = 'HR_MANAGER',
  CLERK = 'CLERK',
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

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.EMPLOYEE },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

export default mongoose.model<IUser>('User', UserSchema);


