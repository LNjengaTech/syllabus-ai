# Syllabus AI - Micro SaaS Setup Guide

## 🚀 What's New

Your app now has:
- ✅ **Usage Limits**: Free users get 3 PDF uploads
- ✅ **Subscription System**: Premium access via Stripe (Cards) or M-Pesa (Kenya)
- ✅ **Premium Features**: Unlimited uploads for paying users
- ✅ **Professional UI**: Subscription badges, upgrade prompts, and pricing page

---

## 📋 Setup Instructions

### 1. Database Setup (Supabase)
Run the migration script in your Supabase SQL Editor:
```bash
# The file is located at: supabase_migration.sql
```

This creates:
- `user_profiles` table to track subscriptions
- Indexes and RLS policies for security

### 2. Environment Variables
Copy the values from `ENV_TEMPLATE.md` to your `.env.local`:

**Required for Stripe (Sandbox):**
1. Create a Stripe account at [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Get your `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Create a subscription product and get the `STRIPE_PRICE_ID`
4. Install Stripe CLI for webhook testing:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   This will give you the `STRIPE_WEBHOOK_SECRET`

**Required for M-Pesa (Sandbox):**
1. Register at [Daraja Portal](https://developer.safaricom.co.ke/)
2. Create a sandbox app and get:
   - `MPESA_CONSUMER_KEY`
   - `MPESA_CONSUMER_SECRET`
   - `MPESA_PASSKEY`
3. Use sandbox shortcode: `174379`

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the App
```bash
npm run dev
```

---

## 🧪 Testing the Subscription Flow

### Test Upload Limits (Free Tier)
1. Sign in to the app
2. Go to Dashboard
3. Upload 3 PDFs
4. Try uploading a 4th PDF → You should see the paywall message

### Test Stripe Payment (Sandbox)
1. Hit the upload limit
2. Click "Upgrade" on the banner
3. Go to Pricing Page → Click "Pay with Card (Stripe)"
4. Use test card: `4242 4242 4242 4242`, any future expiry, any CVC
5. Complete checkout
6. Verify the webhook was received (check terminal logs)
7. Refresh the page → You should see the "PRO" badge in the navbar

### Test M-Pesa Payment (Sandbox)
1. Go to Pricing Page
2. Enter a test phone number: `254712345678`
3. Click "Pay KES 999 via M-Pesa"
4. In sandbox mode, the STK push is simulated
5. Use the Daraja Portal to confirm the test transaction
6. Verify webhook callback updates the database

---

## 🗂️ File Structure Overview

### New Files Created
```
src/
├── lib/
│   └── subscription.ts           # Subscription utilities
├── app/
│   ├── api/
│   │   ├── subscription/
│   │   │   └── status/route.ts   # Get user subscription status
│   │   ├── checkout/
│   │   │   ├── stripe/route.ts   # Stripe checkout session
│   │   │   └── mpesa/route.ts    # M-Pesa STK Push
│   │   └── webhooks/
│   │       ├── stripe/route.ts   # Stripe webhook handler
│   │       └── mpesa/route.ts    # M-Pesa callback handler
│   └── pricing/
│       └── page.tsx              # Pricing page
└── components/
    ├── UploadZone.tsx            # Updated with limits
    └── Navbar.tsx                # Added PRO badge

supabase_migration.sql            # Database schema
ENV_TEMPLATE.md                   # Environment variables guide
```

### Modified Files
- `src/app/api/ingest/route.ts` - Added upload limit check
- `src/components/UploadZone.tsx` - Added subscription UI
- `src/components/Navbar.tsx` - Added premium badge

---

## 💡 Next Steps

1. **Test in Production**:
   - Switch from sandbox to live Stripe keys
   - Switch M-Pesa from sandbox to production API
   
2. **Add Subscription Management**:
   - Create a `/settings` page where users can cancel subscriptions
   - Show subscription renewal date

3. **Analytics**:
   - Track conversion rates (free → paid)
   - Monitor M-Pesa vs Stripe usage

4. **Suggested Improvements** (from implementation plan):
   - AI message quotas for free users
   - PDF preview in chat
   - Collaborative study features
   - Export to PDF/Anki

---

## 🔧 Troubleshooting

### Stripe Webhook Not Working
- Make sure `stripe listen` is running
- Check that `STRIPE_WEBHOOK_SECRET` matches the CLI output

### M-Pesa STK Not Received
- Verify your phone number format: `254XXXXXXXXX`
- Check Daraja Portal sandbox logs
- Ensure callback URL is publicly accessible (use ngrok for local testing)

### Upload Limit Not Working
- Check that the `user_profiles` table exists in Supabase
- Verify that `course_files` table is counting uploads correctly

---

## 📞 Support
For issues, check the console logs in both the browser and terminal. Most errors will have detailed messages to help you debug.

Happy building! 🚀
