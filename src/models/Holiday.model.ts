import mongoose, { Schema, Document } from 'mongoose';

export enum HolidayType {
  PUBLIC = 'PUBLIC',
  OPTIONAL = 'OPTIONAL',
  COMPANY = 'COMPANY',
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

const HolidaySchema = new Schema<IHoliday>(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true, unique: true },
    type: { type: String, enum: Object.values(HolidayType), default: HolidayType.PUBLIC },
    description: String,
  },
  {
    timestamps: true,
    collection: 'holidays',
  }
);

export default mongoose.model<IHoliday>('Holiday', HolidaySchema);


