import mongoose, { Document } from 'mongoose';
export declare enum HolidayType {
    HOLIDAY = "HOLIDAY",
    EVENT = "EVENT"
}
export interface IHoliday extends Document {
    title: string;
    date: Date;
    type: HolidayType;
    description?: string;
    isRecurring: boolean;
    createdBy: mongoose.Types.ObjectId;
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