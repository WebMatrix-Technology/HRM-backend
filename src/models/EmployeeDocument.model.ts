import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployeeDocument extends Document {
  _id: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}

const EmployeeDocumentSchema = new Schema<IEmployeeDocument>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    url: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    collection: 'employee_documents',
  }
);

export default mongoose.model<IEmployeeDocument>('EmployeeDocument', EmployeeDocumentSchema);


