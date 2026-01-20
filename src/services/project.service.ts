import connectDB from '../config/database';
import Project, { ProjectStatus, ProjectPriority } from '../models/Project.model';
import Employee from '../models/Employee.model';
import { AppError } from '../middlewares/error.middleware';

export interface CreateProjectData {
  name: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  startDate: Date;
  endDate?: Date;
  deadline?: Date;
  budget?: number;
  managerId: string;
  memberIds?: string[];
  tags?: string[];
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  startDate?: Date;
  endDate?: Date;
  deadline?: Date;
  budget?: number;
  managerId?: string;
  progress?: number;
  tags?: string[];
}

export interface ProjectFilters {
  status?: ProjectStatus;
  priority?: ProjectPriority;
  managerId?: string;
  search?: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
}

export const getProjects = async (
  page: number = 1,
  limit: number = 20,
  filters: ProjectFilters = {}
) => {
  await connectDB();

  const query: any = {};

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
    Project.find(query)
      .populate('managerId', 'firstName lastName avatar')
      .populate('members.employeeId', 'firstName lastName avatar position')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Project.countDocuments(query),
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
    manager: project.managerId ? {
      id: (project.managerId as any)._id?.toString() || 'unknown',
      firstName: (project.managerId as any).firstName || 'Unknown',
      lastName: (project.managerId as any).lastName || 'Manager',
      avatar: (project.managerId as any).avatar,
    } : {
      id: 'unknown',
      firstName: 'Unknown',
      lastName: 'Manager',
      avatar: undefined
    },
    members: project.members
      .filter((member: any) => member.employeeId) // Filter out members with missing employee records
      .map((member: any) => ({
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

export const getProjectById = async (id: string) => {
  await connectDB();

  const project = await Project.findById(id)
    .populate('managerId', 'firstName lastName avatar position')
    .populate('members.employeeId', 'firstName lastName avatar position')
    .lean();

  if (!project) {
    throw new AppError('Project not found', 404);
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
    manager: project.managerId ? {
      id: (project.managerId as any)._id?.toString() || 'unknown',
      firstName: (project.managerId as any).firstName || 'Unknown',
      lastName: (project.managerId as any).lastName || 'Manager',
      avatar: (project.managerId as any).avatar,
      position: (project.managerId as any).position,
    } : {
      id: 'unknown',
      firstName: 'Unknown',
      lastName: 'Manager',
      avatar: undefined,
      position: undefined
    },
    members: project.members
      .filter((member: any) => member.employeeId)
      .map((member: any) => ({
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

export const createProject = async (data: CreateProjectData) => {
  await connectDB();

  // Verify manager exists
  const manager = await Employee.findById(data.managerId);
  if (!manager) {
    throw new AppError('Manager not found', 404);
  }

  // Verify members exist if provided
  let members: any[] = [];
  if (data.memberIds && data.memberIds.length > 0) {
    const employeeMembers = await Employee.find({ _id: { $in: data.memberIds } });
    if (employeeMembers.length !== data.memberIds.length) {
      throw new AppError('Some team members not found', 400);
    }
    members = data.memberIds.map(memberId => ({
      employeeId: memberId as any,
      role: 'MEMBER',
      joinedAt: new Date(),
    }));
  }

  const project = await Project.create({
    name: data.name,
    description: data.description,
    status: data.status || ProjectStatus.PLANNING,
    priority: data.priority || ProjectPriority.MEDIUM,
    startDate: data.startDate,
    endDate: data.endDate,
    deadline: data.deadline,
    budget: data.budget,
    managerId: data.managerId,
    members,
    tags: data.tags || [],
  });

  return getProjectById(project._id.toString());
};

export const updateProject = async (id: string, data: UpdateProjectData) => {
  await connectDB();

  const project = await Project.findById(id);
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // Verify manager exists if being updated
  if (data.managerId) {
    const manager = await Employee.findById(data.managerId);
    if (!manager) {
      throw new AppError('Manager not found', 404);
    }
  }

  // Update project
  Object.assign(project, data);
  await project.save();

  return getProjectById(id);
};

export const deleteProject = async (id: string) => {
  await connectDB();

  const project = await Project.findById(id);
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  await Project.findByIdAndDelete(id);
  return { message: 'Project deleted successfully' };
};

export const addProjectMembers = async (
  id: string,
  memberData: { employeeIds: string[], role: string }
) => {
  await connectDB();

  const project = await Project.findById(id);
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // Verify employees exist
  const employees = await Employee.find({ _id: { $in: memberData.employeeIds } });
  if (employees.length !== memberData.employeeIds.length) {
    throw new AppError('Some employees not found', 400);
  }

  // Add members (avoid duplicates)
  const existingMemberIds = project.members.map((m: any) => m.employeeId.toString());
  const newMembers = memberData.employeeIds
    .filter(empId => !existingMemberIds.includes(empId))
    .map(employeeId => ({
      employeeId: employeeId as any,
      role: memberData.role || 'MEMBER',
      joinedAt: new Date(),
    }));

  project.members.push(...newMembers);
  await project.save();

  return getProjectById(id);
};

export const removeProjectMember = async (id: string, memberId: string) => {
  await connectDB();

  const project = await Project.findById(id);
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  project.members = project.members.filter(
    (member: any) => member._id?.toString() !== memberId
  );

  await project.save();
  return getProjectById(id);
};

export const updateProjectProgress = async (id: string, progress: number) => {
  await connectDB();

  if (progress < 0 || progress > 100) {
    throw new AppError('Progress must be between 0 and 100', 400);
  }

  const project = await Project.findByIdAndUpdate(
    id,
    {
      progress,
      // Automatically mark as completed if progress is 100%
      ...(progress === 100 && { status: ProjectStatus.COMPLETED })
    },
    { new: true }
  );

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  return getProjectById(id);
};

export const getProjectStats = async () => {
  await connectDB();

  const [
    totalProjects,
    activeProjects,
    completedProjects,
    overdueProjects,
    projectsByStatus,
    projectsByPriority
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({
      status: { $in: [ProjectStatus.PLANNING, ProjectStatus.IN_PROGRESS] }
    }),
    Project.countDocuments({ status: ProjectStatus.COMPLETED }),
    Project.countDocuments({
      deadline: { $lt: new Date() },
      status: { $ne: ProjectStatus.COMPLETED }
    }),
    Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    Project.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ])
  ]);

  const statusCounts = projectsByStatus.reduce((acc: any, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  const priorityCounts = projectsByPriority.reduce((acc: any, item) => {
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

export const getAvailableManagers = async () => {
  await connectDB();

  // Get employees who are managers or have management roles, or all active employees if no managers found
  let managers = await Employee.find({
    isActive: true,
    $or: [
      { position: { $regex: /manager|lead|director|head/i } }
    ]
  })
    .select('firstName lastName avatar position')
    .lean();

  // If no specific managers found, get all active employees
  if (managers.length === 0) {
    managers = await Employee.find({ isActive: true })
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
