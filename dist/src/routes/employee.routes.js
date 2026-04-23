"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employee_controller_1 = require("../controllers/employee.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Multer Storage Configuration
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        const uploadDir = process.env.NODE_ENV === 'production' ? '/tmp/uploads' : 'uploads/';
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.authenticate);
// Get departments (accessible to all authenticated users)
router.get('/departments', employee_controller_1.getDepartments);
// Get all employees (accessible to all authenticated users)
router.get('/', employee_controller_1.getEmployees);
// Get employee by ID (accessible to all authenticated users)
router.get('/:id', employee_controller_1.getEmployeeById);
// Create, update - Admin, HR, Manager, and Employee can do
router.post('/', (0, auth_middleware_1.authorize)('ADMIN', 'HR_MANAGER', 'EMPLOYEE'), employee_controller_1.createEmployee);
router.put('/:id', (0, auth_middleware_1.authorize)('ADMIN', 'HR_MANAGER', 'EMPLOYEE'), employee_controller_1.updateEmployee);
// Delete - only Admin can do, and admin users cannot be deleted
router.delete('/:id', (0, auth_middleware_1.authorize)('ADMIN'), employee_controller_1.deleteEmployee);
// Upload avatar - Admin, HR, Manager, and Employee
router.post('/:id/avatar', (0, auth_middleware_1.authorize)('ADMIN', 'HR_MANAGER', 'EMPLOYEE'), upload.single('avatar'), employee_controller_1.uploadAvatar);
exports.default = router;
//# sourceMappingURL=employee.routes.js.map