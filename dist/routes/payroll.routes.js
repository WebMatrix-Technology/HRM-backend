"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payroll_controller_1 = require("../controllers/payroll.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/', payroll_controller_1.getPayrolls);
router.get('/:id', payroll_controller_1.getPayrollById);
router.post('/', (0, auth_middleware_1.authorize)('ADMIN', 'HR'), payroll_controller_1.processPayroll);
router.post('/:id/paid', (0, auth_middleware_1.authorize)('ADMIN', 'HR'), payroll_controller_1.markAsPaid);
exports.default = router;
//# sourceMappingURL=payroll.routes.js.map