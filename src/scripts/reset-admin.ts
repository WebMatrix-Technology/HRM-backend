import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcrypt';
import connectDB from '../config/database';
import User from '../models/User.model';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function resetAdmin() {
  try {
    await connectDB();
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const result = await User.updateOne(
      { email: 'admin@hrm.com' },
      { $set: { password: hashedPassword, isActive: true } }
    );
    
    if (result.matchedCount === 0) {
      console.log('❌ User admin@hrm.com not found. Please run seed script first.');
    } else {
      console.log('✅ Admin password reset successfully to: admin123');
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Reset failed:', err);
    process.exit(1);
  }
}

resetAdmin();
