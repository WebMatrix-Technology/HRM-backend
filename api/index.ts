import app from '../src/app';
import connectDB from '../src/config/database';

// Export an async handler for Vercel Serverless Functions
export default async function handler(req: any, res: any) {
  // Ensure database is connected before handling the request
  await connectDB();

  // Pass the request to the Express app
  return app(req, res);
}

