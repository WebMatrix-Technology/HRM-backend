"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = void 0;
const Task_model_1 = __importDefault(require("../models/Task.model"));
const Project_model_1 = __importDefault(require("../models/Project.model"));
const mongoose_1 = require("mongoose");
exports.taskController = {
    // Get all tasks (with filters)
    getTasks: async (req, res) => {
        try {
            const { projectId, status, assigneeId, search } = req.query;
            const filter = {};
            if (projectId && typeof projectId === 'string' && mongoose_1.Types.ObjectId.isValid(projectId)) {
                filter.projectId = projectId;
            }
            if (status)
                filter.status = status;
            if (assigneeId && typeof assigneeId === 'string' && mongoose_1.Types.ObjectId.isValid(assigneeId)) {
                filter.assigneeId = assigneeId;
            }
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                ];
            }
            const tasks = await Task_model_1.default.find(filter)
                .populate('projectId', 'name')
                .populate('assigneeId', 'firstName lastName avatar')
                .sort({ createdAt: -1 });
            res.json({ status: 'success', data: tasks });
        }
        catch (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    },
    // Get single task
    getTask: async (req, res) => {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ status: 'error', message: 'Invalid Task ID' });
            }
            const task = await Task_model_1.default.findById(req.params.id)
                .populate('projectId', 'name')
                .populate('assigneeId', 'firstName lastName avatar');
            if (!task) {
                return res.status(404).json({ status: 'error', message: 'Task not found' });
            }
            return res.json({ status: 'success', data: task });
        }
        catch (error) {
            console.error('Error fetching task:', error);
            return res.status(500).json({ status: 'error', message: error.message });
        }
    },
    // Create new task
    createTask: async (req, res) => {
        try {
            const { title, description, status, priority, storyPoints, projectId, assigneeId, tags } = req.body;
            // Validate inputs
            if (!projectId || !mongoose_1.Types.ObjectId.isValid(projectId)) {
                return res.status(400).json({ status: 'error', message: 'Invalid or missing Project ID' });
            }
            // Verify project exists
            const project = await Project_model_1.default.findById(projectId);
            if (!project) {
                return res.status(404).json({ status: 'error', message: 'Project not found' });
            }
            const newTask = new Task_model_1.default({
                title,
                description,
                status,
                priority,
                storyPoints: Number(storyPoints) || 0,
                projectId,
                assigneeId: assigneeId && mongoose_1.Types.ObjectId.isValid(assigneeId) ? assigneeId : undefined,
                tags,
            });
            const savedTask = await newTask.save();
            const populatedTask = await Task_model_1.default.findById(savedTask._id)
                .populate('projectId', 'name')
                .populate('assigneeId', 'firstName lastName avatar');
            return res.status(201).json({ status: 'success', data: populatedTask });
        }
        catch (error) {
            console.error('Error creating task:', error);
            return res.status(500).json({ status: 'error', message: error.message });
        }
    },
    // Update task
    updateTask: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ status: 'error', message: 'Invalid Task ID' });
            }
            // Sanitize valid fields if they exist in updates
            if (updates.projectId && !mongoose_1.Types.ObjectId.isValid(updates.projectId)) {
                delete updates.projectId; // Prevent invalid project ID update
            }
            if (updates.assigneeId && !mongoose_1.Types.ObjectId.isValid(updates.assigneeId)) {
                updates.assigneeId = undefined; // Unassign if invalid
            }
            const task = await Task_model_1.default.findByIdAndUpdate(id, updates, { new: true })
                .populate('projectId', 'name')
                .populate('assigneeId', 'firstName lastName avatar');
            if (!task) {
                return res.status(404).json({ status: 'error', message: 'Task not found' });
            }
            return res.json({ status: 'success', data: task });
        }
        catch (error) {
            console.error('Error updating task:', error);
            return res.status(500).json({ status: 'error', message: error.message });
        }
    },
    // Delete task
    deleteTask: async (req, res) => {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ status: 'error', message: 'Invalid Task ID' });
            }
            const task = await Task_model_1.default.findByIdAndDelete(req.params.id);
            if (!task) {
                return res.status(404).json({ status: 'error', message: 'Task not found' });
            }
            return res.json({ status: 'success', message: 'Task deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting task:', error);
            return res.status(500).json({ status: 'error', message: error.message });
        }
    },
};
//# sourceMappingURL=task.controller.js.map