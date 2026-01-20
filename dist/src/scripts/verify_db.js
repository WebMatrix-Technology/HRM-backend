"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const User_model_1 = __importDefault(require("../models/User.model"));
const Employee_model_1 = __importDefault(require("../models/Employee.model"));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
const verifyDB = async () => {
    try {
        console.log('Checking environment variables...');
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not defined in environment variables');
        }
        console.log('DATABASE_URL found (length: ' + process.env.DATABASE_URL.length + ')');
        console.log('Connecting to MongoDB...');
        await mongoose_1.default.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');
        const userCount = await User_model_1.default.countDocuments();
        console.log(`Total Users: ${userCount}`);
        const users = await User_model_1.default.find().lean();
        users.forEach(u => {
            console.log(`User: ${u.email}, ID: ${u._id}, Role: ${u.role}`);
        });
        const employeeCount = await Employee_model_1.default.countDocuments();
        console.log(`Total Employees: ${employeeCount}`);
        const employees = await Employee_model_1.default.find().lean();
        employees.forEach(e => {
            console.log(`Employee: ${e.firstName} ${e.lastName}, UserID: ${e.userId}`);
        });
        // Check for mismatches
        for (const u of users) {
            const emp = employees.find(e => e.userId.toString() === u._id.toString());
            if (!emp) {
                console.log(`WARNING: User ${u.email} has no associated Employee record.`);
            }
            else {
                console.log(`User ${u.email} is linked to Employee ${emp.firstName} ${emp.lastName}`);
            }
        }
        process.exit(0);
    }
    catch (error) {
        console.error('Error verifying DB:', error);
        process.exit(1);
    }
};
verifyDB();
//# sourceMappingURL=verify_db.js.map