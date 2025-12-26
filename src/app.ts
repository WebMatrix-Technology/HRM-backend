import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Parse allowed origins from env (comma-separated) or use defaults
const parseOrigins = (env?: string) => env ? env.split(',').map(s => s.trim()) : [
  'http://localhost:3000',
  'https://hrm-frontend-ten.vercel.app',
];
const allowedOrigins = parseOrigins(process.env.CORS_ORIGIN);

// Middlewares
app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // allow requests with no origin (e.g., server-to-server, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root path
app.get('/', (_req, res) => {
  res.send('HRM Backend is running ✔');
});

// Import routes
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import employeeRoutes from './routes/employee.routes';
import userRoutes from './routes/user.routes';
import attendanceRoutes from './routes/attendance.routes';
import leaveRoutes from './routes/leave.routes';
import payrollRoutes from './routes/payroll.routes';
import performanceRoutes from './routes/performance.routes';
import recruitmentRoutes from './routes/recruitment.routes';
import reportsRoutes from './routes/reports.routes';
import { errorHandler } from './middlewares/error.middleware';

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.use('/api/reports', reportsRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;

