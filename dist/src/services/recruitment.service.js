"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recruitmentService = void 0;
const database_1 = __importDefault(require("../config/database"));
const error_middleware_1 = require("../middlewares/error.middleware");
const models_1 = require("../models");
const JobPosting_model_1 = __importDefault(require("../models/JobPosting.model"));
const JobApplication_model_1 = __importDefault(require("../models/JobApplication.model"));
exports.recruitmentService = {
    createJobPosting: async (data) => {
        await (0, database_1.default)();
        const job = await JobPosting_model_1.default.create({
            ...data,
            status: models_1.JobStatus.OPEN,
            requirements: data.requirements || undefined,
        });
        return job.toObject();
    },
    getJobPostings: async (status) => {
        await (0, database_1.default)();
        const query = {};
        if (status)
            query.status = status;
        const jobs = await JobPosting_model_1.default.find(query)
            .sort({ postedAt: -1 })
            .lean();
        return jobs;
    },
    getJobPostingById: async (id) => {
        await (0, database_1.default)();
        const job = await JobPosting_model_1.default.findById(id).lean();
        if (!job) {
            throw new error_middleware_1.AppError('Job posting not found', 404);
        }
        // Get applications for this job posting
        const applications = await JobApplication_model_1.default.find({ jobPostingId: id })
            .populate('jobPostingId', 'id title')
            .lean();
        return {
            ...job,
            applications,
        };
    },
    updateJobStatus: async (id, status) => {
        await (0, database_1.default)();
        const updateData = { status };
        if (status === models_1.JobStatus.CLOSED) {
            updateData.closedAt = new Date();
        }
        const job = await JobPosting_model_1.default.findByIdAndUpdate(id, updateData, {
            new: true,
        }).lean();
        if (!job) {
            throw new error_middleware_1.AppError('Job posting not found', 404);
        }
        return job;
    },
    createApplication: async (data) => {
        await (0, database_1.default)();
        const application = await JobApplication_model_1.default.create({
            ...data,
            status: models_1.ApplicationStatus.PENDING,
        });
        const populatedApplication = await JobApplication_model_1.default.findById(application._id)
            .populate('jobPostingId', 'id title')
            .lean();
        return populatedApplication;
    },
    getApplications: async (jobPostingId, status) => {
        await (0, database_1.default)();
        const query = {};
        if (jobPostingId)
            query.jobPostingId = jobPostingId;
        if (status)
            query.status = status;
        const applications = await JobApplication_model_1.default.find(query)
            .populate('jobPostingId', 'id title')
            .sort({ createdAt: -1 })
            .lean();
        return applications;
    },
    updateApplicationStatus: async (id, status, interviewDate, notes) => {
        await (0, database_1.default)();
        const updateData = { status };
        if (interviewDate)
            updateData.interviewDate = interviewDate;
        if (notes)
            updateData.notes = notes;
        const application = await JobApplication_model_1.default.findByIdAndUpdate(id, updateData, {
            new: true,
        }).lean();
        if (!application) {
            throw new error_middleware_1.AppError('Application not found', 404);
        }
        return application;
    },
};
//# sourceMappingURL=recruitment.service.js.map