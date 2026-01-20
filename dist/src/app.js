"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// Parse allowed origins from env (comma-separated) or use defaults
const parseOrigins = (env) => env ? env.split(',').map((s) => s.trim()) : [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://hrm-frontend-ten.vercel.app',
];
const allowedOrigins = parseOrigins(process.env.CORS_ORIGIN);
const isOriginAllowed = (origin) => {
    if (!origin)
        return true; // Same-origin or non-browser requests
    if (allowedOrigins.includes(origin))
        return true;
    if (/^http:\/\/localhost:\d+$/i.test(origin))
        return true;
    if (/^http:\/\/127\.0\.0\.1:\d+$/i.test(origin))
        return true;
    return false;
};
// CORS middleware
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (isOriginAllowed(origin || undefined)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Root path
app.get('/', (_req, res) => {
    res.send('HRM Backend is running ✔');
});
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const employee_routes_1 = __importDefault(require("./routes/employee.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const attendance_routes_1 = __importDefault(require("./routes/attendance.routes"));
const leave_routes_1 = __importDefault(require("./routes/leave.routes"));
const payroll_routes_1 = __importDefault(require("./routes/payroll.routes"));
const performance_routes_1 = __importDefault(require("./routes/performance.routes"));
const recruitment_routes_1 = __importDefault(require("./routes/recruitment.routes"));
const reports_routes_1 = __importDefault(require("./routes/reports.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/chat', chat_routes_1.default);
app.use('/api/employees', employee_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/projects', project_routes_1.default);
app.use('/api/tasks', task_routes_1.default);
app.use('/api/attendance', attendance_routes_1.default);
app.use('/api/leave', leave_routes_1.default);
app.use('/api/payroll', payroll_routes_1.default);
app.use('/api/performance', performance_routes_1.default);
app.use('/api/recruitment', recruitment_routes_1.default);
app.use('/api/reports', reports_routes_1.default);
// Error handling middleware (must be last)
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map