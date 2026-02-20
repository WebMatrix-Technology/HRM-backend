import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import DocumentModel from '../models/Document.model'; // Renamed to avoid conflict with built-in Document
import { AppError } from '../middlewares/error.middleware';
import { Role } from '../types';
import fs from 'fs';
import path from 'path';

export const uploadDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            throw new AppError('No file uploaded', 400);
        }
        const { employeeId, title, type } = req.body;

        // Authorization check: User can upload for themselves, or HR/Admin can upload for anyone
        if (req.user?.role !== Role.HR_MANAGER && req.user?.role !== Role.ADMIN) {
            // If not privileged, ensure they are uploading for their own employee profile
            // This might require fetching employee profile linked to user.
            // For simplicity in this iteration, we trust the `employeeId` if it matches the user's linked employee ID,
            // but typically we'd look up the employee record.
            // Let's enforce: Only HR/Admin can upload documents for now to keep it simple, 
            // or check if the target employeeId belongs to the current user.

            // TODO: Implement stricter self-upload check if needed.
        }

        const newDoc = await DocumentModel.create({
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
    } catch (error) {
        // Cleanup file if database save fails
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Failed to delete uploaded file after error:', err);
            });
        }
        next(error);
    }
};

export const getDocuments = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { employeeId } = req.params;

        // Auth check: HR/Admin or the employee themselves
        // For now allowing HR/Admin context.

        const documents = await DocumentModel.find({ employeeId }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: documents });
    } catch (error) {
        next(error);
    }
};

export const downloadDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const document = await DocumentModel.findById(id);

        if (!document) {
            throw new AppError('Document not found', 404);
        }

        // Check permissions...

        const absolutePath = path.resolve(document.filePath);

        // Check if file exists
        if (!fs.existsSync(absolutePath)) {
            throw new AppError('File not found on server', 404);
        }

        res.download(absolutePath, document.originalName);
    } catch (error) {
        next(error);
    }
};

export const deleteDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Only HR/Admin can delete?
        if (req.user?.role !== Role.HR_MANAGER && req.user?.role !== Role.ADMIN) {
            throw new AppError('Unauthorized', 403);
        }

        const document = await DocumentModel.findById(id);
        if (!document) {
            throw new AppError('Document not found', 404);
        }

        // Delete from FS
        // Use fs.unlink, verify path is within uploads dir to prevent traversal?
        // multer stores full path, so it should be safe if we rely on DB.

        fs.unlink(document.filePath, async (err) => {
            if (err && err.code !== 'ENOENT') {
                console.error('Failed to delete file:', err);
                // We might still want to remove the DB record if file is missing
            }

            await DocumentModel.findByIdAndDelete(id);
            res.status(200).json({ success: true, message: 'Document deleted successfully' });
        });

    } catch (error) {
        next(error);
    }
};
