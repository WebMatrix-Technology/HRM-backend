import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.DATABASE_URL || '';

  if (!MONGODB_URI) {
    throw new Error('Please define the DATABASE_URL environment variable');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      w: 'majority' as const,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connected successfully');
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', e);
    
    // Provide helpful error message for common issues
    if (e instanceof Error) {
      if (e.message.includes('MongooseServerSelectionError') || e.message.includes('whitelist')) {
        console.error('\n⚠️  MongoDB Atlas Connection Issue Detected!');
        console.error('This error is typically caused by:');
        console.error('1. IP Address not whitelisted in MongoDB Atlas');
        console.error('2. For Vercel/Serverless: You need to whitelist 0.0.0.0/0 (allow all IPs) in MongoDB Atlas Network Access');
        console.error('3. Or check your DATABASE_URL environment variable is correctly set');
        console.error('\nTo fix:');
        console.error('1. Go to MongoDB Atlas Dashboard');
        console.error('2. Navigate to Network Access');
        console.error('3. Add IP Address: 0.0.0.0/0 (allow all IPs)');
        console.error('4. Or use MongoDB Atlas Private Endpoint for better security');
        console.error('\nSee: https://www.mongodb.com/docs/atlas/security-whitelist/\n');
      }
    }
    
    throw e;
  }

  return cached.conn;
}

export default connectDB;
