"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveGroup = exports.removeGroupMember = exports.addGroupMembers = exports.createGroup = exports.getGroupMessages = exports.getGroups = exports.getMessages = exports.getConversations = void 0;
const chat_service_1 = require("../services/chat.service");
const group_service_1 = require("../services/group.service");
const database_1 = __importDefault(require("../config/database"));
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
const getConversations = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        await (0, database_1.default)();
        const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
        if (!employee) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }
        const conversations = await chat_service_1.chatService.getConversations(employee._id.toString());
        res.status(200).json({ data: conversations });
    }
    catch (error) {
        next(error);
    }
};
exports.getConversations = getConversations;
const getMessages = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { otherEmployeeId } = req.params;
        const limit = parseInt(req.query.limit) || 50;
        const cursor = req.query.cursor;
        await (0, database_1.default)();
        const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
        if (!employee) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }
        const messages = await chat_service_1.chatService.getMessages(employee._id.toString(), otherEmployeeId, limit, cursor);
        res.status(200).json({ data: messages });
    }
    catch (error) {
        next(error);
    }
};
exports.getMessages = getMessages;
const getGroups = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        await (0, database_1.default)();
        const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
        if (!employee) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }
        const groups = await chat_service_1.chatService.getGroups(employee._id.toString());
        res.status(200).json({ data: groups });
    }
    catch (error) {
        next(error);
    }
};
exports.getGroups = getGroups;
const getGroupMessages = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { groupId } = req.params;
        const limit = parseInt(req.query.limit) || 50;
        const cursor = req.query.cursor;
        await (0, database_1.default)();
        const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
        if (!employee) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }
        const messages = await chat_service_1.chatService.getGroupMessages(groupId, employee._id.toString(), limit, cursor);
        res.status(200).json({ data: messages });
    }
    catch (error) {
        next(error);
    }
};
exports.getGroupMessages = getGroupMessages;
const createGroup = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        await (0, database_1.default)();
        const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
        if (!employee) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }
        const group = await group_service_1.groupService.createGroup(employee._id.toString(), req.body);
        res.status(201).json({ message: 'Group created successfully', data: group });
    }
    catch (error) {
        next(error);
    }
};
exports.createGroup = createGroup;
const addGroupMembers = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { groupId } = req.params;
        const { memberIds } = req.body;
        await (0, database_1.default)();
        const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
        if (!employee) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }
        await group_service_1.groupService.addMembers(groupId, employee._id.toString(), memberIds);
        res.status(200).json({ message: 'Members added successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.addGroupMembers = addGroupMembers;
const removeGroupMember = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { groupId, memberId } = req.params;
        await (0, database_1.default)();
        const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
        if (!employee) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }
        await group_service_1.groupService.removeMember(groupId, employee._id.toString(), memberId);
        res.status(200).json({ message: 'Member removed successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.removeGroupMember = removeGroupMember;
const leaveGroup = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { groupId } = req.params;
        await (0, database_1.default)();
        const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
        if (!employee) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }
        await group_service_1.groupService.leaveGroup(groupId, employee._id.toString());
        res.status(200).json({ message: 'Left group successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.leaveGroup = leaveGroup;
//# sourceMappingURL=chat.controller.js.map