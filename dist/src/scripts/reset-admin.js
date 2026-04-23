"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../config/database"));
const User_model_1 = __importDefault(require("../models/User.model"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
async function resetAdmin() {
    try {
        await (0, database_1.default)();
        const hashedPassword = await bcrypt_1.default.hash('admin123', 10);
        const result = await User_model_1.default.updateOne({ email: 'admin@hrm.com' }, { $set: { password: hashedPassword, isActive: true } });
        if (result.matchedCount === 0) {
            console.log('❌ User admin@hrm.com not found. Please run seed script first.');
        }
        else {
            console.log('✅ Admin password reset successfully to: admin123');
        }
        process.exit(0);
    }
    catch (err) {
        console.error('❌ Reset failed:', err);
        process.exit(1);
    }
}
resetAdmin();
//# sourceMappingURL=reset-admin.js.map