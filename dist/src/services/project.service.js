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
exports.getAvailableManagers = exports.getProjectStats = exports.updateProjectProgress = exports.removeProjectMember = exports.addProjectMembers = exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getProjects = void 0;
const database_1 = __importDefault(require("../config/database"));
const Project_model_1 = __importStar(require("../models/Project.model"));
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
const error_middleware_1 = require("../middlewares/error.middleware");
const getProjects = async (page = 1, limit = 20, filters = {}) => {
    await (0, database_1.default)();
    const query = {};
    // Apply filters
    if (filters.status) {
        query.status = filters.status;
    }
    if (filters.priority) {
        query.priority = filters.priority;
    }
    if (filters.managerId) {
        query.managerId = filters.managerId;
    }
    if (filters.search) {
        query.$or = [
            { name: { $regex: filters.search, $options: 'i' } },
            { description: { $regex: filters.search, $options: 'i' } },
        ];
    }
    if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
    }
    if (filters.startDate) {
        query.startDate = { $gte: new Date(filters.startDate) };
    }
    if (filters.endDate) {
        query.endDate = { $lte: new Date(filters.endDate) };
    }
    const skip = (page - 1) * limit;
    const [projects, total] = await Promise.all([
        Project_model_1.default.find(query)
            .populate('managerId', 'firstName lastName avatar')
            .populate('members.employeeId', 'firstName lastName avatar position')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Project_model_1.default.countDocuments(query),
    ]);
    const transformedProjects = projects.map(project => ({
        id: project._id.toString(),
        name: project.name,
        description: project.description,
        status: project.status,
        priority: project.priority,
        startDate: project.startDate.toISOString(),
        endDate: project.endDate?.toISOString(),
        deadline: project.deadline?.toISOString(),
        budget: project.budget,
        progress: project.progress,
        manager: {
            id: project.managerId?._id?.toString() || project.managerId?.toString(),
            firstName: project.managerId?.firstName || 'Unknown',
            lastName: project.managerId?.lastName || 'Manager',
            avatar: project.managerId?.avatar,
        },
        members: project.members.map((member) => ({
            id: member._id.toString(),
            employee: {
                id: member.employeeId._id.toString(),
                firstName: member.employeeId.firstName,
                lastName: member.employeeId.lastName,
                avatar: member.employeeId.avatar,
                position: member.employeeId.position,
            },
            role: member.role,
            joinedAt: member.joinedAt.toISOString(),
        })),
        tags: project.tags,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
    }));
    return {
        projects: transformedProjects,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            limit,
        },
    };
};
exports.getProjects = getProjects;
const getProjectById = async (id) => {
    await (0, database_1.default)();
    const project = await Project_model_1.default.findById(id)
        .populate('managerId', 'firstName lastName avatar position')
        .populate('members.employeeId', 'firstName lastName avatar position')
        .lean();
    if (!project) {
        throw new error_middleware_1.AppError('Project not found', 404);
    }
    return {
        id: project._id.toString(),
        name: project.name,
        description: project.description,
        status: project.status,
        priority: project.priority,
        startDate: project.startDate.toISOString(),
        endDate: project.endDate?.toISOString(),
        deadline: project.deadline?.toISOString(),
        budget: project.budget,
        progress: project.progress,
        manager: {
            id: project.managerId._id.toString(),
            firstName: project.managerId.firstName,
            lastName: project.managerId.lastName,
            avatar: project.managerId.avatar,
            position: project.managerId.position,
        },
        members: project.members.map((member) => ({
            id: member._id.toString(),
            employee: {
                id: member.employeeId._id.toString(),
                firstName: member.employeeId.firstName,
                lastName: member.employeeId.lastName,
                avatar: member.employeeId.avatar,
                position: member.employeeId.position,
            },
            role: member.role,
            joinedAt: member.joinedAt.toISOString(),
        })),
        tags: project.tags,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
    };
};
exports.getProjectById = getProjectById;
const createProject = async (data) => {
    await (0, database_1.default)();
    // Verify manager exists
    const manager = await Employee_model_1.default.findById(data.managerId);
    if (!manager) {
        throw new error_middleware_1.AppError('Manager not found', 404);
    }
    // Verify members exist if provided
    let members = [];
    if (data.memberIds && data.memberIds.length > 0) {
        const employeeMembers = await Employee_model_1.default.find({ _id: { $in: data.memberIds } });
        if (employeeMembers.length !== data.memberIds.length) {
            throw new error_middleware_1.AppError('Some team members not found', 400);
        }
        members = data.memberIds.map(memberId => ({
            employeeId: memberId,
            role: 'MEMBER',
            joinedAt: new Date(),
        }));
    }
    const project = await Project_model_1.default.create({
        name: data.name,
        description: data.description,
        status: data.status || Project_model_1.ProjectStatus.PLANNING,
        priority: data.priority || Project_model_1.ProjectPriority.MEDIUM,
        startDate: data.startDate,
        endDate: data.endDate,
        deadline: data.deadline,
        budget: data.budget,
        managerId: data.managerId,
        members,
        tags: data.tags || [],
    });
    return (0, exports.getProjectById)(project._id.toString());
};
exports.createProject = createProject;
const updateProject = async (id, data) => {
    await (0, database_1.default)();
    const project = await Project_model_1.default.findById(id);
    if (!project) {
        throw new error_middleware_1.AppError('Project not found', 404);
    }
    // Verify manager exists if being updated
    if (data.managerId) {
        const manager = await Employee_model_1.default.findById(data.managerId);
        if (!manager) {
            throw new error_middleware_1.AppError('Manager not found', 404);
        }
    }
    // Update project
    Object.assign(project, data);
    await project.save();
    return (0, exports.getProjectById)(id);
};
exports.updateProject = updateProject;
const deleteProject = async (id) => {
    await (0, database_1.default)();
    const project = await Project_model_1.default.findById(id);
    if (!project) {
        throw new error_middleware_1.AppError('Project not found', 404);
    }
    await Project_model_1.default.findByIdAndDelete(id);
    return { message: 'Project deleted successfully' };
};
exports.deleteProject = deleteProject;
const addProjectMembers = async (id, memberData) => {
    await (0, database_1.default)();
    const project = await Project_model_1.default.findById(id);
    if (!project) {
        throw new error_middleware_1.AppError('Project not found', 404);
    }
    // Verify employees exist
    const employees = await Employee_model_1.default.find({ _id: { $in: memberData.employeeIds } });
    if (employees.length !== memberData.employeeIds.length) {
        throw new error_middleware_1.AppError('Some employees not found', 400);
    }
    // Add members (avoid duplicates)
    const existingMemberIds = project.members.map((m) => m.employeeId.toString());
    const newMembers = memberData.employeeIds
        .filter(empId => !existingMemberIds.includes(empId))
        .map(employeeId => ({
        employeeId: employeeId,
        role: memberData.role || 'MEMBER',
        joinedAt: new Date(),
    }));
    project.members.push(...newMembers);
    await project.save();
    return (0, exports.getProjectById)(id);
};
exports.addProjectMembers = addProjectMembers;
const removeProjectMember = async (id, memberId) => {
    await (0, database_1.default)();
    const project = await Project_model_1.default.findById(id);
    if (!project) {
        throw new error_middleware_1.AppError('Project not found', 404);
    }
    project.members = project.members.filter((member) => member._id?.toString() !== memberId);
    await project.save();
    return (0, exports.getProjectById)(id);
};
exports.removeProjectMember = removeProjectMember;
const updateProjectProgress = async (id, progress) => {
    await (0, database_1.default)();
    if (progress < 0 || progress > 100) {
        throw new error_middleware_1.AppError('Progress must be between 0 and 100', 400);
    }
    const project = await Project_model_1.default.findByIdAndUpdate(id, {
        progress,
        // Automatically mark as completed if progress is 100%
        ...(progress === 100 && { status: Project_model_1.ProjectStatus.COMPLETED })
    }, { new: true });
    if (!project) {
        throw new error_middleware_1.AppError('Project not found', 404);
    }
    return (0, exports.getProjectById)(id);
};
exports.updateProjectProgress = updateProjectProgress;
const getProjectStats = async () => {
    await (0, database_1.default)();
    const [totalProjects, activeProjects, completedProjects, overdueProjects, projectsByStatus, projectsByPriority] = await Promise.all([
        Project_model_1.default.countDocuments(),
        Project_model_1.default.countDocuments({
            status: { $in: [Project_model_1.ProjectStatus.PLANNING, Project_model_1.ProjectStatus.IN_PROGRESS] }
        }),
        Project_model_1.default.countDocuments({ status: Project_model_1.ProjectStatus.COMPLETED }),
        Project_model_1.default.countDocuments({
            deadline: { $lt: new Date() },
            status: { $ne: Project_model_1.ProjectStatus.COMPLETED }
        }),
        Project_model_1.default.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        Project_model_1.default.aggregate([
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ])
    ]);
    const statusCounts = projectsByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
    }, {});
    const priorityCounts = projectsByPriority.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
    }, {});
    return {
        totalProjects,
        activeProjects,
        completedProjects,
        overduedProjects: overdueProjects,
        projectsByStatus: statusCounts,
        projectsByPriority: priorityCounts,
    };
};
exports.getProjectStats = getProjectStats;
const getAvailableManagers = async () => {
    await (0, database_1.default)();
    // Get employees who are managers or have management roles, or all active employees if no managers found
    let managers = await Employee_model_1.default.find({
        isActive: true,
        $or: [
            { position: { $regex: /manager|lead|director|head/i } }
        ]
    })
        .select('firstName lastName avatar position')
        .lean();
    // If no specific managers found, get all active employees
    if (managers.length === 0) {
        managers = await Employee_model_1.default.find({ isActive: true })
            .select('firstName lastName avatar position')
            .lean();
    }
    return managers.map(manager => ({
        id: manager._id.toString(),
        firstName: manager.firstName,
        lastName: manager.lastName,
        avatar: manager.avatar,
        position: manager.position,
    }));
};
exports.getAvailableManagers = getAvailableManagers;
//# sourceMappingURL=project.service.js.map