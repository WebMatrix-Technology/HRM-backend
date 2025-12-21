import connectDB from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { GroupType, GroupRole } from '../models';
import Group from '../models/Group.model';
import GroupMember from '../models/GroupMember.model';

export interface CreateGroupData {
  name: string;
  description?: string;
  type: GroupType;
  memberIds?: string[];
}

export const groupService = {
  createGroup: async (creatorEmployeeId: string, data: CreateGroupData) => {
    await connectDB();

    // Create group
    const newGroup = await Group.create({
      name: data.name,
      description: data.description,
      type: data.type,
      createdBy: creatorEmployeeId,
    });

    // Add creator as admin
    await GroupMember.create({
      groupId: newGroup._id,
      employeeId: creatorEmployeeId,
      role: GroupRole.ADMIN,
    });

    // Add other members if provided
    if (data.memberIds && data.memberIds.length > 0) {
      await GroupMember.insertMany(
        data.memberIds.map((memberId) => ({
          groupId: newGroup._id,
          employeeId: memberId,
          role: GroupRole.MEMBER,
        }))
      );
    }

    return newGroup.toObject();
  },

  addMembers: async (groupId: string, employeeId: string, memberIds: string[]) => {
    await connectDB();

    // Check if user is admin or moderator
    const membership = await GroupMember.findOne({
      groupId,
      employeeId,
    });

    if (!membership || (membership.role !== GroupRole.ADMIN && membership.role !== GroupRole.MODERATOR)) {
      throw new AppError('Only admins and moderators can add members', 403);
    }

    await GroupMember.insertMany(
      memberIds.map((memberId) => ({
        groupId,
        employeeId: memberId,
        role: GroupRole.MEMBER,
      })),
      { ordered: false }
    );
  },

  removeMember: async (groupId: string, employeeId: string, memberIdToRemove: string) => {
    await connectDB();

    // Check if user is admin or moderator
    const membership = await GroupMember.findOne({
      groupId,
      employeeId,
    });

    if (!membership || (membership.role !== GroupRole.ADMIN && membership.role !== GroupRole.MODERATOR)) {
      throw new AppError('Only admins and moderators can remove members', 403);
    }

    await GroupMember.findOneAndDelete({
      groupId,
      employeeId: memberIdToRemove,
    });
  },

  leaveGroup: async (groupId: string, employeeId: string) => {
    await connectDB();

    await GroupMember.findOneAndDelete({
      groupId,
      employeeId,
    });
  },

  deleteGroup: async (groupId: string, employeeId: string) => {
    await connectDB();

    // Check if user is admin
    const membership = await GroupMember.findOne({
      groupId,
      employeeId,
    });

    if (!membership || membership.role !== GroupRole.ADMIN) {
      throw new AppError('Only admins can delete groups', 403);
    }

    await Group.findByIdAndDelete(groupId);
  },
};
