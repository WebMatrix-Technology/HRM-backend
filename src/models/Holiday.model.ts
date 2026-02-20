import mongoose, { Schema, Document } from 'mongoose';

export enum HolidayType {
  HOLIDAY = 'HOLIDAY',
  EVENT = 'EVENT',
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

const HolidaySchema = new Schema<IHoliday>(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: Object.values(HolidayType), default: HolidayType.HOLIDAY },
    description: { type: String },
    isRecurring: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IHoliday>('Holiday', HolidaySchema);


