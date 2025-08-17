import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { MailtrapClient } from 'mailtrap';
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

// Mailtrap API configuration
const MAILTRAP_TOKEN = process.env.MAILTRAP_TOKEN;
const mailtrapClient = new MailtrapClient({ token: MAILTRAP_TOKEN });
mailtrapClient.axios.defaults.maxRedirects = 5;

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

    // Prepare email content for Mailtrap API
    const textContent = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;

    await mailtrapClient.send({
      from: {
        email: process.env.FROM_EMAIL || 'hello@demomailtrap.co',
        name: 'Mailtrap Test'
      },
      to: [
        { email: process.env.TO_EMAIL || 'shellshock1947@gmail.com' }
      ],
      subject: `Vibe Pick: Feedback ${email}`,
      text: textContent,
      category: 'Integration Test'
    });

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
