import dotenv from 'dotenv';

console.log('Before dotenv.config():');
console.log('SMTP_HOST:', process.env.SMTP_HOST);

console.log('\nLoading .env file...');
const result = dotenv.config();

console.log('dotenv.config() result:', result);
console.log('After dotenv.config():');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'NOT SET');
