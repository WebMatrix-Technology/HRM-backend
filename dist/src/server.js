"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const socketHandler_1 = require("./socket/socketHandler");
const database_1 = __importDefault(require("./config/database"));
// Load environment variables
dotenv_1.default.config();
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
    // Allow any localhost/127.* port in dev
    if (/^http:\/\/localhost:\d+$/i.test(origin))
        return true;
    if (/^http:\/\/127\.0\.0\.1:\d+$/i.test(origin))
        return true;
    return false;
};
// Connect to database
(0, database_1.default)().catch((err) => {
    console.error('❌ Database connection error:', err);
    process.exit(1);
});
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// CORS middleware (must come before other middlewares)
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
// Initialize Socket.io
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: (origin, callback) => {
            if (isOriginAllowed(origin || undefined)) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        },
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
exports.io = io;
// Initialize socket handlers
(0, socketHandler_1.initializeSocket)(io);
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.io server initialized`);
});
//# sourceMappingURL=server.js.map