import dotenv from 'dotenv';
import path from 'path';
import { loginService } from './services/auth.service';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testLogin() {
  try {
    console.log('🧪 Testing login with admin@hrm.com / admin123...');
    const result = await loginService({
      email: 'admin@hrm.com',
      password: 'admin123'
    });
    console.log('✅ Login successful!');
    console.log('User Role:', result.user.role);
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Login failed:', err.message, err.statusCode);
    process.exit(1);
  }
}

testLogin();
