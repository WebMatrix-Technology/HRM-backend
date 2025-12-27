import connectDB from '../config/database';
import User, { Role } from '../models/User.model';
import Employee from '../models/Employee.model';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { AppError } from '../middlewares/error.middleware';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  role?: Role;
  phone?: string;
  department?: string;
  position?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const registerService = async (data: RegisterData) => {
  await connectDB();

  // Check if user already exists
  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  // Check if employee ID already exists
  const existingEmployee = await Employee.findOne({ employeeId: data.employeeId });

  if (existingEmployee) {
    throw new AppError('Employee with this ID already exists', 400);
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  // Create user
  const user = await User.create({
    email: data.email,
    password: hashedPassword,
    role: data.role || Role.EMPLOYEE,
  });

  // Create employee
  const employee = await Employee.create({
    userId: user._id,
    employeeId: data.employeeId,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    department: data.department,
    position: data.position,
  });

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    employee: {
      id: employee._id.toString(),
      employeeId: employee.employeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
    },
    accessToken,
    refreshToken,
  };
};

export const loginService = async (data: LoginData) => {
  await connectDB();

  // Find user with employee
  const user = await User.findOne({ email: data.email }).lean();

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError('Account is deactivated', 403);
  }

  // Verify password
  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Find employee
  const employee = await Employee.findOne({ userId: user._id }).lean();

  // If employee exists, check if employee is active
  if (employee && !employee.isActive) {
    throw new AppError('Employee account is deactivated', 403);
  }

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    employee: employee
      ? {
          id: employee._id.toString(),
          employeeId: employee.employeeId,
          firstName: employee.firstName,
          lastName: employee.lastName,
        }
      : null,
    accessToken,
    refreshToken,
  };
};
