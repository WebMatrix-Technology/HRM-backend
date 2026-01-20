"use strict";
// @ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
const API_URL = `http://localhost:${process.env.PORT || 5000}`;
const testBackend = async () => {
    try {
        console.log(`Testing backend at ${API_URL}...`);
        // 1. Health Check
        try {
            const healthRes = await fetch(`${API_URL}/health`);
            if (!healthRes.ok)
                throw new Error(`Health check failed: ${healthRes.statusText}`);
            const health = await healthRes.json();
            console.log('✅ Health check passed:', health);
        }
        catch (error) {
            console.error('❌ Health check failed. Is the server running?');
            process.exit(1);
        }
        // 2. Login
        console.log('Attempting login...');
        const loginRes = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@hrm.com',
                password: 'admin123'
            })
        });
        if (!loginRes.ok) {
            const err = await loginRes.text();
            throw new Error(`Login failed: ${loginRes.status} ${err}`);
        }
        const loginData = await loginRes.json();
        const token = loginData.data?.accessToken;
        if (!token)
            throw new Error('No token received');
        console.log('✅ Login successful. Token received.');
        // 3. Get Users
        console.log('Fetching users...');
        const usersRes = await fetch(`${API_URL}/api/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!usersRes.ok) {
            const err = await usersRes.text();
            throw new Error(`Get users failed: ${usersRes.status} ${err}`);
        }
        const usersData = await usersRes.json();
        const users = usersData.users;
        console.log(`✅ Users fetched successfully. Count: ${users.length}`);
        users.slice(0, 3).forEach((u) => {
            console.log(` - User: ${u.email} (${u.role}) - Employee: ${u.employee ? 'Yes' : 'No'}`);
        });
    }
    catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
};
testBackend();
//# sourceMappingURL=test_backend.js.map