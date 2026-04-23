"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAvatar = exports.getDepartments = exports.deleteEmployee = exports.updateEmployee = exports.getEmployeeById = exports.getEmployees = exports.createEmployee = void 0;
const employee_service_1 = require("../services/employee.service");
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
const error_middleware_1 = require("../middlewares/error.middleware");
const createEmployee = async (req, res, next) => {
    try {
        // Convert dateOfBirth string to Date object if provided
        const employeeData = { ...req.body };
        if (employeeData.dateOfBirth && typeof employeeData.dateOfBirth === 'string') {
            employeeData.dateOfBirth = new Date(employeeData.dateOfBirth);
        }
        const employee = await employee_service_1.employeeService.createEmployee(employeeData);
        res.status(201).json({
            message: 'Employee created successfully',
            data: employee,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createEmployee = createEmployee;
const getEmployees = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const department = req.query.department;
        const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
        const result = await employee_service_1.employeeService.getEmployees(page, limit, { department, isActive });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getEmployees = getEmployees;
const getEmployeeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await employee_service_1.employeeService.getEmployeeById(id);
        res.status(200).json({ data: employee });
    }
    catch (error) {
        next(error);
    }
};
exports.getEmployeeById = getEmployeeById;
const updateEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Convert dateOfBirth string to Date object if provided
        const updateData = { ...req.body };
        if (updateData.dateOfBirth && typeof updateData.dateOfBirth === 'string') {
            updateData.dateOfBirth = new Date(updateData.dateOfBirth);
        }
        const employee = await employee_service_1.employeeService.updateEmployee(id, updateData);
        res.status(200).json({
            message: 'Employee updated successfully',
            data: employee,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateEmployee = updateEmployee;
const deleteEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        await employee_service_1.employeeService.deleteEmployee(id);
        res.status(200).json({ message: 'Employee deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteEmployee = deleteEmployee;
const getDepartments = async (_req, res, next) => {
    try {
        const departments = await employee_service_1.employeeService.getDepartments();
        res.status(200).json({ data: departments });
    }
    catch (error) {
        next(error);
    }
};
exports.getDepartments = getDepartments;
const uploadAvatar = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!req.file) {
            throw new error_middleware_1.AppError('No image uploaded', 400);
        }
        const avatarUrl = '/uploads/' + req.file.filename;
        const employee = await Employee_model_1.default.findByIdAndUpdate(id, { avatar: avatarUrl }, { new: true });
        if (!employee) {
            throw new error_middleware_1.AppError('Employee not found', 404);
        }
        res.status(200).json({
            success: true,
            data: employee,
            avatar: avatarUrl
        });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadAvatar = uploadAvatar;
//# sourceMappingURL=employee.controller.js.map