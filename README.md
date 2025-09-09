# GloWerkz Garage — Full Stack Stripe Build

Street‑Mod neon theme, responsive, with Stripe Checkout + Formspree no‑redirect modals.

## 1) Quick Start (Local)

```bash
npm install
cp .env.example .env
# Open .env and paste your keys:
# STRIPE_SECRET_KEY=sk_test_xxx
# STRIPE_PUBLISHABLE_KEY=pk_test_xxx
# SITE_URL=http://localhost:4242

npm run dev
# open http://localhost:4242
```

- Update `public/js/config.js` with your **publishable** key.
- Replace the three placeholder Price IDs in `public/index.html`:
  - `price_MERCEDES_INSTALL_REPLACE`
  - `price_UNIVERSAL_INSTALL_REPLACE`
  - `price_STARLIGHTS_INSTALL_REPLACE`
- The five IDs you already provided are mapped:
  - BMW F30 → `price_1RxRtLQXop5tU0st3SE9utAY`
  - BMW F20 → `price_1RxRtoQXop5tU0st2BQ4sdMP`
  - Audi A3 → `price_1RxRuVQXop5tU0stc937mST1`
  - Range Rover Velar → `price_1RxRuzQXop5tU0stmoJozy0X`
  - Range Rover Vogue → `price_1RxRvSQXop5tU0stj3us1hN1`

## 2) Formspree (No Redirect)

- Put your Formspree endpoint in `booking.html` and `enquiries.html` where it says `YOUR_FORMSPREE_ID`.
- The form submits via `fetch` and shows a neon modal instead of redirecting.

## 3) Files of Interest

- `server.js` — Express server, `/create-checkout-session` route for Stripe.
- `public/index.html` — Kits grid + Stripe buttons + reactor.
- `public/style.css` — Dark neon theme, white glow hovers, ambient effects.
- `public/js/main.js` — Stripe checkout + forms modal + minor UI helpers.
- `public/js/config.js` — **Paste your Stripe publishable key**.
- `public/js/reactor.js` — Click reactor effect.
- `public/booking.html` — Booking form with exact location + phone, no redirect.
- `public/enquiries.html` — General enquiry page, same UX.
- `public/success.html` & `public/cancel.html` — Post‑checkout pages.
