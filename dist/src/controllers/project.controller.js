"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProjectReport = exports.exportProjects = exports.getProjectTemplates = exports.getAvailableManagers = exports.getProjectStats = exports.updateProjectProgress = exports.removeProjectMember = exports.addProjectMembers = exports.deleteProject = exports.updateProject = exports.createProject = exports.getProject = exports.getProjects = void 0;
const projectService = __importStar(require("../services/project.service"));
const error_middleware_1 = require("../middlewares/error.middleware");
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
const User_model_1 = require("../models/User.model");
const notification_service_1 = require("../services/notification.service");
const authorizeProjectManager = async (req, projectId) => {
    if (!req.user)
        throw new error_middleware_1.AppError('Unauthorized', 401);
    if (req.user.role === User_model_1.Role.ADMIN) {
        return; // Admins bypass this check
    }
    if (req.user.role === User_model_1.Role.MANAGER) {
        const employee = await Employee_model_1.default.findOne({ userId: req.user.userId });
        if (!employee)
            throw new error_middleware_1.AppError('Employee record not found', 404);
        const project = await projectService.getProjectById(projectId);
        if (!project)
            throw new error_middleware_1.AppError('Project not found', 404);
        if (project.manager.id !== employee._id.toString()) {
            throw new error_middleware_1.AppError('Forbidden: Only the assigned Project Manager can perform this action', 403);
        }
    }
    else {
        throw new error_middleware_1.AppError('Forbidden: Insufficient permissions', 403);
    }
};
const getProjects = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const filters = {
            status: req.query.status,
            priority: req.query.priority,
            managerId: req.query.managerId,
            search: req.query.search,
            tags: req.query.tags ? (Array.isArray(req.query.tags) ? req.query.tags : [req.query.tags]) : undefined,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        };
        // Remove undefined values
        Object.keys(filters).forEach(key => {
            if (filters[key] === undefined || filters[key] === '') {
                delete filters[key];
            }
        });
        // For non-admin users, only show projects they manage or are a member of
        if (req.user && req.user.role !== User_model_1.Role.ADMIN) {
            const employee = await Employee_model_1.default.findOne({ userId: req.user.userId });
            if (employee) {
                filters.employeeId = employee._id.toString();
            }
        }
        const result = await projectService.getProjects(page, limit, filters);
        res.status(200).json({
            message: 'Projects retrieved successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProjects = getProjects;
const getProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const project = await projectService.getProjectById(id);
        res.status(200).json({
            message: 'Project retrieved successfully',
            data: project,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProject = getProject;
const createProject = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new error_middleware_1.AppError('Unauthorized', 401);
        }
        const projectData = {
            ...req.body,
            startDate: new Date(req.body.startDate),
            endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
            deadline: req.body.deadline ? new Date(req.body.deadline) : undefined,
        };
        const project = await projectService.createProject(projectData);
        // Notify HR and Admins
        notification_service_1.notificationService.notifyRoles([User_model_1.Role.ADMIN, User_model_1.Role.HR_MANAGER], {
            title: 'New Project Created',
            message: `A new project "${project.name}" has been created.`,
            type: 'info',
            link: `/projects/${project.id}`
        }).catch(err => console.error('Failed to notify about new project:', err));
        res.status(201).json({
            message: 'Project created successfully',
            data: project,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createProject = createProject;
const updateProject = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new error_middleware_1.AppError('Unauthorized', 401);
        }
        const { id } = req.params;
        await authorizeProjectManager(req, id);
        const updateData = { ...req.body };
        // Convert date strings to Date objects if present
        if (updateData.startDate) {
            updateData.startDate = new Date(updateData.startDate);
        }
        if (updateData.endDate) {
            updateData.endDate = new Date(updateData.endDate);
        }
        if (updateData.deadline) {
            updateData.deadline = new Date(updateData.deadline);
        }
        const project = await projectService.updateProject(id, updateData);
        res.status(200).json({
            message: 'Project updated successfully',
            data: project,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new error_middleware_1.AppError('Unauthorized', 401);
        }
        const { id } = req.params;
        await projectService.deleteProject(id);
        res.status(200).json({
            message: 'Project deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProject = deleteProject;
const addProjectMembers = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new error_middleware_1.AppError('Unauthorized', 401);
        }
        const { id } = req.params;
        await authorizeProjectManager(req, id);
        const { employeeIds, role } = req.body;
        if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
            throw new error_middleware_1.AppError('Employee IDs are required', 400);
        }
        const project = await projectService.addProjectMembers(id, { employeeIds, role });
        res.status(200).json({
            message: 'Project members added successfully',
            data: project,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.addProjectMembers = addProjectMembers;
const removeProjectMember = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new error_middleware_1.AppError('Unauthorized', 401);
        }
        const { id, memberId } = req.params;
        await authorizeProjectManager(req, id);
        const project = await projectService.removeProjectMember(id, memberId);
        res.status(200).json({
            message: 'Project member removed successfully',
            data: project,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.removeProjectMember = removeProjectMember;
const updateProjectProgress = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new error_middleware_1.AppError('Unauthorized', 401);
        }
        const { id } = req.params;
        await authorizeProjectManager(req, id);
        const { progress } = req.body;
        if (typeof progress !== 'number') {
            throw new error_middleware_1.AppError('Progress must be a number', 400);
        }
        const project = await projectService.updateProjectProgress(id, progress);
        res.status(200).json({
            message: 'Project progress updated successfully',
            data: project,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProjectProgress = updateProjectProgress;
const getProjectStats = async (_req, res, next) => {
    try {
        const stats = await projectService.getProjectStats();
        res.status(200).json({
            message: 'Project statistics retrieved successfully',
            data: stats,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProjectStats = getProjectStats;
const getAvailableManagers = async (_req, res, next) => {
    try {
        const managers = await projectService.getAvailableManagers();
        res.status(200).json({
            message: 'Available managers retrieved successfully',
            data: managers,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAvailableManagers = getAvailableManagers;
const getProjectTemplates = async (_req, res, next) => {
    try {
        // For now, return some basic templates
        const templates = [
            {
                id: '1',
                name: 'Web Development Project',
                description: 'Standard web development project template',
                defaultTags: ['web', 'development', 'frontend', 'backend'],
                estimatedDuration: 90, // days
            },
            {
                id: '2',
                name: 'Mobile App Project',
                description: 'Mobile application development template',
                defaultTags: ['mobile', 'app', 'ios', 'android'],
                estimatedDuration: 120,
            },
            {
                id: '3',
                name: 'Marketing Campaign',
                description: 'Marketing campaign project template',
                defaultTags: ['marketing', 'campaign', 'digital', 'social'],
                estimatedDuration: 60,
            },
            {
                id: '4',
                name: 'Data Analysis Project',
                description: 'Data analysis and reporting project',
                defaultTags: ['data', 'analysis', 'reporting', 'analytics'],
                estimatedDuration: 45,
            },
        ];
        res.status(200).json({
            message: 'Project templates retrieved successfully',
            data: templates,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProjectTemplates = getProjectTemplates;
const exportProjects = async (req, res, next) => {
    try {
        const format = req.query.format || 'csv';
        // For now, just return a simple message
        // In a real implementation, you would generate CSV/Excel files
        res.status(200).json({
            message: `Project export in ${format} format - implementation needed`,
            data: { format, note: 'Export functionality to be implemented' },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.exportProjects = exportProjects;
const uploadProjectReport = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new error_middleware_1.AppError('Unauthorized', 401);
        }
        const { id } = req.params;
        await authorizeProjectManager(req, id);
        if (!req.file) {
            throw new error_middleware_1.AppError('No file uploaded', 400);
        }
        const { reportText } = req.body;
        const filePath = req.file.path.replace(/\\/g, '/');
        // Update project with report text and file path
        const project = await projectService.updateProject(id, {
            status: 'COMPLETED',
            completionReport: reportText,
            completionReportFile: filePath,
        });
        res.status(200).json({
            message: 'Project report uploaded and project completed',
            data: project,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadProjectReport = uploadProjectReport;
//# sourceMappingURL=project.controller.js.map