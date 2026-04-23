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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCandidateStatus = exports.getCandidates = exports.applyForJob = exports.updateJob = exports.getJobById = exports.getJobs = exports.createJob = void 0;
const Job_model_1 = __importStar(require("../models/Job.model"));
const Candidate_model_1 = __importStar(require("../models/Candidate.model"));
const error_middleware_1 = require("../middlewares/error.middleware");
const types_1 = require("../types");
const mail_service_1 = require("../services/mail.service");
const notification_service_1 = require("../services/notification.service");
const calendar_service_1 = require("../services/calendar.service");
const createJob = async (req, res, next) => {
    try {
        if (!req.user || (req.user.role !== types_1.Role.HR_MANAGER && req.user.role !== types_1.Role.ADMIN)) {
            throw new error_middleware_1.AppError('Unauthorized', 403);
        }
        const job = await Job_model_1.default.create({
            ...req.body,
            postedBy: req.user.userId,
        });
        res.status(201).json({ success: true, data: job });
    }
    catch (error) {
        next(error);
    }
};
exports.createJob = createJob;
const getJobs = async (req, res, next) => {
    try {
        // If we're filtering, apply filters
        const filter = {};
        const { status, department, type } = req.query;
        if (status)
            filter.status = status;
        if (department)
            filter.department = department;
        if (type)
            filter.type = type;
        const jobs = await Job_model_1.default.find(filter).sort({ createdAt: -1 }).populate('postedBy', 'firstName lastName');
        res.status(200).json({ success: true, data: jobs });
    }
    catch (error) {
        next(error);
    }
};
exports.getJobs = getJobs;
const getJobById = async (req, res, next) => {
    try {
        const job = await Job_model_1.default.findById(req.params.id).populate('postedBy', 'firstName lastName');
        if (!job) {
            throw new error_middleware_1.AppError('Job not found', 404);
        }
        res.status(200).json({ success: true, data: job });
    }
    catch (error) {
        next(error);
    }
};
exports.getJobById = getJobById;
const updateJob = async (req, res, next) => {
    try {
        if (!req.user || (req.user.role !== types_1.Role.HR_MANAGER && req.user.role !== types_1.Role.ADMIN)) {
            throw new error_middleware_1.AppError('Unauthorized', 403);
        }
        const job = await Job_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!job) {
            throw new error_middleware_1.AppError('Job not found', 404);
        }
        res.status(200).json({ success: true, data: job });
    }
    catch (error) {
        next(error);
    }
};
exports.updateJob = updateJob;
const applyForJob = async (req, res, next) => {
    try {
        const { id: jobId } = req.params;
        const { firstName, lastName, email, phone, coverLetter } = req.body;
        let resumeUrl = req.body.resumeUrl;
        if (req.file) {
            resumeUrl = req.file.path.replace(/\\/g, '/'); // Normalize windows paths
        }
        // Check if job exists and is open
        const job = await Job_model_1.default.findById(jobId);
        if (!job || job.status !== Job_model_1.JobStatus.OPEN) {
            throw new error_middleware_1.AppError('Job not found or closed', 404);
        }
        // Check for duplicate application
        const existingCandidate = await Candidate_model_1.default.findOne({ jobId, email });
        if (existingCandidate) {
            throw new error_middleware_1.AppError('You have already applied for this position', 400);
        }
        const candidate = await Candidate_model_1.default.create({
            jobId,
            firstName,
            lastName,
            email,
            phone,
            resumeUrl,
            coverLetter,
            status: Candidate_model_1.CandidateStatus.APPLIED,
        });
        res.status(201).json({ success: true, message: 'Application submitted successfully', data: candidate });
    }
    catch (error) {
        next(error);
    }
};
exports.applyForJob = applyForJob;
const getCandidates = async (req, res, next) => {
    try {
        if (!req.user || (req.user.role !== types_1.Role.HR_MANAGER && req.user.role !== types_1.Role.ADMIN && req.user.role !== types_1.Role.CLERK)) {
            throw new error_middleware_1.AppError('Unauthorized', 403);
        }
        const { jobId, status } = req.query;
        const filter = {};
        if (jobId)
            filter.jobId = jobId;
        if (status)
            filter.status = status;
        const candidates = await Candidate_model_1.default.find(filter)
            .sort({ createdAt: -1 })
            .populate('jobId', 'title department');
        res.status(200).json({ success: true, data: candidates });
    }
    catch (error) {
        next(error);
    }
};
exports.getCandidates = getCandidates;
const updateCandidateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!req.user || (req.user.role !== types_1.Role.HR_MANAGER && req.user.role !== types_1.Role.ADMIN && req.user.role !== types_1.Role.CLERK)) {
            throw new error_middleware_1.AppError('Unauthorized', 403);
        }
        const { status, note, interviewDate, interviewLocation } = req.body;
        // Base update
        let update = { status };
        // If scheduling an interview, save interview details
        if (status === 'INTERVIEW') {
            if (interviewDate)
                update.interviewDate = new Date(interviewDate);
            if (interviewLocation)
                update.interviewLocation = interviewLocation;
        }
        // If note is provided, push to notes array
        if (note) {
            update.$push = {
                notes: {
                    text: note,
                    author: req.user.userId,
                    date: new Date(),
                }
            };
        }
        const candidate = await Candidate_model_1.default.findByIdAndUpdate(id, update, { new: true }).populate('jobId', 'title');
        if (!candidate) {
            throw new error_middleware_1.AppError('Candidate not found', 404);
        }
        // Trigger email if status changed to INTERVIEW
        if (status === 'INTERVIEW' && candidate.email) {
            console.log('🎯 Interview status detected, triggering email for:', candidate.email);
            const jobTitle = candidate.jobId?.title || 'Position';
            mail_service_1.mailService.sendInterviewInvitation(candidate.email, `${candidate.firstName} ${candidate.lastName} `, jobTitle, new Date(interviewDate), interviewLocation || 'Online').then(result => {
                if (result)
                    console.log('✅ Email service finished successfully');
                else
                    console.log('⚠️ Email service returned null (failed)');
            }).catch(err => console.error('Background email sending failed:', err));
            // Trigger In-app Notifications for HR and Admins
            notification_service_1.notificationService.notifyRoles([types_1.Role.ADMIN, types_1.Role.HR_MANAGER], {
                title: 'New Interview Scheduled',
                message: `An interview for ${candidate.firstName} ${candidate.lastName} has been scheduled for the ${jobTitle} position.`,
                type: 'info',
                link: `/recruitment/candidates?id=${candidate._id}`
            }).catch(err => console.error('Background notification failed:', err));
            // Sync to Calendar
            calendar_service_1.calendarService.addEvent({
                title: `Interview: ${candidate.firstName} ${candidate.lastName} (${jobTitle})`,
                date: new Date(interviewDate),
                description: `Interview for ${jobTitle} position. Location: ${interviewLocation || 'Online'}`,
                createdBy: req.user.userId,
            }).catch(err => console.error('Background calendar sync failed:', err));
        }
        res.status(200).json({ success: true, data: candidate });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCandidateStatus = updateCandidateStatus;
//# sourceMappingURL=recruitment.controller.js.map