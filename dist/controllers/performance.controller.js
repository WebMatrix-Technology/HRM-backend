"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPerformanceById = exports.getPerformances = exports.updatePerformance = exports.createPerformance = void 0;
const performance_service_1 = require("../services/performance.service");
const database_1 = __importDefault(require("../config/database"));
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
const createPerformance = async (req, res, next) => {
    try {
        const performance = await performance_service_1.performanceService.createPerformance(req.body);
        res.status(201).json({ message: 'Performance review created successfully', data: performance });
    }
    catch (error) {
        next(error);
    }
};
exports.createPerformance = createPerformance;
const updatePerformance = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { id } = req.params;
        await (0, database_1.default)();
        const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
        if (!employee) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }
        const performance = await performance_service_1.performanceService.updatePerformance(id, req.body, employee._id.toString());
        res.status(200).json({ message: 'Performance review updated successfully', data: performance });
    }
    catch (error) {
        next(error);
    }
};
exports.updatePerformance = updatePerformance;
const getPerformances = async (req, res, next) => {
    try {
        const employeeId = req.query.employeeId;
        const performances = await performance_service_1.performanceService.getPerformances(employeeId);
        res.status(200).json({ data: performances });
    }
    catch (error) {
        next(error);
    }
};
exports.getPerformances = getPerformances;
const getPerformanceById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const performance = await performance_service_1.performanceService.getPerformanceById(id);
        res.status(200).json({ data: performance });
    }
    catch (error) {
        next(error);
    }
};
exports.getPerformanceById = getPerformanceById;
//# sourceMappingURL=performance.controller.js.map