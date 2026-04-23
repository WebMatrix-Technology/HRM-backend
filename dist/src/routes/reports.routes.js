"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reports_controller_1 = require("../controllers/reports.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/attendance', (0, auth_middleware_1.authorize)('ADMIN', 'HR_MANAGER'), reports_controller_1.getAttendanceSummary);
router.get('/payroll', (0, auth_middleware_1.authorize)('ADMIN', 'HR_MANAGER'), reports_controller_1.getPayrollSummary);
router.get('/employees', reports_controller_1.getEmployeeStats);
exports.default = router;
//# sourceMappingURL=reports.routes.js.map