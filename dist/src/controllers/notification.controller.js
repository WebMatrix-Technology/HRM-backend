"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.markAsRead = exports.getNotifications = void 0;
const Notification_model_1 = __importDefault(require("../models/Notification.model"));
const getNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const notifications = await Notification_model_1.default.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await Notification_model_1.default.countDocuments({ recipient: userId });
        const unreadCount = await Notification_model_1.default.countDocuments({
            recipient: userId,
            isRead: false,
        });
        res.status(200).json({
            notifications,
            unreadCount,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error('Error in notification controller:', error);
        res.status(500).json({ message: error.message });
    }
};
exports.getNotifications = getNotifications;
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (id === 'all') {
            await Notification_model_1.default.updateMany({ recipient: userId, isRead: false }, { isRead: true });
            res.status(200).json({ message: 'All notifications marked as read' });
        }
        else {
            const notification = await Notification_model_1.default.findOneAndUpdate({ _id: id, recipient: userId }, { isRead: true }, { new: true });
            if (!notification) {
                res.status(404).json({ message: 'Notification not found' });
                return;
            }
            res.status(200).json(notification);
        }
    }
    catch (error) {
        console.error('Error in notification controller:', error);
        res.status(500).json({ message: error.message });
    }
};
exports.markAsRead = markAsRead;
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const notification = await Notification_model_1.default.findOneAndDelete({
            _id: id,
            recipient: userId,
        });
        if (!notification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }
        res.status(200).json({ message: 'Notification deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteNotification = deleteNotification;
//# sourceMappingURL=notification.controller.js.map