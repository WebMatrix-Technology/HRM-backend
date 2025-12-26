import app from '../src/app';
import connectDB from '../src/config/database';

// Connect to database (cached connection for serverless)
// Initialize connection on module load
connectDB().catch((error) => {
  console.error('❌ Initial database connection error:', error);
  // Connection will be retried on first request that needs it
});

// Export the Express app directly for Vercel
// Vercel's @vercel/node runtime will automatically handle Express apps
// The database connection is cached globally, so subsequent requests will use the same connection
export default app;

