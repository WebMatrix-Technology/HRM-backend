"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeService = void 0;
const database_1 = __importDefault(require("../config/database"));
const error_middleware_1 = require("../middlewares/error.middleware");
const models_1 = require("../models");
const bcrypt_1 = require("../utils/bcrypt");
const User_model_1 = __importDefault(require("../models/User.model"));
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
exports.employeeService = {
    createEmployee: async (data) => {
        await (0, database_1.default)();
        // Validate required fields
        if (!data.department || !data.position) {
            throw new error_middleware_1.AppError('Department and Position are required fields', 400);
        }
        // Check if email already exists
        const existingUser = await User_model_1.default.findOne({ email: data.email });
        if (existingUser) {
            throw new error_middleware_1.AppError('User with this email already exists', 400);
        }
        // Check if employee ID already exists
        const existingEmployee = await Employee_model_1.default.findOne({ employeeId: data.employeeId });
        if (existingEmployee) {
            throw new error_middleware_1.AppError('Employee with this ID already exists', 400);
        }
        const hashedPassword = await (0, bcrypt_1.hashPassword)(data.password);
        // Create user
        const user = await User_model_1.default.create({
            email: data.email,
            password: hashedPassword,
            role: data.role || models_1.Role.EMPLOYEE,
        });
        // Determine isActive status (default to true if not provided)
        const isActive = data.isActive !== undefined ? data.isActive : true;
        // Create employee
        const employee = await Employee_model_1.default.create({
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
            employmentType: data.employmentType || models_1.EmploymentType.FULL_TIME,
            salary: data.salary,
            isActive: isActive,
        });
        // Synchronize user's isActive with employee's isActive
        if (user.isActive !== isActive) {
            await User_model_1.default.findByIdAndUpdate(user._id, { isActive: isActive });
        }
        // Populate user data
        const populatedEmployee = await Employee_model_1.default.findById(employee._id)
            .populate('userId', 'id email role isActive')
            .lean();
        // Transform userId to user and _id to id
        const { userId, _id, ...rest } = populatedEmployee;
        return {
            ...rest,
            id: _id?.toString() || _id,
            user: userId || null,
        };
    },
    getEmployees: async (page = 1, limit = 20, filters) => {
        await (0, database_1.default)();
        const skip = (page - 1) * limit;
        const query = {};
        if (filters?.department) {
            query.department = filters.department;
        }
        if (filters?.isActive !== undefined) {
            query.isActive = filters.isActive;
        }
        const [employees, total] = await Promise.all([
            Employee_model_1.default.find(query)
                .populate('userId', 'id email role isActive')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Employee_model_1.default.countDocuments(query),
        ]);
        // Transform employees to map userId to user and _id to id
        const transformedEmployees = employees.map((emp) => {
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
    getEmployeeById: async (id) => {
        await (0, database_1.default)();
        const employee = await Employee_model_1.default.findById(id)
            .populate('userId', 'id email role isActive')
            .lean();
        if (!employee) {
            throw new error_middleware_1.AppError('Employee not found', 404);
        }
        // Transform userId to user and _id to id
        const { userId, _id, ...rest } = employee;
        return {
            ...rest,
            id: _id?.toString() || _id,
            user: userId || null,
        };
    },
    updateEmployee: async (id, data) => {
        await (0, database_1.default)();
        const employee = await Employee_model_1.default.findById(id).populate('userId', 'role');
        if (!employee) {
            throw new error_middleware_1.AppError('Employee not found', 404);
        }
        // Check if the employee's user has ADMIN role
        const user = employee.userId;
        if (user && user.role === 'ADMIN') {
            throw new error_middleware_1.AppError('Admin users cannot be edited', 403);
        }
        // Validate required fields - ensure department and position are not empty
        // Check current values if not being updated, or new values if being updated
        const finalDepartment = data.department !== undefined ? data.department : employee.department;
        const finalPosition = data.position !== undefined ? data.position : employee.position;
        if (!finalDepartment || finalDepartment.trim() === '') {
            throw new error_middleware_1.AppError('Department is required', 400);
        }
        if (!finalPosition || finalPosition.trim() === '') {
            throw new error_middleware_1.AppError('Position is required', 400);
        }
        // Update employee fields
        Object.assign(employee, data);
        await employee.save();
        // If isActive is being updated, also update the user
        if (data.isActive !== undefined) {
            await User_model_1.default.findByIdAndUpdate(employee.userId, { isActive: data.isActive });
        }
        const updatedEmployee = await Employee_model_1.default.findById(id)
            .populate('userId', 'id email role isActive')
            .lean();
        // Transform userId to user
        const { userId, ...rest } = updatedEmployee;
        return {
            ...rest,
            user: userId || null,
        };
    },
    deleteEmployee: async (id) => {
        await (0, database_1.default)();
        const employee = await Employee_model_1.default.findById(id).populate('userId', 'role');
        if (!employee) {
            throw new error_middleware_1.AppError('Employee not found', 404);
        }
        // Check if the employee's user has ADMIN role
        const user = employee.userId;
        if (user && user.role === 'ADMIN') {
            throw new error_middleware_1.AppError('Admin users cannot be deleted', 403);
        }
        // Delete employee and user
        await Promise.all([
            Employee_model_1.default.findByIdAndDelete(id),
            User_model_1.default.findByIdAndDelete(employee.userId),
        ]);
    },
    getDepartments: async () => {
        await (0, database_1.default)();
        const departments = await Employee_model_1.default.distinct('department', {
            department: { $ne: null },
        });
        return departments.filter(Boolean);
    },
};
//# sourceMappingURL=employee.service.js.map