"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = void 0;
const database_1 = __importDefault(require("../config/database"));
const error_middleware_1 = require("../middlewares/error.middleware");
const ChatMessage_model_1 = __importDefault(require("../models/ChatMessage.model"));
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
const GroupMember_model_1 = __importDefault(require("../models/GroupMember.model"));
exports.chatService = {
    // Get chat conversations for a user
    getConversations: async (employeeId) => {
        await (0, database_1.default)();
        // Get all unique conversations (both sent and received messages)
        const sentMessages = await ChatMessage_model_1.default.find({
            senderId: employeeId,
            receiverId: { $ne: null },
        })
            .select('receiverId createdAt')
            .sort({ createdAt: -1 })
            .lean();
        const receivedMessages = await ChatMessage_model_1.default.find({
            receiverId: employeeId,
        })
            .select('senderId createdAt')
            .sort({ createdAt: -1 })
            .lean();
        // Combine and get unique employee IDs
        const conversationIds = new Set();
        const lastMessageMap = new Map();
        [...sentMessages, ...receivedMessages].forEach((msg) => {
            const otherId = msg.receiverId?.toString() || msg.senderId?.toString();
            if (otherId) {
                conversationIds.add(otherId);
                const existing = lastMessageMap.get(otherId);
                if (!existing || msg.createdAt > existing) {
                    lastMessageMap.set(otherId, msg.createdAt);
                }
            }
        });
        // Get employee details and last message for each conversation
        const conversations = await Promise.all(Array.from(conversationIds).map(async (otherId) => {
            const employee = await Employee_model_1.default.findById(otherId)
                .select('id firstName lastName avatar position')
                .lean();
            if (!employee)
                return null;
            const lastMessage = await ChatMessage_model_1.default.findOne({
                $or: [
                    { senderId: employeeId, receiverId: otherId },
                    { senderId: otherId, receiverId: employeeId },
                ],
            })
                .populate('senderId', 'id firstName lastName')
                .sort({ createdAt: -1 })
                .lean();
            const unreadCount = await ChatMessage_model_1.default.countDocuments({
                senderId: otherId,
                receiverId: employeeId,
                isRead: false,
            });
            return {
                employee,
                lastMessage,
                unreadCount,
            };
        }));
        const validConversations = conversations.filter((c) => c !== null);
        return validConversations.sort((a, b) => {
            const dateA = a?.lastMessage?.createdAt || new Date(0);
            const dateB = b?.lastMessage?.createdAt || new Date(0);
            return dateB.getTime() - dateA.getTime();
        });
    },
    // Get messages between two users
    getMessages: async (employeeId, otherEmployeeId, limit = 50, cursor) => {
        await (0, database_1.default)();
        const query = {
            $or: [
                { senderId: employeeId, receiverId: otherEmployeeId },
                { senderId: otherEmployeeId, receiverId: employeeId },
            ],
        };
        if (cursor) {
            query._id = { $lt: cursor };
        }
        const messages = await ChatMessage_model_1.default.find(query)
            .populate('senderId', 'id firstName lastName avatar')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        // Mark messages as read
        await ChatMessage_model_1.default.updateMany({
            senderId: otherEmployeeId,
            receiverId: employeeId,
            isRead: false,
        }, {
            isRead: true,
            readAt: new Date(),
        });
        return messages.reverse();
    },
    // Get groups for an employee
    getGroups: async (employeeId) => {
        await (0, database_1.default)();
        const groupMemberships = await GroupMember_model_1.default.find({ employeeId })
            .populate('groupId')
            .lean();
        // Get last message for each group and members
        const groupsWithMessages = await Promise.all(groupMemberships.map(async (gm) => {
            const group = gm.groupId;
            // Get group members
            const members = await GroupMember_model_1.default.find({ groupId: group._id })
                .populate('employeeId', 'id firstName lastName avatar')
                .lean();
            const lastMessage = await ChatMessage_model_1.default.findOne({ groupId: group._id })
                .populate('senderId', 'id firstName lastName')
                .sort({ createdAt: -1 })
                .lean();
            return {
                ...group,
                members,
                myRole: gm.role,
                lastMessage,
            };
        }));
        return groupsWithMessages;
    },
    // Get group messages
    getGroupMessages: async (groupId, employeeId, limit = 50, cursor) => {
        await (0, database_1.default)();
        // Verify membership
        const membership = await GroupMember_model_1.default.findOne({
            groupId,
            employeeId,
        });
        if (!membership) {
            throw new error_middleware_1.AppError('You are not a member of this group', 403);
        }
        const query = { groupId };
        if (cursor) {
            query._id = { $lt: cursor };
        }
        const messages = await ChatMessage_model_1.default.find(query)
            .populate('senderId', 'id firstName lastName avatar')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        return messages.reverse();
    },
};
//# sourceMappingURL=chat.service.js.map