import { Response, NextFunction } from 'express';
import { employeeService } from '../services/employee.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const createEmployee = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Convert dateOfBirth string to Date object if provided
    const employeeData = { ...req.body };
    if (employeeData.dateOfBirth && typeof employeeData.dateOfBirth === 'string') {
      employeeData.dateOfBirth = new Date(employeeData.dateOfBirth);
    }
    
    const employee = await employeeService.createEmployee(employeeData);
    res.status(201).json({
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployees = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const department = req.query.department as string | undefined;
    const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;

    const result = await employeeService.getEmployees(page, limit, { department, isActive });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getEmployeeById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const employee = await employeeService.getEmployeeById(id);
    res.status(200).json({ data: employee });
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    // Convert dateOfBirth string to Date object if provided
    const updateData = { ...req.body };
    if (updateData.dateOfBirth && typeof updateData.dateOfBirth === 'string') {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }
    
    const employee = await employeeService.updateEmployee(id, updateData);
    res.status(200).json({
      message: 'Employee updated successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await employeeService.deleteEmployee(id);
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getDepartments = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const departments = await employeeService.getDepartments();
    res.status(200).json({ data: departments });
  } catch (error) {
    next(error);
  }
};

