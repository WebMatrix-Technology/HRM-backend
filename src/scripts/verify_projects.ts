
// @ts-nocheck
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Project from '../models/Project.model';
import Employee from '../models/Employee.model';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const verifyProjects = async () => {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not defined');
        }

        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');

        const projects = await Project.find().lean();
        console.log(`Found ${projects.length} projects.`);

        for (const p of projects) {
            console.log(`Cheking Project: ${p.name} (${p._id})`);

            // Check Manager
            const manager = await Employee.findById(p.managerId);
            if (!manager) {
                console.error(`  ❌ CRITICAL: Manager ${p.managerId} NOT FOUND`);
            } else {
                console.log(`  ✅ Manager found: ${manager.firstName} ${manager.lastName}`);
            }

            // Check Members
            for (const m of p.members) {
                const emp = await Employee.findById(m.employeeId);
                if (!emp) {
                    console.error(`  ❌ CRITICAL: Member ${m.employeeId} NOT FOUND`);
                } else {
                    console.log(`  ✅ Member found: ${emp.firstName} ${emp.lastName}`);
                }
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error verifying Projects:', error);
        process.exit(1);
    }
};

verifyProjects();
