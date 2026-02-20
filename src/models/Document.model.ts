import mongoose, { Schema, Document } from 'mongoose';

export enum DocumentType {
    PDF = 'PDF',
    IMAGE = 'IMAGE',
    DOC = 'DOC',
    OTHER = 'OTHER',
}

export interface IDocument extends Document {
    employeeId: mongoose.Types.ObjectId;
    title: string;
    type: DocumentType;
    filePath: string;
    originalName: string;
    mimeType: string;
    size: number;
    uploadedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
    {
        employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
        title: { type: String, required: true },
        type: { type: String, enum: Object.values(DocumentType), default: DocumentType.OTHER },
        filePath: { type: String, required: true },
        originalName: { type: String, required: true },
        mimeType: { type: String, required: true },
        size: { type: Number, required: true },
        uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IDocument>('Document', DocumentSchema);
