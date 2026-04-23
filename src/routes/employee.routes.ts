import { Router } from 'express';
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getDepartments,
  uploadAvatar,
} from '../controllers/employee.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const uploadDir = process.env.NODE_ENV === 'production' ? '/tmp/uploads' : 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get departments (accessible to all authenticated users)
router.get('/departments', getDepartments);

// Get all employees (accessible to all authenticated users)
router.get('/', getEmployees);

// Get employee by ID (accessible to all authenticated users)
router.get('/:id', getEmployeeById);

// Create, update - Admin, HR, Manager, and Employee can do
router.post('/', authorize('ADMIN', 'HR_MANAGER', 'EMPLOYEE'), createEmployee);
router.put('/:id', authorize('ADMIN', 'HR_MANAGER', 'EMPLOYEE'), updateEmployee);
// Delete - only Admin can do, and admin users cannot be deleted
router.delete('/:id', authorize('ADMIN'), deleteEmployee);

// Upload avatar - Admin, HR, Manager, and Employee
router.post('/:id/avatar', authorize('ADMIN', 'HR_MANAGER', 'EMPLOYEE'), upload.single('avatar'), uploadAvatar);

export default router;
