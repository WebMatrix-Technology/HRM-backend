"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupService = void 0;
const database_1 = __importDefault(require("../config/database"));
const error_middleware_1 = require("../middlewares/error.middleware");
const models_1 = require("../models");
const Group_model_1 = __importDefault(require("../models/Group.model"));
const GroupMember_model_1 = __importDefault(require("../models/GroupMember.model"));
exports.groupService = {
    createGroup: async (creatorEmployeeId, data) => {
        await (0, database_1.default)();
        // Create group
        const newGroup = await Group_model_1.default.create({
            name: data.name,
            description: data.description,
            type: data.type,
            createdBy: creatorEmployeeId,
        });
        // Add creator as admin
        await GroupMember_model_1.default.create({
            groupId: newGroup._id,
            employeeId: creatorEmployeeId,
            role: models_1.GroupRole.ADMIN,
        });
        // Add other members if provided
        if (data.memberIds && data.memberIds.length > 0) {
            await GroupMember_model_1.default.insertMany(data.memberIds.map((memberId) => ({
                groupId: newGroup._id,
                employeeId: memberId,
                role: models_1.GroupRole.MEMBER,
            })));
        }
        return newGroup.toObject();
    },
    addMembers: async (groupId, employeeId, memberIds) => {
        await (0, database_1.default)();
        // Check if user is admin or moderator
        const membership = await GroupMember_model_1.default.findOne({
            groupId,
            employeeId,
        });
        if (!membership || (membership.role !== models_1.GroupRole.ADMIN && membership.role !== models_1.GroupRole.MODERATOR)) {
            throw new error_middleware_1.AppError('Only admins and moderators can add members', 403);
        }
        await GroupMember_model_1.default.insertMany(memberIds.map((memberId) => ({
            groupId,
            employeeId: memberId,
            role: models_1.GroupRole.MEMBER,
        })), { ordered: false });
    },
    removeMember: async (groupId, employeeId, memberIdToRemove) => {
        await (0, database_1.default)();
        // Check if user is admin or moderator
        const membership = await GroupMember_model_1.default.findOne({
            groupId,
            employeeId,
        });
        if (!membership || (membership.role !== models_1.GroupRole.ADMIN && membership.role !== models_1.GroupRole.MODERATOR)) {
            throw new error_middleware_1.AppError('Only admins and moderators can remove members', 403);
        }
        await GroupMember_model_1.default.findOneAndDelete({
            groupId,
            employeeId: memberIdToRemove,
        });
    },
    leaveGroup: async (groupId, employeeId) => {
        await (0, database_1.default)();
        await GroupMember_model_1.default.findOneAndDelete({
            groupId,
            employeeId,
        });
    },
    deleteGroup: async (groupId, employeeId) => {
        await (0, database_1.default)();
        // Check if user is admin
        const membership = await GroupMember_model_1.default.findOne({
            groupId,
            employeeId,
        });
        if (!membership || membership.role !== models_1.GroupRole.ADMIN) {
            throw new error_middleware_1.AppError('Only admins can delete groups', 403);
        }
        await Group_model_1.default.findByIdAndDelete(groupId);
    },
};
//# sourceMappingURL=group.service.js.map