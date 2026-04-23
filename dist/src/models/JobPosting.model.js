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
exports.JobStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Employee_model_1 = require("./Employee.model");
var JobStatus;
(function (JobStatus) {
    JobStatus["OPEN"] = "OPEN";
    JobStatus["CLOSED"] = "CLOSED";
    JobStatus["DRAFT"] = "DRAFT";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
const JobPostingSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    department: { type: String, required: true },
    description: { type: String, required: true },
    requirements: mongoose_1.Schema.Types.Mixed,
    location: String,
    employmentType: { type: String, enum: Object.values(Employee_model_1.EmploymentType), required: true },
    salaryRange: String,
    status: { type: String, enum: Object.values(JobStatus), default: JobStatus.OPEN },
    postedBy: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    postedAt: { type: Date, default: Date.now },
    closedAt: Date,
}, {
    timestamps: true,
    collection: 'job_postings',
});
exports.default = mongoose_1.default.model('JobPosting', JobPostingSchema);
//# sourceMappingURL=JobPosting.model.js.map