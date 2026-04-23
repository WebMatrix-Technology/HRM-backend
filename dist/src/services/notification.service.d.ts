import { Role } from '../models/User.model';
import mongoose from 'mongoose';
export declare const notificationService: {
    /**
     * Create a notification for a specific user
     */
    createNotification: (data: {
        recipient: string | mongoose.Types.ObjectId;
        title: string;
        message: string;
        type?: "info" | "success" | "warning" | "error";
        link?: string;
    }) => Promise<(mongoose.Document<unknown, {}, import("../models/Notification.model").INotification, {}, mongoose.DefaultSchemaOptions> & import("../models/Notification.model").INotification & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    /**
     * Create notifications for all users with specific roles
     */
    notifyRoles: (roles: Role[], data: {
        title: string;
        message: string;
        type?: "info" | "success" | "warning" | "error";
        link?: string;
    }) => Promise<void>;
};
//# sourceMappingURL=notification.service.d.ts.map