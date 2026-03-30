import Notification from '../models/Notification.model';
import User, { Role } from '../models/User.model';
import mongoose from 'mongoose';

export const notificationService = {
    /**
     * Create a notification for a specific user
     */
    createNotification: async (data: {
        recipient: string | mongoose.Types.ObjectId;
        title: string;
        message: string;
        type?: 'info' | 'success' | 'warning' | 'error';
        link?: string;
    }) => {
        try {
            const notification = await Notification.create({
                ...data,
                type: data.type || 'info',
            });
            return notification;
        } catch (error) {
            console.error('❌ Failed to create notification:', error);
            return null;
        }
    },

    /**
     * Create notifications for all users with specific roles
     */
    notifyRoles: async (roles: Role[], data: {
        title: string;
        message: string;
        type?: 'info' | 'success' | 'warning' | 'error';
        link?: string;
    }) => {
        try {
            const users = await User.find({ role: { $in: roles }, isActive: true }).select('_id');
            const notifications = users.map(user => ({
                recipient: user._id,
                title: data.title,
                message: data.message,
                type: data.type || 'info',
                link: data.link,
            }));

            if (notifications.length > 0) {
                await Notification.insertMany(notifications);
                console.log(`✅ Notifications sent to ${notifications.length} users with roles: ${roles.join(', ')}`);
            }
        } catch (error) {
            console.error('❌ Failed to notify roles:', error);
        }
    }
};
