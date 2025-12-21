import connectDB from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import ChatMessage from '../models/ChatMessage.model';
import Employee from '../models/Employee.model';
import GroupMember from '../models/GroupMember.model';

export const chatService = {
  // Get chat conversations for a user
  getConversations: async (employeeId: string) => {
    await connectDB();

    // Get all unique conversations (both sent and received messages)
    const sentMessages = await ChatMessage.find({
      senderId: employeeId,
      receiverId: { $ne: null },
    })
      .select('receiverId createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const receivedMessages = await ChatMessage.find({
      receiverId: employeeId,
    })
      .select('senderId createdAt')
      .sort({ createdAt: -1 })
      .lean();

    // Combine and get unique employee IDs
    const conversationIds = new Set<string>();
    const lastMessageMap = new Map<string, Date>();

    [...sentMessages, ...receivedMessages].forEach((msg: any) => {
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
    const conversations = await Promise.all(
      Array.from(conversationIds).map(async (otherId) => {
        const employee = await Employee.findById(otherId)
          .select('id firstName lastName avatar position')
          .lean();

        if (!employee) return null;

        const lastMessage = await ChatMessage.findOne({
          $or: [
            { senderId: employeeId, receiverId: otherId },
            { senderId: otherId, receiverId: employeeId },
          ],
        })
          .populate('senderId', 'id firstName lastName')
          .sort({ createdAt: -1 })
          .lean();

        const unreadCount = await ChatMessage.countDocuments({
          senderId: otherId,
          receiverId: employeeId,
          isRead: false,
        });

        return {
          employee,
          lastMessage,
          unreadCount,
        };
      })
    );

    const validConversations = conversations.filter((c) => c !== null);

    return validConversations.sort((a, b) => {
      const dateA = a?.lastMessage?.createdAt || new Date(0);
      const dateB = b?.lastMessage?.createdAt || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  },

  // Get messages between two users
  getMessages: async (employeeId: string, otherEmployeeId: string, limit = 50, cursor?: string) => {
    await connectDB();

    const query: any = {
      $or: [
        { senderId: employeeId, receiverId: otherEmployeeId },
        { senderId: otherEmployeeId, receiverId: employeeId },
      ],
    };

    if (cursor) {
      query._id = { $lt: cursor };
    }

    const messages = await ChatMessage.find(query)
      .populate('senderId', 'id firstName lastName avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Mark messages as read
    await ChatMessage.updateMany(
      {
        senderId: otherEmployeeId,
        receiverId: employeeId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    return messages.reverse();
  },

  // Get groups for an employee
  getGroups: async (employeeId: string) => {
    await connectDB();

    const groupMemberships = await GroupMember.find({ employeeId })
      .populate('groupId')
      .lean();

    // Get last message for each group and members
    const groupsWithMessages = await Promise.all(
      groupMemberships.map(async (gm: any) => {
        const group = gm.groupId;

        // Get group members
        const members = await GroupMember.find({ groupId: group._id })
          .populate('employeeId', 'id firstName lastName avatar')
          .lean();

        const lastMessage = await ChatMessage.findOne({ groupId: group._id })
          .populate('senderId', 'id firstName lastName')
          .sort({ createdAt: -1 })
          .lean();

        return {
          ...group,
          members,
          myRole: gm.role,
          lastMessage,
        };
      })
    );

    return groupsWithMessages;
  },

  // Get group messages
  getGroupMessages: async (groupId: string, employeeId: string, limit = 50, cursor?: string) => {
    await connectDB();

    // Verify membership
    const membership = await GroupMember.findOne({
      groupId,
      employeeId,
    });

    if (!membership) {
      throw new AppError('You are not a member of this group', 403);
    }

    const query: any = { groupId };
    if (cursor) {
      query._id = { $lt: cursor };
    }

    const messages = await ChatMessage.find(query)
      .populate('senderId', 'id firstName lastName avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return messages.reverse();
  },
};
