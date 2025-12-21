"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = exports.registerService = void 0;
const database_1 = __importDefault(require("../config/database"));
const User_model_1 = __importStar(require("../models/User.model"));
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
const bcrypt_1 = require("../utils/bcrypt");
const jwt_1 = require("../utils/jwt");
const error_middleware_1 = require("../middlewares/error.middleware");
const registerService = async (data) => {
    await (0, database_1.default)();
    // Check if user already exists
    const existingUser = await User_model_1.default.findOne({ email: data.email });
    if (existingUser) {
        throw new error_middleware_1.AppError('User with this email already exists', 400);
    }
    // Check if employee ID already exists
    const existingEmployee = await Employee_model_1.default.findOne({ employeeId: data.employeeId });
    if (existingEmployee) {
        throw new error_middleware_1.AppError('Employee with this ID already exists', 400);
    }
    // Hash password
    const hashedPassword = await (0, bcrypt_1.hashPassword)(data.password);
    // Create user
    const user = await User_model_1.default.create({
        email: data.email,
        password: hashedPassword,
        role: data.role || User_model_1.Role.EMPLOYEE,
    });
    // Create employee
    const employee = await Employee_model_1.default.create({
        userId: user._id,
        employeeId: data.employeeId,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        department: data.department,
        position: data.position,
    });
    // Generate tokens
    const accessToken = (0, jwt_1.generateAccessToken)({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    const refreshToken = (0, jwt_1.generateRefreshToken)({
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
exports.registerService = registerService;
const loginService = async (data) => {
    await (0, database_1.default)();
    // Find user with employee
    const user = await User_model_1.default.findOne({ email: data.email }).lean();
    if (!user) {
        throw new error_middleware_1.AppError('Invalid email or password', 401);
    }
    // Check if user is active
    if (!user.isActive) {
        throw new error_middleware_1.AppError('Account is deactivated', 403);
    }
    // Verify password
    const isPasswordValid = await (0, bcrypt_1.comparePassword)(data.password, user.password);
    if (!isPasswordValid) {
        throw new error_middleware_1.AppError('Invalid email or password', 401);
    }
    // Find employee
    const employee = await Employee_model_1.default.findOne({ userId: user._id }).lean();
    // Generate tokens
    const accessToken = (0, jwt_1.generateAccessToken)({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    const refreshToken = (0, jwt_1.generateRefreshToken)({
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
exports.loginService = loginService;
//# sourceMappingURL=auth.service.js.map