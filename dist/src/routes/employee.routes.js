"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employee_controller_1 = require("../controllers/employee.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
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
router.post('/', (0, auth_middleware_1.authorize)('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'), employee_controller_1.createEmployee);
router.put('/:id', (0, auth_middleware_1.authorize)('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'), employee_controller_1.updateEmployee);
// Delete - only Admin can do, and admin users cannot be deleted
router.delete('/:id', (0, auth_middleware_1.authorize)('ADMIN'), employee_controller_1.deleteEmployee);
exports.default = router;
//# sourceMappingURL=employee.routes.js.map