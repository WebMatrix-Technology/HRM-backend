"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recruitment_controller_1 = require("../controllers/recruitment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/applications', recruitment_controller_1.createApplication);
router.get('/jobs', recruitment_controller_1.getJobPostings);
router.get('/jobs/:id', recruitment_controller_1.getJobPostingById);
// Protected routes
router.use(auth_middleware_1.authenticate);
router.post('/jobs', (0, auth_middleware_1.authorize)('ADMIN', 'HR'), recruitment_controller_1.createJobPosting);
router.put('/jobs/:id/status', (0, auth_middleware_1.authorize)('ADMIN', 'HR'), recruitment_controller_1.updateJobStatus);
router.get('/applications', (0, auth_middleware_1.authorize)('ADMIN', 'HR'), recruitment_controller_1.getApplications);
router.put('/applications/:id/status', (0, auth_middleware_1.authorize)('ADMIN', 'HR'), recruitment_controller_1.updateApplicationStatus);
exports.default = router;
//# sourceMappingURL=recruitment.routes.js.map