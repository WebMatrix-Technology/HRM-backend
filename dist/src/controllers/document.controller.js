"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = exports.downloadDocument = exports.getDocuments = exports.uploadDocument = void 0;
const Document_model_1 = __importDefault(require("../models/Document.model")); // Renamed to avoid conflict with built-in Document
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
const error_middleware_1 = require("../middlewares/error.middleware");
const types_1 = require("../types");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uploadDocument = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new error_middleware_1.AppError('No file uploaded', 400);
        }
        const { employeeId, title, type } = req.body;
        // Authorization check: User can upload for themselves, or HR/Admin can upload for anyone
        if (req.user?.role !== types_1.Role.HR_MANAGER && req.user?.role !== types_1.Role.ADMIN) {
            // Get current user's employee record
            const employee = await Employee_model_1.default.findOne({ userId: req.user?.userId });
            if (!employee || employee._id.toString() !== employeeId) {
                throw new error_middleware_1.AppError('You can only upload documents for your own profile', 403);
            }
        }
        const newDoc = await Document_model_1.default.create({
            employeeId,
            title,
            type: type || 'OTHER',
            filePath: req.file.path,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            uploadedBy: req.user?.userId,
        });
        res.status(201).json({ success: true, data: newDoc });
    }
    catch (error) {
        // Cleanup file if database save fails
        if (req.file) {
            fs_1.default.unlink(req.file.path, (err) => {
                if (err)
                    console.error('Failed to delete uploaded file after error:', err);
            });
        }
        next(error);
    }
};
exports.uploadDocument = uploadDocument;
const getDocuments = async (req, res, next) => {
    try {
        const { employeeId } = req.params;
        // Auth check: HR/Admin or the employee themselves
        if (req.user?.role !== types_1.Role.HR_MANAGER && req.user?.role !== types_1.Role.ADMIN) {
            const employee = await Employee_model_1.default.findOne({ userId: req.user?.userId });
            if (!employee || employee._id.toString() !== employeeId) {
                throw new error_middleware_1.AppError('Unauthorized access to documents', 403);
            }
        }
        const documents = await Document_model_1.default.find({ employeeId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: documents });
    }
    catch (error) {
        next(error);
    }
};
exports.getDocuments = getDocuments;
const downloadDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        const document = await Document_model_1.default.findById(id);
        if (!document) {
            throw new error_middleware_1.AppError('Document not found', 404);
        }
        // Check permissions...
        const absolutePath = path_1.default.resolve(document.filePath);
        // Check if file exists
        if (!fs_1.default.existsSync(absolutePath)) {
            throw new error_middleware_1.AppError('File not found on server', 404);
        }
        res.download(absolutePath, document.originalName);
    }
    catch (error) {
        next(error);
    }
};
exports.downloadDocument = downloadDocument;
const deleteDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        const document = await Document_model_1.default.findById(id);
        if (!document) {
            throw new error_middleware_1.AppError('Document not found', 404);
        }
        // Auth check: HR/Admin or the document owner/employee it belongs to
        if (req.user?.role !== types_1.Role.HR_MANAGER && req.user?.role !== types_1.Role.ADMIN) {
            const employee = await Employee_model_1.default.findOne({ userId: req.user?.userId });
            if (!employee || employee._id.toString() !== document.employeeId.toString()) {
                throw new error_middleware_1.AppError('You can only delete your own documents', 403);
            }
        }
        // Delete from FS
        // Use fs.unlink, verify path is within uploads dir to prevent traversal?
        // multer stores full path, so it should be safe if we rely on DB.
        fs_1.default.unlink(document.filePath, async (err) => {
            if (err && err.code !== 'ENOENT') {
                console.error('Failed to delete file:', err);
                // We might still want to remove the DB record if file is missing
            }
            await Document_model_1.default.findByIdAndDelete(id);
            res.status(200).json({ success: true, message: 'Document deleted successfully' });
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteDocument = deleteDocument;
//# sourceMappingURL=document.controller.js.map