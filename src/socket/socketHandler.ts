import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import connectDB from '../config/database';
import { MessageType } from '../models';
import Employee from '../models/Employee.model';
import ChatMessage from '../models/ChatMessage.model';
import GroupMember from '../models/GroupMember.model';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
  employeeId?: string;
}

export const initializeSocket = (io: Server) => {
  // Authentication middleware for Socket.io
  io.use(async (socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as { userId: string; role: string };

      await connectDB();

      // Get employee ID for this user
      const employee = await Employee.findOne({ userId: decoded.userId }).lean();

      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      socket.employeeId = employee?._id.toString();
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.userId;
    const employeeId = socket.employeeId;

    if (!userId || !employeeId) {
      socket.disconnect();
      return;
    }

    console.log(`User ${userId} connected`);

    // Join user's personal room for one-to-one chats
    socket.join(`user:${userId}`);

    // Handle one-to-one chat
    socket.on('send_message', async (data) => {
      try {
        await connectDB();

        const { receiverId, message, type = 'TEXT', fileUrl } = data;

        // Get receiver's user ID from employee ID
        const receiver = await Employee.findById(receiverId).select('userId').lean();

        if (!receiver) {
          socket.emit('error', { message: 'Receiver not found' });
          return;
        }

        // Save message to database
        const savedMessage = await ChatMessage.create({
          senderId: employeeId,
          receiverId: receiverId,
          message,
          type: type as MessageType,
          fileUrl,
        });

        const populatedMessage = await ChatMessage.findById(savedMessage._id)
          .populate('senderId', 'id firstName lastName avatar')
          .lean();

        // Emit to receiver
        socket.to(`user:${receiver.userId}`).emit('receive_message', {
          id: savedMessage._id.toString(),
          senderId: employeeId,
          receiverId,
          message: savedMessage.message,
          type: savedMessage.type,
          fileUrl: savedMessage.fileUrl,
          isRead: false,
          createdAt: savedMessage.createdAt,
          sender: populatedMessage?.senderId,
        });

        // Also emit back to sender for confirmation
        socket.emit('message_sent', {
          id: savedMessage._id.toString(),
          senderId: employeeId,
          receiverId,
          message: savedMessage.message,
          type: savedMessage.type,
          fileUrl: savedMessage.fileUrl,
          isRead: false,
          createdAt: savedMessage.createdAt,
          sender: populatedMessage?.senderId,
        });
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', async (data) => {
      try {
        const { receiverId, isTyping } = data;
        
        // Get receiver's user ID from employee ID
        await connectDB();
        const receiver = await Employee.findById(receiverId).select('userId').lean();
        
        if (receiver && receiver.userId) {
          socket.to(`user:${receiver.userId}`).emit('user_typing', {
            userId: employeeId,
            isTyping,
          });
        }
      } catch (error) {
        console.error('Error handling typing indicator:', error);
      }
    });

    // Handle join group
    socket.on('join_group', async (groupId) => {
      try {
        await connectDB();

        // Verify user is a member of the group
        const membership = await GroupMember.findOne({
          groupId,
          employeeId,
        });

        if (membership) {
          socket.join(`group:${groupId}`);
          socket.to(`group:${groupId}`).emit('user_joined', {
            employeeId,
            groupId,
          });
        }
      } catch (error) {
        console.error('Error joining group:', error);
      }
    });

    // Handle leave group
    socket.on('leave_group', (groupId) => {
      socket.leave(`group:${groupId}`);
      socket.to(`group:${groupId}`).emit('user_left', {
        employeeId,
        groupId,
      });
    });

    // Handle group message
    socket.on('send_group_message', async (data) => {
      try {
        await connectDB();

        const { groupId, message, type = 'TEXT', fileUrl } = data;

        // Verify user is a member of the group
        const membership = await GroupMember.findOne({
          groupId,
          employeeId,
        });

        if (!membership) {
          socket.emit('error', { message: 'You are not a member of this group' });
          return;
        }

        // Save message to database
        const savedMessage = await ChatMessage.create({
          senderId: employeeId,
          groupId,
          message,
          type: type as MessageType,
          fileUrl,
        });

        const populatedMessage = await ChatMessage.findById(savedMessage._id)
          .populate('senderId', 'id firstName lastName avatar')
          .lean();

        // Emit to all group members
        io.to(`group:${groupId}`).emit('receive_group_message', {
          id: savedMessage._id.toString(),
          senderId: employeeId,
          groupId,
          message: savedMessage.message,
          type: savedMessage.type,
          fileUrl: savedMessage.fileUrl,
          isRead: false,
          createdAt: savedMessage.createdAt,
          sender: populatedMessage?.senderId,
        });
      } catch (error) {
        console.error('Error sending group message:', error);
        socket.emit('error', { message: 'Failed to send group message' });
      }
    });

    // Handle mark message as read
    socket.on('mark_read', async (data) => {
      try {
        await connectDB();

        const { messageId } = data;
        await ChatMessage.findByIdAndUpdate(messageId, {
          isRead: true,
          readAt: new Date(),
        });
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
    });
  });
};
