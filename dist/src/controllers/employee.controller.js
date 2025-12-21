"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepartments = exports.deleteEmployee = exports.updateEmployee = exports.getEmployeeById = exports.getEmployees = exports.createEmployee = void 0;
const employee_service_1 = require("../services/employee.service");
const createEmployee = async (req, res, next) => {
    try {
        const employee = await employee_service_1.employeeService.createEmployee(req.body);
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
        const employee = await employee_service_1.employeeService.updateEmployee(id, req.body);
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
//# sourceMappingURL=employee.controller.js.map