import { Request, Response } from 'express';
import Task from '../models/Task.model';
import Project from '../models/Project.model';
import '../models/Employee.model'; // Ensure Employee model is registered
import { Types } from 'mongoose';

export const taskController = {
    // Get all tasks (with filters)
    getTasks: async (req: Request, res: Response) => {
        try {
            const { projectId, status, assigneeId, search } = req.query;
            const filter: any = {};

            if (projectId && typeof projectId === 'string' && Types.ObjectId.isValid(projectId)) {
                filter.projectId = projectId;
            }
            if (status) filter.status = status;
            if (assigneeId && typeof assigneeId === 'string' && Types.ObjectId.isValid(assigneeId)) {
                filter.assigneeId = assigneeId;
            }
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                ];
            }

            const tasks = await Task.find(filter)
                .populate('projectId', 'name')
                .populate('assigneeId', 'firstName lastName avatar')
                .sort({ createdAt: -1 });

            res.json({ status: 'success', data: tasks });
        } catch (error: any) {
            console.error('Error fetching tasks:', error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // Get single task
    getTask: async (req: Request, res: Response) => {
        try {
            if (!Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ status: 'error', message: 'Invalid Task ID' });
            }
            const task = await Task.findById(req.params.id)
                .populate('projectId', 'name')
                .populate('assigneeId', 'firstName lastName avatar');

            if (!task) {
                return res.status(404).json({ status: 'error', message: 'Task not found' });
            }

            return res.json({ status: 'success', data: task });
        } catch (error: any) {
            console.error('Error fetching task:', error);
            return res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // Create new task
    createTask: async (req: Request, res: Response) => {
        try {
            const { title, description, status, priority, storyPoints, projectId, assigneeId, tags } = req.body;

            // Validate inputs
            if (!projectId || !Types.ObjectId.isValid(projectId)) {
                return res.status(400).json({ status: 'error', message: 'Invalid or missing Project ID' });
            }

            // Verify project exists
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({ status: 'error', message: 'Project not found' });
            }

            const newTask = new Task({
                title,
                description,
                status,
                priority,
                storyPoints: Number(storyPoints) || 0,
                projectId,
                assigneeId: assigneeId && Types.ObjectId.isValid(assigneeId) ? assigneeId : undefined,
                tags,
            });

            const savedTask = await newTask.save();
            const populatedTask = await Task.findById(savedTask._id)
                .populate('projectId', 'name')
                .populate('assigneeId', 'firstName lastName avatar');

            return res.status(201).json({ status: 'success', data: populatedTask });
        } catch (error: any) {
            console.error('Error creating task:', error);
            return res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // Update task
    updateTask: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { title, description, status, priority, storyPoints, projectId, assigneeId, tags } = req.body;

            if (!Types.ObjectId.isValid(id)) {
                return res.status(400).json({ status: 'error', message: 'Invalid Task ID' });
            }

            const updates: any = {};
            if (title !== undefined) updates.title = title;
            if (description !== undefined) updates.description = description;
            if (status !== undefined) updates.status = status;
            if (priority !== undefined) updates.priority = priority;
            if (storyPoints !== undefined) updates.storyPoints = storyPoints;
            if (tags !== undefined) updates.tags = tags;

            if (projectId !== undefined) {
                if (projectId && Types.ObjectId.isValid(projectId)) {
                    updates.projectId = projectId;
                } else {
                    // If invalid or null/empty provided, do not update (or return error?)
                    // For drag-drop safety, better to ignore invalid project ID
                }
            }

            if (assigneeId !== undefined) {
                if (assigneeId && Types.ObjectId.isValid(assigneeId)) {
                    updates.assigneeId = assigneeId;
                } else if (assigneeId === null || assigneeId === '') {
                    // Allow unassigning
                    updates.assigneeId = null;
                }
            }

            // Note: runValidators: true ensuers enum validation
            const task = await Task.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
                .populate('projectId', 'name')
                .populate('assigneeId', 'firstName lastName avatar');

            if (!task) {
                return res.status(404).json({ status: 'error', message: 'Task not found' });
            }

            return res.json({ status: 'success', data: task });
        } catch (error: any) {
            console.error('Error updating task:', error);
            if (error.name === 'ValidationError' || error.name === 'CastError') {
                return res.status(400).json({ status: 'error', message: error.message });
            }
            return res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // Delete task
    deleteTask: async (req: Request, res: Response) => {
        try {
            if (!Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ status: 'error', message: 'Invalid Task ID' });
            }
            const task = await Task.findByIdAndDelete(req.params.id);

            if (!task) {
                return res.status(404).json({ status: 'error', message: 'Task not found' });
            }

            return res.json({ status: 'success', message: 'Task deleted successfully' });
        } catch (error: any) {
            console.error('Error deleting task:', error);
            return res.status(500).json({ status: 'error', message: error.message });
        }
    },
};
