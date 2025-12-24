"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.getMe = exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const auth_service_1 = require("../services/auth.service");
const error_middleware_1 = require("../middlewares/error.middleware");
const database_1 = __importDefault(require("../config/database"));
const User_model_1 = __importDefault(require("../models/User.model"));
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
const bcrypt_1 = require("../utils/bcrypt");
const register = async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const result = await (0, auth_service_1.registerService)(req.body);
        res.status(201).json({
            message: 'User registered successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const result = await (0, auth_service_1.loginService)(req.body);
        res.status(200).json({
            message: 'Login successful',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new error_middleware_1.AppError('Unauthorized', 401);
        }
        await (0, database_1.default)();
        const user = await User_model_1.default.findById(req.user.userId).lean();
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
exports.getMe = getMe;
const changePassword = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new error_middleware_1.AppError('Unauthorized', 401);
        }
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            throw new error_middleware_1.AppError('Current password and new password are required', 400);
        }
        if (newPassword.length < 8) {
            throw new error_middleware_1.AppError('New password must be at least 8 characters long', 400);
        }
        await (0, database_1.default)();
        const user = await User_model_1.default.findById(req.user.userId);
        if (!user) {
            throw new error_middleware_1.AppError('User not found', 404);
        }
        // Verify current password
        const isPasswordValid = await (0, bcrypt_1.comparePassword)(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new error_middleware_1.AppError('Current password is incorrect', 400);
        }
        // Hash new password
        const hashedPassword = await (0, bcrypt_1.hashPassword)(newPassword);
        // Update password
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({
            message: 'Password changed successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.changePassword = changePassword;
//# sourceMappingURL=auth.controller.js.map