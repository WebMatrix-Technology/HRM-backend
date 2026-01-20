"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
const API_URL = `http://localhost:${process.env.PORT || 5000}`;
const testProjects = async () => {
    try {
        console.log(`Testing projects at ${API_URL}...`);
        // Login first
        console.log('Logging in...');
        const loginRes = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@hrm.com', password: 'admin123' })
        });
        if (!loginRes.ok)
            throw new Error(`Login failed: ${loginRes.status}`);
        const { data: { accessToken: token } } = await loginRes.json();
        console.log('Login successful.');
        // Fetch Projects
        console.log('Fetching projects...');
        const projectsRes = await fetch(`${API_URL}/api/projects?page=1&limit=100`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!projectsRes.ok) {
            const text = await projectsRes.text();
            throw new Error(`Fetch projects failed: ${projectsRes.status} ${text}`);
        }
        const data = await projectsRes.json();
        console.log('✅ Projects fetched successfully:', data);
    }
    catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
};
testProjects();
//# sourceMappingURL=test_projects.js.map