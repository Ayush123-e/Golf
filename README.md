# Golf Hero
Verified Championship Network

Golf Hero is a premium, subscription-based performance tracking and lottery platform for elite golfers. It combines algorithmic score tracking, charitable impact, and a dynamic draw engine to reward active verifiable players.

## Core Architecture

- Frontend: Next.js 16 (App Router, Turbopack)
- Backend: Vercel Serverless Functions
- Database: Supabase (PostgreSQL)
- Authentication: Supabase Auth (Email, Magic Link, Google OAuth)
- Payments: Stripe Subscriptions
- Emails: Resend API
- Styling: Tailwind CSS v4, Framer Motion

## Features

1. Elite Performance Tracking
Users track their rolling 5-score average. Submitting a score locks the data into their profile and grants an entry into the Monthly Draw.

2. Zero-Trust Draw Engine
A fully automated cron-based draw engine. It uses two configurable methods:
- Algorithmic Hash: Weighs the most frequently submitted scores of the month.
- Standard Random: Selects 5 numbers randomly (1-45).

3. Tiered Payout Systems
When results are published, the engine automatically matches scores to entries. Payouts are intelligently split among matched tiers (3 matches = 25%, 4 matches = 35%, 5 matches = 40% of standard pool + jackpot carryovers).

4. Built-in Philanthropy
Subscribers are required to choose an active charity to represent. The system natively integrates fractional revenue accounting to calculate broad impact metrics. 

5. Strict Administrator Tools
Admin hierarchy for managing global constraints, verifying draw integrity, accepting/rejecting physical scorecard proofs from lottery winners, and controlling charity onboarding.

## Environment Variables (.env.local)

The application requires the following environment configurations to deploy successfully:

NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase Auth & Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Payment Infrastructure
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Stripe Products (Subscription Routing)
STRIPE_MONTHLY_PRICE_ID=price_example
STRIPE_YEARLY_PRICE_ID=price_example
STRIPE_DONATION_PRICE_ID=price_example

# Localized Products (India/Regional Bypass)
STRIPE_INR_MONTHLY_PRICE_ID=price_example
STRIPE_INR_YEARLY_PRICE_ID=price_example
STRIPE_INR_DONATION_PRICE_ID=price_example

# Resend Mail Dispatch
RESEND_API_KEY=your_resend_key

# Draw Engine
CRON_SECRET=your_random_secure_cron_secret

## Local Development

1. Install Dependencies
Navigate into the client directory and install dependencies:
```bash
cd client
npm install
```

2. Database Setup
Run the SQL schema located in `server/database/corrected_schema.sql` within your Supabase SQL Editor to construct all mandatory tables, policies, constraints, buckets, and auth triggers.

3. Launch Server
Start the Next.js development server:
```bash
npm run dev
```

## Deployment

The application is heavily optimized for Vercel. 

1. Ensure the Root Directory parameter is set to `client` inside Vercel Build settings.
2. Ensure the Framework Preset is explicitly defined as Next.js.
3. Import all environment variables prior to final build initialization.

A `vercel.json` file dictates cron job schedules (default is day 1 of every month at midnight) calling the `/api/cron/run-draw` endpoint.
