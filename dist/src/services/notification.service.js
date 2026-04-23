"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = void 0;
const Notification_model_1 = __importDefault(require("../models/Notification.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
exports.notificationService = {
    /**
     * Create a notification for a specific user
     */
    createNotification: async (data) => {
        try {
            const notification = await Notification_model_1.default.create({
                ...data,
                type: data.type || 'info',
            });
            return notification;
        }
        catch (error) {
            console.error('❌ Failed to create notification:', error);
            return null;
        }
    },
    /**
     * Create notifications for all users with specific roles
     */
    notifyRoles: async (roles, data) => {
        try {
            const users = await User_model_1.default.find({ role: { $in: roles }, isActive: true }).select('_id');
            const notifications = users.map(user => ({
                recipient: user._id,
                title: data.title,
                message: data.message,
                type: data.type || 'info',
                link: data.link,
            }));
            if (notifications.length > 0) {
                await Notification_model_1.default.insertMany(notifications);
                console.log(`✅ Notifications sent to ${notifications.length} users with roles: ${roles.join(', ')}`);
            }
        }
        catch (error) {
            console.error('❌ Failed to notify roles:', error);
        }
    }
};
//# sourceMappingURL=notification.service.js.map