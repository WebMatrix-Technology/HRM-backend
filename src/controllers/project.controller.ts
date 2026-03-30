import { Response, NextFunction } from 'express';
import * as projectService from '../services/project.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { AppError } from '../middlewares/error.middleware';
import Employee from '../models/Employee.model';
import { Role } from '../models/User.model';
import { notificationService } from '../services/notification.service';

const authorizeProjectManager = async (req: AuthenticatedRequest, projectId: string): Promise<void> => {
  if (!req.user) throw new AppError('Unauthorized', 401);
  if (req.user.role === Role.ADMIN) {
    return; // Admins bypass this check
  }

  if (req.user.role === Role.MANAGER) {
    const employee = await Employee.findOne({ userId: req.user.userId });
    if (!employee) throw new AppError('Employee record not found', 404);

    const project = await projectService.getProjectById(projectId);
    if (!project) throw new AppError('Project not found', 404);

    if (project.manager.id !== employee._id.toString()) {
      throw new AppError('Forbidden: Only the assigned Project Manager can perform this action', 403);
    }
  } else {
    throw new AppError('Forbidden: Insufficient permissions', 403);
  }
};

export const getProjects = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const filters = {
      status: req.query.status as any,
      priority: req.query.priority as any,
      managerId: req.query.managerId as string,
      search: req.query.search as string,
      tags: req.query.tags ? (Array.isArray(req.query.tags) ? req.query.tags : [req.query.tags]) as string[] : undefined,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof typeof filters] === undefined || filters[key as keyof typeof filters] === '') {
        delete filters[key as keyof typeof filters];
      }
    });

    // For non-admin users, only show projects they manage or are a member of
    if (req.user && req.user.role !== Role.ADMIN) {
      const employee = await Employee.findOne({ userId: req.user.userId });
      if (employee) {
        (filters as any).employeeId = employee._id.toString();
      }
    }

    const result = await projectService.getProjects(page, limit, filters);

    res.status(200).json({
      message: 'Projects retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await projectService.getProjectById(id);

    res.status(200).json({
      message: 'Project retrieved successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const projectData = {
      ...req.body,
      startDate: new Date(req.body.startDate),
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
      deadline: req.body.deadline ? new Date(req.body.deadline) : undefined,
    };

    const project = await projectService.createProject(projectData);

    // Notify HR and Admins
    notificationService.notifyRoles(
      [Role.ADMIN, Role.HR_MANAGER],
      {
        title: 'New Project Created',
        message: `A new project "${project.name}" has been created.`,
        type: 'info',
        link: `/projects/${project.id}`
      }
    ).catch(err => console.error('Failed to notify about new project:', err));

    res.status(201).json({
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
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
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;
    await projectService.deleteProject(id);

    res.status(200).json({
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const addProjectMembers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;
    await authorizeProjectManager(req, id);

    const { employeeIds, role } = req.body;

    if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
      throw new AppError('Employee IDs are required', 400);
    }

    const project = await projectService.addProjectMembers(id, { employeeIds, role });

    res.status(200).json({
      message: 'Project members added successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const removeProjectMember = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id, memberId } = req.params;
    await authorizeProjectManager(req, id);

    const project = await projectService.removeProjectMember(id, memberId);

    res.status(200).json({
      message: 'Project member removed successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProjectProgress = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;
    await authorizeProjectManager(req, id);

    const { progress } = req.body;

    if (typeof progress !== 'number') {
      throw new AppError('Progress must be a number', 400);
    }

    const project = await projectService.updateProjectProgress(id, progress);

    res.status(200).json({
      message: 'Project progress updated successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectStats = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await projectService.getProjectStats();

    res.status(200).json({
      message: 'Project statistics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailableManagers = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const managers = await projectService.getAvailableManagers();

    res.status(200).json({
      message: 'Available managers retrieved successfully',
      data: managers,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectTemplates = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
  } catch (error) {
    next(error);
  }
};

export const exportProjects = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const format = req.query.format as string || 'csv';

    // For now, just return a simple message
    // In a real implementation, you would generate CSV/Excel files
    res.status(200).json({
      message: `Project export in ${format} format - implementation needed`,
      data: { format, note: 'Export functionality to be implemented' },
    });
  } catch (error) {
    next(error);
  }
};
