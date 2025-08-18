const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).end();
    }

    const { amount } = req.body || {};
    if (!amount || ![100, 500, 2500].includes(amount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Buy me a coffee" },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL || "http://localhost:8080"}/?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:8080"}/?canceled=true`,
    });

    return res.status(200).json({ id: session.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "stripe_error", message: err.message });
  }
};
