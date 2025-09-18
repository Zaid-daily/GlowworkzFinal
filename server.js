import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4242;
const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// Create Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { priceId } = req.body;
    if (!priceId) return res.status(400).json({ error: "Missing priceId" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        { price: priceId, quantity: 1 }
      ],
      allow_promotion_codes: true,
      billing_address_collection: "required",
      success_url: `${process.env.SITE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL}/cancel.html`
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Serve SPA-ish routes if needed
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`GloWerkz server running on http://localhost:${PORT}`);
});
