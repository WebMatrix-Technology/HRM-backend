import { ProjectStatus, ProjectPriority } from '../models/Project.model';
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
export declare const getProjects: (page?: number, limit?: number, filters?: ProjectFilters) => Promise<{
    projects: {
        id: string;
        name: string;
        description: string | undefined;
        status: ProjectStatus;
        priority: ProjectPriority;
        startDate: string;
        endDate: string | undefined;
        deadline: string | undefined;
        budget: number | undefined;
        progress: number;
        manager: {
            id: any;
            firstName: any;
            lastName: any;
            avatar: any;
        };
        members: {
            id: any;
            employee: {
                id: any;
                firstName: any;
                lastName: any;
                avatar: any;
                position: any;
            };
            role: any;
            joinedAt: any;
        }[];
        tags: string[];
        createdAt: string;
        updatedAt: string;
    }[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        limit: number;
    };
}>;
export declare const getProjectById: (id: string) => Promise<{
    id: string;
    name: string;
    description: string | undefined;
    status: ProjectStatus;
    priority: ProjectPriority;
    startDate: string;
    endDate: string | undefined;
    deadline: string | undefined;
    budget: number | undefined;
    progress: number;
    manager: {
        id: any;
        firstName: any;
        lastName: any;
        avatar: any;
        position: any;
    };
    members: {
        id: any;
        employee: {
            id: any;
            firstName: any;
            lastName: any;
            avatar: any;
            position: any;
        };
        role: any;
        joinedAt: any;
    }[];
    tags: string[];
    createdAt: string;
    updatedAt: string;
}>;
export declare const createProject: (data: CreateProjectData) => Promise<{
    id: string;
    name: string;
    description: string | undefined;
    status: ProjectStatus;
    priority: ProjectPriority;
    startDate: string;
    endDate: string | undefined;
    deadline: string | undefined;
    budget: number | undefined;
    progress: number;
    manager: {
        id: any;
        firstName: any;
        lastName: any;
        avatar: any;
        position: any;
    };
    members: {
        id: any;
        employee: {
            id: any;
            firstName: any;
            lastName: any;
            avatar: any;
            position: any;
        };
        role: any;
        joinedAt: any;
    }[];
    tags: string[];
    createdAt: string;
    updatedAt: string;
}>;
export declare const updateProject: (id: string, data: UpdateProjectData) => Promise<{
    id: string;
    name: string;
    description: string | undefined;
    status: ProjectStatus;
    priority: ProjectPriority;
    startDate: string;
    endDate: string | undefined;
    deadline: string | undefined;
    budget: number | undefined;
    progress: number;
    manager: {
        id: any;
        firstName: any;
        lastName: any;
        avatar: any;
        position: any;
    };
    members: {
        id: any;
        employee: {
            id: any;
            firstName: any;
            lastName: any;
            avatar: any;
            position: any;
        };
        role: any;
        joinedAt: any;
    }[];
    tags: string[];
    createdAt: string;
    updatedAt: string;
}>;
export declare const deleteProject: (id: string) => Promise<{
    message: string;
}>;
export declare const addProjectMembers: (id: string, memberData: {
    employeeIds: string[];
    role: string;
}) => Promise<{
    id: string;
    name: string;
    description: string | undefined;
    status: ProjectStatus;
    priority: ProjectPriority;
    startDate: string;
    endDate: string | undefined;
    deadline: string | undefined;
    budget: number | undefined;
    progress: number;
    manager: {
        id: any;
        firstName: any;
        lastName: any;
        avatar: any;
        position: any;
    };
    members: {
        id: any;
        employee: {
            id: any;
            firstName: any;
            lastName: any;
            avatar: any;
            position: any;
        };
        role: any;
        joinedAt: any;
    }[];
    tags: string[];
    createdAt: string;
    updatedAt: string;
}>;
export declare const removeProjectMember: (id: string, memberId: string) => Promise<{
    id: string;
    name: string;
    description: string | undefined;
    status: ProjectStatus;
    priority: ProjectPriority;
    startDate: string;
    endDate: string | undefined;
    deadline: string | undefined;
    budget: number | undefined;
    progress: number;
    manager: {
        id: any;
        firstName: any;
        lastName: any;
        avatar: any;
        position: any;
    };
    members: {
        id: any;
        employee: {
            id: any;
            firstName: any;
            lastName: any;
            avatar: any;
            position: any;
        };
        role: any;
        joinedAt: any;
    }[];
    tags: string[];
    createdAt: string;
    updatedAt: string;
}>;
export declare const updateProjectProgress: (id: string, progress: number) => Promise<{
    id: string;
    name: string;
    description: string | undefined;
    status: ProjectStatus;
    priority: ProjectPriority;
    startDate: string;
    endDate: string | undefined;
    deadline: string | undefined;
    budget: number | undefined;
    progress: number;
    manager: {
        id: any;
        firstName: any;
        lastName: any;
        avatar: any;
        position: any;
    };
    members: {
        id: any;
        employee: {
            id: any;
            firstName: any;
            lastName: any;
            avatar: any;
            position: any;
        };
        role: any;
        joinedAt: any;
    }[];
    tags: string[];
    createdAt: string;
    updatedAt: string;
}>;
export declare const getProjectStats: () => Promise<{
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    overduedProjects: number;
    projectsByStatus: any;
    projectsByPriority: any;
}>;
export declare const getAvailableManagers: () => Promise<{
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | undefined;
    position: string | undefined;
}[]>;
//# sourceMappingURL=project.service.d.ts.map