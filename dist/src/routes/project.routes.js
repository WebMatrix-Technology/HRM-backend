"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("../controllers/project.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const User_model_1 = require("../models/User.model");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.authenticate);
// GET routes
router.get('/', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.HR, User_model_1.Role.MANAGER), project_controller_1.getProjects);
router.get('/stats', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.HR, User_model_1.Role.MANAGER), project_controller_1.getProjectStats);
router.get('/managers', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.HR, User_model_1.Role.MANAGER), project_controller_1.getAvailableManagers);
router.get('/templates', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.HR, User_model_1.Role.MANAGER), project_controller_1.getProjectTemplates);
router.get('/export', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.HR, User_model_1.Role.MANAGER), project_controller_1.exportProjects);
router.get('/:id', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.HR, User_model_1.Role.MANAGER), project_controller_1.getProject);
// POST routes
router.post('/', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.HR, User_model_1.Role.MANAGER), project_controller_1.createProject);
router.post('/:id/members', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.HR, User_model_1.Role.MANAGER), project_controller_1.addProjectMembers);
// PUT routes
router.put('/:id', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.HR, User_model_1.Role.MANAGER), project_controller_1.updateProject);
// PATCH routes
router.patch('/:id/progress', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.HR, User_model_1.Role.MANAGER), project_controller_1.updateProjectProgress);
// DELETE routes
router.delete('/:id', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN), project_controller_1.deleteProject);
router.delete('/:id/members/:memberId', (0, auth_middleware_1.authorize)(User_model_1.Role.ADMIN, User_model_1.Role.HR, User_model_1.Role.MANAGER), project_controller_1.removeProjectMember);
exports.default = router;
//# sourceMappingURL=project.routes.js.map