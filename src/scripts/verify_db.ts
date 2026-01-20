// @ts-nocheck
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User.model';
import Employee from '../models/Employee.model';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const verifyDB = async () => {
    try {
        console.log('Checking environment variables...');
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not defined in environment variables');
        }
        console.log('DATABASE_URL found (length: ' + process.env.DATABASE_URL.length + ')');

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');

        const userCount = await User.countDocuments();
        console.log(`Total Users: ${userCount}`);

        const users = await User.find().lean();
        users.forEach(u => {
            console.log(`User: ${u.email}, ID: ${u._id}, Role: ${u.role}`);
        });

        const employeeCount = await Employee.countDocuments();
        console.log(`Total Employees: ${employeeCount}`);

        const employees = await Employee.find().lean();
        employees.forEach(e => {
            console.log(`Employee: ${e.firstName} ${e.lastName}, UserID: ${e.userId}`);
        });

        // Check for mismatches
        for (const u of users) {
            const emp = employees.find(e => e.userId.toString() === u._id.toString());
            if (!emp) {
                console.log(`WARNING: User ${u.email} has no associated Employee record.`);
            } else {
                console.log(`User ${u.email} is linked to Employee ${emp.firstName} ${emp.lastName}`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error verifying DB:', error);
        process.exit(1);
    }
};

verifyDB();
