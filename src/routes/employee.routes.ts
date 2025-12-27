import { Router } from 'express';
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getDepartments,
} from '../controllers/employee.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

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
router.post('/', authorize('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'), createEmployee);
router.put('/:id', authorize('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'), updateEmployee);
// Delete - only Admin can do, and admin users cannot be deleted
router.delete('/:id', authorize('ADMIN'), deleteEmployee);

export default router;
