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

export default app;

