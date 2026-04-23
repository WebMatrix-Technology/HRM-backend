import { HolidayType } from '../models/Holiday.model';
import mongoose from 'mongoose';
export declare const calendarService: {
    /**
     * Add an event to the calendar
     */
    addEvent: (data: {
        title: string;
        date: Date;
        description?: string;
        createdBy: string | mongoose.Types.ObjectId;
        type?: HolidayType;
    }) => Promise<(mongoose.Document<unknown, {}, import("../models/Holiday.model").IHoliday, {}, mongoose.DefaultSchemaOptions> & import("../models/Holiday.model").IHoliday & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=calendar.service.d.ts.map