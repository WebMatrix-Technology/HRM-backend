import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import connectDB from '../config/database';
import User, { Role } from '../models/User.model';
import Employee, { EmploymentType } from '../models/Employee.model';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Seeding database...');

  await connectDB();

  // Hash password for default admin
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create Admin User
  let adminUser = await User.findOne({ email: 'admin@hrm.com' });
  if (!adminUser) {
    adminUser = await User.create({
      email: 'admin@hrm.com',
      password: hashedPassword,
      role: Role.ADMIN,
    });

    await Employee.create({
      userId: adminUser._id,
      employeeId: 'EMP001',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      department: 'Administration',
      position: 'System Administrator',
      employmentType: EmploymentType.FULL_TIME,
      salary: 100000,
    });

    console.log('✅ Admin user created:', adminUser.email);
  } else {
    console.log('⚠️ Admin user already exists');
  }



  // Create Employee User
  const employeePassword = await bcrypt.hash('employee123', 10);
  let employeeUser = await User.findOne({ email: 'employee@hrm.com' });
  if (!employeeUser) {
    employeeUser = await User.create({
      email: 'employee@hrm.com',
      password: employeePassword,
      role: Role.EMPLOYEE,
    });

    await Employee.create({
      userId: employeeUser._id,
      employeeId: 'EMP004',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567893',
      department: 'Development',
      position: 'Software Developer',
      employmentType: EmploymentType.FULL_TIME,
      salary: 60000,
    });

    console.log('✅ Employee user created:', employeeUser.email);
  } else {
    console.log('⚠️ Employee user already exists');
  }

  console.log('🎉 Seeding completed!');
  process.exit(0);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  });


