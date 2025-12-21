import { Response, NextFunction } from 'express';
import { chatService } from '../services/chat.service';
import { groupService } from '../services/group.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import connectDB from '../config/database';
import Employee from '../models/Employee.model';

export const getConversations = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await connectDB();

    const employee = await Employee.findOne({ userId: req.user.userId }).lean();

    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    const conversations = await chatService.getConversations(employee._id.toString());
    res.status(200).json({ data: conversations });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { otherEmployeeId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const cursor = req.query.cursor as string | undefined;

    await connectDB();

    const employee = await Employee.findOne({ userId: req.user.userId }).lean();

    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    const messages = await chatService.getMessages(employee._id.toString(), otherEmployeeId, limit, cursor);
    res.status(200).json({ data: messages });
  } catch (error) {
    next(error);
  }
};

export const getGroups = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await connectDB();

    const employee = await Employee.findOne({ userId: req.user.userId }).lean();

    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    const groups = await chatService.getGroups(employee._id.toString());
    res.status(200).json({ data: groups });
  } catch (error) {
    next(error);
  }
};

export const getGroupMessages = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { groupId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const cursor = req.query.cursor as string | undefined;

    await connectDB();

    const employee = await Employee.findOne({ userId: req.user.userId }).lean();

    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    const messages = await chatService.getGroupMessages(groupId, employee._id.toString(), limit, cursor);
    res.status(200).json({ data: messages });
  } catch (error) {
    next(error);
  }
};

export const createGroup = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await connectDB();

    const employee = await Employee.findOne({ userId: req.user.userId }).lean();

    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    const group = await groupService.createGroup(employee._id.toString(), req.body);
    res.status(201).json({ message: 'Group created successfully', data: group });
  } catch (error) {
    next(error);
  }
};

export const addGroupMembers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { groupId } = req.params;
    const { memberIds } = req.body;

    await connectDB();

    const employee = await Employee.findOne({ userId: req.user.userId }).lean();

    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    await groupService.addMembers(groupId, employee._id.toString(), memberIds);
    res.status(200).json({ message: 'Members added successfully' });
  } catch (error) {
    next(error);
  }
};

export const removeGroupMember = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { groupId, memberId } = req.params;

    await connectDB();

    const employee = await Employee.findOne({ userId: req.user.userId }).lean();

    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    await groupService.removeMember(groupId, employee._id.toString(), memberId);
    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
    next(error);
  }
};

export const leaveGroup = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { groupId } = req.params;

    await connectDB();

    const employee = await Employee.findOne({ userId: req.user.userId }).lean();

    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    await groupService.leaveGroup(groupId, employee._id.toString());
    res.status(200).json({ message: 'Left group successfully' });
  } catch (error) {
    next(error);
  }
};
