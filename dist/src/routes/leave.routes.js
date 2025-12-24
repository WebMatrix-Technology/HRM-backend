"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leave_controller_1 = require("../controllers/leave.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post('/', leave_controller_1.applyLeave);
router.get('/balance', leave_controller_1.getLeaveBalance);
router.get('/', leave_controller_1.getLeaves);
router.post('/:id/approve', (0, auth_middleware_1.authorize)('ADMIN', 'HR', 'MANAGER'), leave_controller_1.approveLeave);
router.post('/:id/reject', (0, auth_middleware_1.authorize)('ADMIN', 'HR', 'MANAGER'), leave_controller_1.rejectLeave);
exports.default = router;
//# sourceMappingURL=leave.routes.js.map