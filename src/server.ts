import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initializeSocket } from './socket/socketHandler';
import connectDB from './config/database';

// Load environment variables
dotenv.config();

// Parse allowed origins from env (comma-separated) or use defaults
const parseOrigins = (env?: string) =>
  env ? env.split(',').map((s) => s.trim()) : [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://hrm-frontend-ten.vercel.app',
  ];
const allowedOrigins = parseOrigins(process.env.CORS_ORIGIN);
const isOriginAllowed = (origin?: string) => {
  if (!origin) return true; // Same-origin or non-browser requests
  if (allowedOrigins.includes(origin)) return true;
  // Allow any localhost/127.* port in dev
  if (/^http:\/\/localhost:\d+$/i.test(origin)) return true;
  if (/^http:\/\/127\.0\.0\.1:\d+$/i.test(origin)) return true;
  return false;
};

// Connect to database
connectDB().catch((err) => {
  console.error('❌ Database connection error:', err);
  process.exit(1);
});

const app = express();
const httpServer = createServer(app);

// CORS middleware (must come before other middlewares)
app.use(cors({
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
const io = new Server(httpServer, {
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

// Initialize socket handlers
initializeSocket(io);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Import routes
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import employeeRoutes from './routes/employee.routes';
import userRoutes from './routes/user.routes';
import projectRoutes from './routes/project.routes';
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
app.use('/api/projects', projectRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.use('/api/reports', reportsRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io server initialized`);
});

export { io };

