import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the project root (one level up from server directory)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('=== Environment Variables Test ===');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'NOT SET');
console.log('TO_EMAIL:', process.env.TO_EMAIL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('');

// Test if the values are what we expect
if (process.env.SMTP_HOST === 'live.smtp.mailtrap.io' && 
    process.env.SMTP_PASS === 'fd760fb49453ec12eaa5a369a7d2073a') {
  console.log('✅ Environment variables loaded correctly!');
} else {
  console.log('❌ Environment variables not loaded correctly!');
}
