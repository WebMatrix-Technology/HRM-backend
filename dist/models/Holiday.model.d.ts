import mongoose, { Document } from 'mongoose';
export declare enum HolidayType {
    PUBLIC = "PUBLIC",
    OPTIONAL = "OPTIONAL",
    COMPANY = "COMPANY"
}
export interface IHoliday extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    date: Date;
    type: HolidayType;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IHoliday, {}, {}, {}, mongoose.Document<unknown, {}, IHoliday, {}, mongoose.DefaultSchemaOptions> & IHoliday & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IHoliday>;
export default _default;
//# sourceMappingURL=Holiday.model.d.ts.map