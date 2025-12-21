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
const parseOrigins = (env) => env ? env.split(',').map(s => s.trim()) : [
    'http://localhost:3000',
    'https://hrm-frontend-ten.vercel.app',
];
const allowedOrigins = parseOrigins(process.env.CORS_ORIGIN);
// Middlewares
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // allow requests with no origin (e.g., server-to-server, curl)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin))
            return callback(null, true);
        return callback(new Error('CORS policy: Origin not allowed'));
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
exports.default = app;
//# sourceMappingURL=app.js.map