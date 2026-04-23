"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("../controllers/project.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const User_model_1 = require("../models/User.model");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
// Multer Storage Configuration
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        const uploadDir = process.env.NODE_ENV === 'production' ? '/tmp/uploads' : 'uploads/';
        // Ensure directory exists
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        // Unique filename: timestamp-originalName
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for reports
});
// All routes require authentication
router.use(auth_middleware_1.authenticate);
// GET routes
router.get('/', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.MANAGER, User_model_1.Role.CLERK, User_model_1.Role.EMPLOYEE), project_controller_1.getProjects);
router.get('/stats', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.MANAGER), project_controller_1.getProjectStats);
router.get('/managers', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.MANAGER), project_controller_1.getAvailableManagers);
router.get('/templates', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.MANAGER), project_controller_1.getProjectTemplates);
router.get('/export', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.MANAGER), project_controller_1.exportProjects);
router.get('/:id', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.MANAGER, User_model_1.Role.CLERK, User_model_1.Role.EMPLOYEE), project_controller_1.getProject);
// POST routes
router.post('/', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.MANAGER), project_controller_1.createProject);
router.post('/:id/report', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.MANAGER), upload.single('reportFile'), project_controller_1.uploadProjectReport);
router.post('/:id/members', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.MANAGER), project_controller_1.addProjectMembers);
// PUT routes
router.put('/:id', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.MANAGER), project_controller_1.updateProject);
// PATCH routes
router.patch('/:id/progress', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.MANAGER), project_controller_1.updateProjectProgress);
// DELETE routes
router.delete('/:id', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN), project_controller_1.deleteProject);
router.delete('/:id/members/:memberId', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.MANAGER), project_controller_1.removeProjectMember);
exports.default = router;
//# sourceMappingURL=project.routes.js.map