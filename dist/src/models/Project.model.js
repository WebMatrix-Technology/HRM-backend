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
exports.ProjectPriority = exports.ProjectStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["PLANNING"] = "PLANNING";
    ProjectStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ProjectStatus["ON_HOLD"] = "ON_HOLD";
    ProjectStatus["COMPLETED"] = "COMPLETED";
    ProjectStatus["CANCELLED"] = "CANCELLED";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var ProjectPriority;
(function (ProjectPriority) {
    ProjectPriority["LOW"] = "LOW";
    ProjectPriority["MEDIUM"] = "MEDIUM";
    ProjectPriority["HIGH"] = "HIGH";
    ProjectPriority["CRITICAL"] = "CRITICAL";
})(ProjectPriority || (exports.ProjectPriority = ProjectPriority = {}));
const ProjectMemberSchema = new mongoose_1.Schema({
    employeeId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Employee', required: true },
    role: { type: String, default: 'MEMBER' },
    joinedAt: { type: Date, default: Date.now },
});
const ProjectSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
        type: String,
        enum: Object.values(ProjectStatus),
        default: ProjectStatus.PLANNING
    },
    priority: {
        type: String,
        enum: Object.values(ProjectPriority),
        default: ProjectPriority.MEDIUM
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    deadline: { type: Date },
    budget: { type: Number, min: 0 },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    managerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Employee', required: true },
    members: [ProjectMemberSchema],
    tags: [{ type: String, trim: true }],
}, {
    timestamps: true,
    collection: 'projects',
});
// Indexes for better query performance
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ priority: 1 });
ProjectSchema.index({ managerId: 1 });
ProjectSchema.index({ startDate: 1 });
ProjectSchema.index({ deadline: 1 });
ProjectSchema.index({ tags: 1 });
ProjectSchema.index({ name: 'text', description: 'text' });
// Virtual for checking if project is overdue
ProjectSchema.virtual('isOverdue').get(function () {
    if (!this.deadline)
        return false;
    return this.deadline < new Date() && this.status !== ProjectStatus.COMPLETED;
});
// Ensure virtuals are included when converting to JSON
ProjectSchema.set('toJSON', { virtuals: true });
exports.default = mongoose_1.default.model('Project', ProjectSchema);
//# sourceMappingURL=Project.model.js.map