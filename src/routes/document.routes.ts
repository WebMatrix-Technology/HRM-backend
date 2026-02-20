import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middlewares/auth.middleware';
import {
    uploadDocument,
    getDocuments,
    downloadDocument,
    deleteDocument,
} from '../controllers/document.controller';

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const uploadDir = 'uploads/';
        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        // Unique filename: timestamp-originalName
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Routes
router.use(authenticate); // ALl routes require login

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/employee/:employeeId', getDocuments); // List docs for an employee
router.get('/download/:id', downloadDocument);
router.delete('/:id', deleteDocument);

export default router;
