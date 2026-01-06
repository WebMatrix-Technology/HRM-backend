import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { registerService, loginService } from '../services/auth.service';
import { AppError } from '../middlewares/error.middleware';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import connectDB from '../config/database';
import User from '../models/User.model';
import Employee from '../models/Employee.model';
import { hashPassword, comparePassword } from '../utils/bcrypt';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const result = await registerService(req.body);
    res.status(201).json({
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const result = await loginService(req.body);
    res.status(200).json({
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    await connectDB();

    const user = await User.findById(req.user.userId).lean();

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const employee = await Employee.findOne({ userId: user._id })
      .select('employeeId firstName lastName phone department position avatar')
      .lean();

    res.status(200).json({
      data: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        employee: employee
          ? {
              id: employee._id.toString(),
              employeeId: employee.employeeId,
              firstName: employee.firstName,
              lastName: employee.lastName,
              phone: employee.phone,
              department: employee.department,
              position: employee.position,
              avatar: employee.avatar,
            }
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError('Current password and new password are required', 400);
    }

    if (newPassword.length < 8) {
      throw new AppError('New password must be at least 8 characters long', 400);
    }

    await connectDB();

    const user = await User.findById(req.user.userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const adminChangeUserPassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      throw new AppError('User ID and new password are required', 400);
    }

    if (newPassword.length < 8) {
      throw new AppError('New password must be at least 8 characters long', 400);
    }

    await connectDB();

    // Find the target user
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      throw new AppError('Target user not found', 404);
    }

    // Prevent admins from changing other admins' passwords (optional security measure)
    if (targetUser.role === 'ADMIN' && req.user.userId !== userId) {
      throw new AppError('Cannot change password of another admin', 403);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    targetUser.password = hashedPassword;
    await targetUser.save();

    // Get employee info for logging
    const targetEmployee = await Employee.findOne({ userId: targetUser._id })
      .select('firstName lastName employeeId')
      .lean();

    console.log(`Admin ${req.user.userId} changed password for user ${userId} (${targetEmployee?.firstName} ${targetEmployee?.lastName})`);

    res.status(200).json({
      message: 'User password changed successfully',
      data: {
        userId: targetUser._id.toString(),
        email: targetUser.email,
        employee: targetEmployee ? {
          firstName: targetEmployee.firstName,
          lastName: targetEmployee.lastName,
          employeeId: targetEmployee.employeeId,
        } : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

