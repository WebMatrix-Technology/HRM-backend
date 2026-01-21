import { Request, Response } from 'express';
import Notification from '../models/Notification.model';

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const userId = (req as any).user?._id;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Notification.countDocuments({ recipient: userId });
        const unreadCount = await Notification.countDocuments({
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
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?._id;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (id === 'all') {
            await Notification.updateMany(
                { recipient: userId, isRead: false },
                { isRead: true }
            );
            res.status(200).json({ message: 'All notifications marked as read' });
        } else {
            const notification = await Notification.findOneAndUpdate(
                { _id: id, recipient: userId },
                { isRead: true },
                { new: true }
            );

            if (!notification) {
                res.status(404).json({ message: 'Notification not found' });
                return;
            }

            res.status(200).json(notification);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteNotification = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?._id;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const notification = await Notification.findOneAndDelete({
            _id: id,
            recipient: userId,
        });

        if (!notification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }

        res.status(200).json({ message: 'Notification deleted' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
