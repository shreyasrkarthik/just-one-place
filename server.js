import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

// API Routes
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { amount } = req.body || {};

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
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/?canceled=true`,
    });

    return res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const { feedback } = req.body;
    console.log('Feedback received:', feedback);
    res.status(200).json({ message: 'Feedback received' });
  } catch (error) {
    console.error('Error processing feedback:', error);
    res.status(500).json({ error: 'Failed to process feedback' });
  }
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
