import mongoose, { Document } from 'mongoose';
export declare enum DocumentType {
    PDF = "PDF",
    IMAGE = "IMAGE",
    DOC = "DOC",
    OTHER = "OTHER"
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
declare const _default: mongoose.Model<IDocument, {}, {}, {}, mongoose.Document<unknown, {}, IDocument, {}, mongoose.DefaultSchemaOptions> & IDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IDocument>;
export default _default;
//# sourceMappingURL=Document.model.d.ts.map