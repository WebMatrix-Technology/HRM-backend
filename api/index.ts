import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';
import connectDB from '../src/config/database';

// Connect to database (cached connection for serverless)
let isConnected = false;

const connectDatabase = async () => {
  if (isConnected) {
    return;
  }
  try {
    await connectDB();
    isConnected = true;
    console.log('✅ Database connection established');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    // Don't set isConnected to true on error
    // This allows retry on next request
    isConnected = false;
  }
};

// Vercel serverless function handler
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Connect to database if not already connected
  await connectDatabase();
  
  // Handle the request with Express app
  return app(req, res);
}

