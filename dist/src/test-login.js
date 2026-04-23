"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const auth_service_1 = require("./services/auth.service");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
async function testLogin() {
    try {
        console.log('🧪 Testing login with admin@hrm.com / admin123...');
        const result = await (0, auth_service_1.loginService)({
            email: 'admin@hrm.com',
            password: 'admin123'
        });
        console.log('✅ Login successful!');
        console.log('User Role:', result.user.role);
        process.exit(0);
    }
    catch (err) {
        console.error('❌ Login failed:', err.message, err.statusCode);
        process.exit(1);
    }
}
testLogin();
//# sourceMappingURL=test-login.js.map