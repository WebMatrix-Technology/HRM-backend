import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import connectDB from '../config/database';
import User from '../models/User.model';
import Employee from '../models/Employee.model';
import { AppError } from '../middlewares/error.middleware';

export const getUsers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await connectDB();

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const role = req.query.role as string | undefined;
    const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;

    const skip = (page - 1) * limit;
    const query: any = {};

    if (role) {
      query.role = role;
    }

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    // Get employees for each user
    const userIds = users.map((u: any) => u._id);
    const employees = await Employee.find({ userId: { $in: userIds } })
      .select('userId employeeId firstName lastName phone department position avatar')
      .lean();

    const employeeMap = new Map(
      employees.map((emp: any) => [emp.userId.toString(), emp])
    );

    const transformedUsers = users.map((user: any) => {
      const employee = employeeMap.get(user._id.toString());
      return {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
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
      };
    });

    res.status(200).json({
      data: {
        users: transformedUsers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await connectDB();

    const { id } = req.params;
    const user = await User.findById(id).lean();

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
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
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

export const updateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await connectDB();

    const { id } = req.params;
    const { role, isActive } = req.body;

    const user = await User.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (role !== undefined) {
      user.role = role;
    }

    if (isActive !== undefined) {
      user.isActive = isActive;

      // Synchronize employee's isActive with user's isActive
      const employee = await Employee.findOne({ userId: id });
      if (employee && employee.isActive !== isActive) {
        employee.isActive = isActive;
        await employee.save();
      }
    }

    await user.save();

    const updatedUser = await User.findById(id).lean();
    const employee = await Employee.findOne({ userId: id })
      .select('employeeId firstName lastName phone department position avatar')
      .lean();

    res.status(200).json({
      message: 'User updated successfully',
      data: {
        id: updatedUser!._id.toString(),
        email: updatedUser!.email,
        role: updatedUser!.role,
        isActive: updatedUser!.isActive,
        createdAt: updatedUser!.createdAt,
        updatedAt: updatedUser!.updatedAt,
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

export const deleteUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await connectDB();

    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Delete associated employee if exists
    const employee = await Employee.findOne({ userId: id });
    if (employee) {
      await Employee.findByIdAndDelete(employee._id);
    }

    // Delete user
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};


