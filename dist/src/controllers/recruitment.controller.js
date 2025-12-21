"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatus = exports.getApplications = exports.createApplication = exports.updateJobStatus = exports.getJobPostingById = exports.getJobPostings = exports.createJobPosting = void 0;
const recruitment_service_1 = require("../services/recruitment.service");
const database_1 = __importDefault(require("../config/database"));
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
const createJobPosting = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        await (0, database_1.default)();
        const employee = await Employee_model_1.default.findOne({ userId: req.user.userId }).lean();
        if (!employee) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }
        const job = await recruitment_service_1.recruitmentService.createJobPosting({
            ...req.body,
            postedBy: employee._id.toString(),
        });
        res.status(201).json({ message: 'Job posting created successfully', data: job });
    }
    catch (error) {
        next(error);
    }
};
exports.createJobPosting = createJobPosting;
const getJobPostings = async (req, res, next) => {
    try {
        const status = req.query.status;
        const jobs = await recruitment_service_1.recruitmentService.getJobPostings(status);
        res.status(200).json({ data: jobs });
    }
    catch (error) {
        next(error);
    }
};
exports.getJobPostings = getJobPostings;
const getJobPostingById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const job = await recruitment_service_1.recruitmentService.getJobPostingById(id);
        res.status(200).json({ data: job });
    }
    catch (error) {
        next(error);
    }
};
exports.getJobPostingById = getJobPostingById;
const updateJobStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const job = await recruitment_service_1.recruitmentService.updateJobStatus(id, status);
        res.status(200).json({ message: 'Job status updated successfully', data: job });
    }
    catch (error) {
        next(error);
    }
};
exports.updateJobStatus = updateJobStatus;
const createApplication = async (req, res, next) => {
    try {
        const application = await recruitment_service_1.recruitmentService.createApplication(req.body);
        res.status(201).json({ message: 'Application submitted successfully', data: application });
    }
    catch (error) {
        next(error);
    }
};
exports.createApplication = createApplication;
const getApplications = async (req, res, next) => {
    try {
        const jobPostingId = req.query.jobPostingId;
        const status = req.query.status;
        const applications = await recruitment_service_1.recruitmentService.getApplications(jobPostingId, status);
        res.status(200).json({ data: applications });
    }
    catch (error) {
        next(error);
    }
};
exports.getApplications = getApplications;
const updateApplicationStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, interviewDate, notes } = req.body;
        const application = await recruitment_service_1.recruitmentService.updateApplicationStatus(id, status, interviewDate ? new Date(interviewDate) : undefined, notes);
        res.status(200).json({ message: 'Application status updated successfully', data: application });
    }
    catch (error) {
        next(error);
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
//# sourceMappingURL=recruitment.controller.js.map