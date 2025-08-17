import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';
// Load .env from the current directory
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());

// Rate limiting for feedback endpoint
const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many feedback submissions from this IP, please try again later.'
});

// Email configuration
const createTransporter = () => {
  // For development, using Mailtrap Live SMTP
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'live.smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER || 'api',
      pass: process.env.SMTP_PASS
    }
  });
};

// Feedback endpoint
app.post('/api/feedback', feedbackLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Name, email, and message are required' 
      });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ 
        error: 'Please provide a valid email address' 
      });
    }

    // Create email content
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@justoneplace.com',
      to: process.env.TO_EMAIL || 'shellshock1947@gmail.com',
      subject: `Feedback from ${name} - Just One Place`,
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>This feedback was submitted from the Just One Place app.</em></p>
      `,
      text: `
        New Feedback Received
        
        From: ${name} (${email})
        Message: ${message}
        
        This feedback was submitted from the Just One Place app.
      `
    };

    // Send email
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      message: 'Feedback sent successfully' 
    });

  } catch (error) {
    console.error('Error sending feedback:', error);
    res.status(500).json({ 
      error: 'Failed to send feedback. Please try again later.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Feedback endpoint: http://localhost:${PORT}/api/feedback`);
});
