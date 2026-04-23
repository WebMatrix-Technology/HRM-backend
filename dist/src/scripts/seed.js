"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const database_1 = __importDefault(require("../config/database"));
const User_model_1 = __importStar(require("../models/User.model"));
const Employee_model_1 = __importStar(require("../models/Employee.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
async function main() {
    console.log('🌱 Seeding database...');
    await (0, database_1.default)();
    // Hash password for default admin
    const hashedPassword = await bcrypt_1.default.hash('admin123', 10);
    // Create Admin User
    let adminUser = await User_model_1.default.findOne({ email: 'admin@hrm.com' });
    if (!adminUser) {
        adminUser = await User_model_1.default.create({
            email: 'admin@hrm.com',
            password: hashedPassword,
            role: User_model_1.Role.ADMIN,
        });
        await Employee_model_1.default.create({
            userId: adminUser._id,
            employeeId: 'EMP001',
            firstName: 'Admin',
            lastName: 'User',
            phone: '+1234567890',
            department: 'Administration',
            position: 'System Administrator',
            employmentType: Employee_model_1.EmploymentType.FULL_TIME,
            salary: 100000,
        });
        console.log('✅ Admin user created:', adminUser.email);
    }
    else {
        console.log('⚠️ Admin user already exists');
    }
    // Create Employee User
    const employeePassword = await bcrypt_1.default.hash('employee123', 10);
    let employeeUser = await User_model_1.default.findOne({ email: 'employee@hrm.com' });
    if (!employeeUser) {
        employeeUser = await User_model_1.default.create({
            email: 'employee@hrm.com',
            password: employeePassword,
            role: User_model_1.Role.EMPLOYEE,
        });
        await Employee_model_1.default.create({
            userId: employeeUser._id,
            employeeId: 'EMP004',
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1234567893',
            department: 'Development',
            position: 'Software Developer',
            employmentType: Employee_model_1.EmploymentType.FULL_TIME,
            salary: 60000,
        });
        console.log('✅ Employee user created:', employeeUser.email);
    }
    else {
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
//# sourceMappingURL=seed.js.map