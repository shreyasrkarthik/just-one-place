# Stripe Setup

To enable the **Buy me a coffee** feature, add the following values from your Stripe account to the environment:

- `STRIPE_SECRET_KEY` – Secret key used on the server to create Checkout sessions.
- `VITE_STRIPE_PUBLISHABLE_KEY` – Publishable key used in the frontend to initialize Stripe.js.
- `FRONTEND_URL` – URL of the frontend used for redirect after payment (already used by the server).
- *(Optional)* `STRIPE_WEBHOOK_SECRET` – Needed only if you plan to handle webhooks in the future.

Add these values to your `.env` files (root for the frontend and `server/.env` for the backend) before running the app.
