import Holiday, { HolidayType } from '../models/Holiday.model';
import mongoose from 'mongoose';

export const calendarService = {
    /**
     * Add an event to the calendar
     */
    addEvent: async (data: {
        title: string;
        date: Date;
        description?: string;
        createdBy: string | mongoose.Types.ObjectId;
        type?: HolidayType;
    }) => {
        try {
            const event = await Holiday.create({
                title: data.title,
                date: data.date,
                description: data.description,
                type: data.type || HolidayType.EVENT,
                createdBy: data.createdBy,
                isRecurring: false,
            });
            console.log('✅ Calendar event created:', event.title);
            return event;
        } catch (error) {
            console.error('❌ Failed to create calendar event:', error);
            return null;
        }
    }
};
