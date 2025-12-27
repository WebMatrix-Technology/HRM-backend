import connectDB from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { EmploymentType, Role } from '../models';
import { hashPassword } from '../utils/bcrypt';
import User from '../models/User.model';
import Employee from '../models/Employee.model';

export interface CreateEmployeeData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  phone?: string;
  dateOfBirth?: Date;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  department?: string;
  position?: string;
  employmentType?: EmploymentType;
  salary?: number;
  role?: Role;
  isActive?: boolean;
}

export interface UpdateEmployeeData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: Date;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  department?: string;
  position?: string;
  employmentType?: EmploymentType;
  salary?: number;
  isActive?: boolean;
}

export const employeeService = {
  createEmployee: async (data: CreateEmployeeData) => {
    await connectDB();

    // Validate required fields
    if (!data.department || !data.position) {
      throw new AppError('Department and Position are required fields', 400);
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Check if employee ID already exists
    const existingEmployee = await Employee.findOne({ employeeId: data.employeeId });

    if (existingEmployee) {
      throw new AppError('Employee with this ID already exists', 400);
    }

    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await User.create({
      email: data.email,
      password: hashedPassword,
      role: data.role || Role.EMPLOYEE,
    });

    // Determine isActive status (default to true if not provided)
    const isActive = data.isActive !== undefined ? data.isActive : true;

    // Create employee
    const employee = await Employee.create({
      userId: user._id,
      employeeId: data.employeeId,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
      department: data.department,
      position: data.position,
      employmentType: data.employmentType || EmploymentType.FULL_TIME,
      salary: data.salary,
      isActive: isActive,
    });

    // Synchronize user's isActive with employee's isActive
    if (user.isActive !== isActive) {
      await User.findByIdAndUpdate(user._id, { isActive: isActive });
    }

    // Populate user data
    const populatedEmployee = await Employee.findById(employee._id)
      .populate('userId', 'id email role isActive')
      .lean();

    // Transform userId to user and _id to id
    const { userId, _id, ...rest } = populatedEmployee as any;
    return {
      ...rest,
      id: _id?.toString() || _id,
      user: userId || null,
    };
  },

  getEmployees: async (page = 1, limit = 20, filters?: { department?: string; isActive?: boolean }) => {
    await connectDB();

    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters?.department) {
      query.department = filters.department;
    }

    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const [employees, total] = await Promise.all([
      Employee.find(query)
        .populate('userId', 'id email role isActive')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Employee.countDocuments(query),
    ]);

    // Transform employees to map userId to user and _id to id
    const transformedEmployees = employees.map((emp: any) => {
      const { userId, _id, ...rest } = emp;
      return {
        ...rest,
        id: _id?.toString() || _id,
        user: userId || null,
      };
    });

    return {
      employees: transformedEmployees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  getEmployeeById: async (id: string) => {
    await connectDB();

    const employee = await Employee.findById(id)
      .populate('userId', 'id email role isActive')
      .lean();

    if (!employee) {
      throw new AppError('Employee not found', 404);
    }

    // Transform userId to user and _id to id
    const { userId, _id, ...rest } = employee as any;
    return {
      ...rest,
      id: _id?.toString() || _id,
      user: userId || null,
    };
  },

  updateEmployee: async (id: string, data: UpdateEmployeeData) => {
    await connectDB();

    const employee = await Employee.findById(id).populate('userId', 'role');

    if (!employee) {
      throw new AppError('Employee not found', 404);
    }

    // Check if the employee's user has ADMIN role
    const user = employee.userId as any;
    if (user && user.role === 'ADMIN') {
      throw new AppError('Admin users cannot be edited', 403);
    }

    // Validate required fields - ensure department and position are not empty
    // Check current values if not being updated, or new values if being updated
    const finalDepartment = data.department !== undefined ? data.department : employee.department;
    const finalPosition = data.position !== undefined ? data.position : employee.position;

    if (!finalDepartment || finalDepartment.trim() === '') {
      throw new AppError('Department is required', 400);
    }
    if (!finalPosition || finalPosition.trim() === '') {
      throw new AppError('Position is required', 400);
    }

    // Update employee fields
    Object.assign(employee, data);
    await employee.save();

    // If isActive is being updated, also update the user
    if (data.isActive !== undefined) {
      await User.findByIdAndUpdate(employee.userId, { isActive: data.isActive });
    }

    const updatedEmployee = await Employee.findById(id)
      .populate('userId', 'id email role isActive')
      .lean();

    // Transform userId to user
    const { userId, ...rest } = updatedEmployee as any;
    return {
      ...rest,
      user: userId || null,
    };
  },

  deleteEmployee: async (id: string) => {
    await connectDB();

    const employee = await Employee.findById(id).populate('userId', 'role');

    if (!employee) {
      throw new AppError('Employee not found', 404);
    }

    // Check if the employee's user has ADMIN role
    const user = employee.userId as any;
    if (user && user.role === 'ADMIN') {
      throw new AppError('Admin users cannot be deleted', 403);
    }

    // Delete employee and user
    await Promise.all([
      Employee.findByIdAndDelete(id),
      User.findByIdAndDelete(employee.userId),
    ]);
  },

  getDepartments: async () => {
    await connectDB();

    const departments = await Employee.distinct('department', {
      department: { $ne: null },
    });

    return departments.filter(Boolean);
  },
};
