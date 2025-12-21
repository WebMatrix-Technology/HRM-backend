import mongoose, { Schema, Document } from 'mongoose';

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERN = 'INTERN',
}

export interface IEmployee extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  employeeId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  department?: string;
  position?: string;
  joiningDate: Date;
  employmentType: EmploymentType;
  salary?: number;
  isActive: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    employeeId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: String,
    dateOfBirth: Date,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    department: String,
    position: String,
    joiningDate: { type: Date, default: Date.now },
    employmentType: { type: String, enum: Object.values(EmploymentType), default: EmploymentType.FULL_TIME },
    salary: Number,
    isActive: { type: Boolean, default: true },
    avatar: String,
  },
  {
    timestamps: true,
    collection: 'employees',
  }
);

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);


