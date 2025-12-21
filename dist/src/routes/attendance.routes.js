"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attendance_controller_1 = require("../controllers/attendance.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post('/punch-in', attendance_controller_1.punchIn);
router.post('/punch-out', attendance_controller_1.punchOut);
router.get('/:employeeId?', attendance_controller_1.getAttendance);
router.get('/:employeeId?/monthly', attendance_controller_1.getMonthlyReport);
exports.default = router;
//# sourceMappingURL=attendance.routes.js.map