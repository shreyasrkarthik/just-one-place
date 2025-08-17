import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('=== Email Configuration Debug ===');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'NOT SET');
console.log('TO_EMAIL:', process.env.TO_EMAIL);
console.log('');

// Test email configuration
const testEmail = async () => {
  try {
    console.log('Creating transporter...');
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'live.smtp.mailtrap.io',
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER || 'api',
        pass: process.env.SMTP_PASS
      }
    });

    console.log('Transporter created successfully');
    
    // Verify connection
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('✅ Connection verified successfully!');
    
    // Test sending email
    console.log('Testing email send...');
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@justoneplace.com',
      to: process.env.TO_EMAIL || 'shellshock1947@gmail.com',
      subject: 'Test Email - Just One Place',
      text: 'This is a test email to verify the configuration is working.',
      html: '<h1>Test Email</h1><p>This is a test email to verify the configuration is working.</p>'
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
};

testEmail();
