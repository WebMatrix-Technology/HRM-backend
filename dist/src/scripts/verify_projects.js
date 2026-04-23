"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const Project_model_1 = __importDefault(require("../models/Project.model"));
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
const verifyProjects = async () => {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not defined');
        }
        await mongoose_1.default.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');
        const projects = await Project_model_1.default.find().lean();
        console.log(`Found ${projects.length} projects.`);
        for (const p of projects) {
            console.log(`Cheking Project: ${p.name} (${p._id})`);
            // Check Manager
            const manager = await Employee_model_1.default.findById(p.managerId);
            if (!manager) {
                console.error(`  ❌ CRITICAL: Manager ${p.managerId} NOT FOUND`);
            }
            else {
                console.log(`  ✅ Manager found: ${manager.firstName} ${manager.lastName}`);
            }
            // Check Members
            for (const m of p.members) {
                const emp = await Employee_model_1.default.findById(m.employeeId);
                if (!emp) {
                    console.error(`  ❌ CRITICAL: Member ${m.employeeId} NOT FOUND`);
                }
                else {
                    console.log(`  ✅ Member found: ${emp.firstName} ${emp.lastName}`);
                }
            }
        }
        process.exit(0);
    }
    catch (error) {
        console.error('Error verifying Projects:', error);
        process.exit(1);
    }
};
verifyProjects();
//# sourceMappingURL=verify_projects.js.map