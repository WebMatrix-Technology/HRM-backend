import mongoose, { Document } from 'mongoose';
export interface IEmployeeDocument extends Document {
    _id: mongoose.Types.ObjectId;
    employeeId: mongoose.Types.ObjectId;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
}
declare const _default: mongoose.Model<IEmployeeDocument, {}, {}, {}, mongoose.Document<unknown, {}, IEmployeeDocument, {}, mongoose.DefaultSchemaOptions> & IEmployeeDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IEmployeeDocument>;
export default _default;
//# sourceMappingURL=EmployeeDocument.model.d.ts.map