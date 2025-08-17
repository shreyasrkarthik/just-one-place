import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import Stripe from 'stripe';
// Load .env from the current directory
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

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
const MAILTRAP_API_URL = 'https://send.api.mailtrap.io/api/send';
const MAILTRAP_TOKEN = process.env.SMTP_PASS; // token stored in .env

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

    const response = await fetch(MAILTRAP_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MAILTRAP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
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
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Mailtrap API error: ${response.status} ${errorText}`);
    }

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

// Stripe checkout session endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || ![100, 500, 2500].includes(amount)) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Buy me a coffee' },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?canceled=true`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
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
