"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = void 0;
const database_1 = __importDefault(require("../config/database"));
const User_model_1 = __importDefault(require("../models/User.model"));
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
const error_middleware_1 = require("../middlewares/error.middleware");
const getUsers = async (req, res, next) => {
    try {
        await (0, database_1.default)();
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const role = req.query.role;
        const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
        const skip = (page - 1) * limit;
        const query = {};
        if (role) {
            query.role = role;
        }
        if (isActive !== undefined) {
            query.isActive = isActive;
        }
        const [users, total] = await Promise.all([
            User_model_1.default.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User_model_1.default.countDocuments(query),
        ]);
        // Get employees for each user
        const userIds = users.map((u) => u._id);
        const employees = await Employee_model_1.default.find({ userId: { $in: userIds } })
            .select('userId employeeId firstName lastName phone department position avatar')
            .lean();
        const employeeMap = new Map(employees.map((emp) => [emp.userId.toString(), emp]));
        const transformedUsers = users.map((user) => {
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
            users: transformedUsers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res, next) => {
    try {
        await (0, database_1.default)();
        const { id } = req.params;
        const user = await User_model_1.default.findById(id).lean();
        if (!user) {
            throw new error_middleware_1.AppError('User not found', 404);
        }
        const employee = await Employee_model_1.default.findOne({ userId: user._id })
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
    }
    catch (error) {
        next(error);
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res, next) => {
    try {
        await (0, database_1.default)();
        const { id } = req.params;
        const { role, isActive } = req.body;
        const user = await User_model_1.default.findById(id);
        if (!user) {
            throw new error_middleware_1.AppError('User not found', 404);
        }
        if (role !== undefined) {
            user.role = role;
        }
        if (isActive !== undefined) {
            user.isActive = isActive;
        }
        await user.save();
        const updatedUser = await User_model_1.default.findById(id).lean();
        const employee = await Employee_model_1.default.findOne({ userId: id })
            .select('employeeId firstName lastName phone department position avatar')
            .lean();
        res.status(200).json({
            message: 'User updated successfully',
            data: {
                id: updatedUser._id.toString(),
                email: updatedUser.email,
                role: updatedUser.role,
                isActive: updatedUser.isActive,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt,
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
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res, next) => {
    try {
        await (0, database_1.default)();
        const { id } = req.params;
        const user = await User_model_1.default.findById(id);
        if (!user) {
            throw new error_middleware_1.AppError('User not found', 404);
        }
        // Delete associated employee if exists
        const employee = await Employee_model_1.default.findOne({ userId: id });
        if (employee) {
            await Employee_model_1.default.findByIdAndDelete(employee._id);
        }
        // Delete user
        await User_model_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.controller.js.map