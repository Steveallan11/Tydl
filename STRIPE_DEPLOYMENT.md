# Stripe Integration Deployment Guide

## Overview

The application now uses real Stripe integration with server-side payment processing via Supabase Edge Functions. This ensures PCI compliance and secure handling of payment data.

## What's Changed

### New Components
1. **Supabase Edge Functions** (in `supabase/functions/`):
   - `create-payment-intent`: Creates Stripe payment intents securely
   - `confirm-payment`: Confirms payments with card details

2. **Updated Payment Flow**:
   - Frontend creates payment intent via Edge Function
   - User enters card details
   - Frontend sends confirmation to another Edge Function
   - Server-side confirms with Stripe API using secret key
   - Payment intent ID returned to frontend and stored in database

## Deployment Steps

### 1. Set Stripe Secret Key in Vercel Environment

Add to your Vercel project settings:

**Environment Variable**: `STRIPE_SECRET_KEY`
**Value**: Your Stripe test secret key (starts with `sk_test_`)

Find your secret key in your Stripe Dashboard:
1. Go to https://dashboard.stripe.com
2. Click on "Developers" in the left sidebar
3. Click "API keys"
4. Copy your "Secret key" (starts with `sk_test_` or `sk_live_`)
5. Add it to Vercel Environment Variables

**IMPORTANT**: Do NOT commit the secret key to git.

### 2. Deploy Supabase Edge Functions

Option A: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Log in to Supabase
supabase login

# Link your project
supabase link --project-ref dqwjunoszmzedleqnqmb

# Deploy the functions
supabase functions deploy create-payment-intent
supabase functions deploy confirm-payment
```

Option B: Via Supabase Dashboard

1. Go to your Supabase project
2. Click "Edge Functions" in the left sidebar
3. Create two functions: `create-payment-intent` and `confirm-payment`
4. Copy the code from `supabase/functions/create-payment-intent/index.ts` and `supabase/functions/confirm-payment/index.ts`
5. Paste into the dashboard and deploy

### 3. Set Stripe Secret Key in Supabase

After deploying the Edge Functions, you need to set the `STRIPE_SECRET_KEY` environment variable:

1. Go to your Supabase project settings
2. Navigate to "Edge Functions" → "Environment Variables"
3. Add a new variable:
   - Key: `STRIPE_SECRET_KEY`
   - Value: Your Stripe test secret key (from Stripe Dashboard → Developers → API keys)
   
This allows the Edge Functions to securely call the Stripe API without exposing the key to the frontend.

### 4. Test the Integration

1. **Verify Environment Variables**:
   - Check that `VITE_STRIPE_PUBLIC_KEY` is set in `.env.local`
   - Check that `VITE_SUPABASE_URL` is set correctly

2. **Test Payment Flow**:
   - Go through the booking process in your test environment
   - Use test card: `4242 4242 4242 4242`
   - Use any future expiry date (e.g., `12/26`)
   - Use any 3-digit CVC (e.g., `123`)
   - Complete the payment

3. **Check Stripe Dashboard**:
   - Log into your Stripe test account
   - Go to Payments
   - Verify that the payment intent appears with status `succeeded`
   - Check the metadata for `bookingId`

4. **Check Database**:
   - Verify the booking was created with status `pending`
   - Check `job_financials` table for the payment record
   - Verify `stripe_payment_id` is populated

## Payment Flow Architecture

```
Frontend                          Supabase                         Stripe
   |                                |                                |
   |--1. Create Booking Details--→  |                                |
   |                                |                                |
   |←--Show Payment Form------------|                                |
   |                                |                                |
   |--2. Call create-payment-intent-|--Create Payment Intent------→ |
   |                                |                                |
   |                                |←---Return Client Secret-------|
   |←--Return Client Secret---------|                                |
   |                                |                                |
   |--3. Enter Card Details------→  |                                |
   |   (Encrypted in Browser)       |                                |
   |                                |                                |
   |--4. Call confirm-payment-----→ |--Confirm Payment with Card---→|
   |   (Card never sent to server)  |                                |
   |                                |←---Payment Status------------|
   |←--Payment Confirmed----------|--|                                |
   |                                |                                |
   |--5. Create Booking-------→     |                                |
   |    (After Payment Success)     |                                |
   |                                |                                |
   |←--Redirect to Confirmation|--   |                                |
```

## Security Notes

1. **Secret Keys**: The `STRIPE_SECRET_KEY` is only used server-side in Edge Functions and never exposed to the client
2. **Card Data**: Card details are sent directly from the browser to the Supabase Edge Function endpoint, then to Stripe's API - never stored in our database
3. **PCI Compliance**: By using Stripe's API for payment confirmation, we avoid handling raw card data directly
4. **Network Security**: All Stripe API calls use HTTPS

## Troubleshooting

### "Stripe is not configured" Error
- Verify `VITE_STRIPE_PUBLIC_KEY` is set in `.env.local`
- Check that Vercel environment variables include the public key
- Rebuild the application after setting the key

### "Edge Function not found" Error
- Verify the functions are deployed to Supabase
- Check the function names match exactly: `create-payment-intent` and `confirm-payment`
- Verify `VITE_SUPABASE_URL` is set correctly

### Payment Confirmation Fails
- Check that `STRIPE_SECRET_KEY` is set in Supabase Edge Functions environment
- Verify the payment intent was created (check `job_financials` table)
- Check Supabase function logs for error details

### Test Card Not Accepted
- Ensure you're using the correct test card: `4242 4242 4242 4242`
- Use any future expiry date
- Use any 3-digit CVC
- Verify you're in test mode (not live mode)

## Testing Scenarios

### Successful Payment
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- Result: Payment succeeds immediately

### Declined Card
- Card: `4000 0000 0000 0002`
- Result: Payment is declined

### Requires Authentication (3D Secure)
- Card: `4000 0025 0000 3155`
- Result: Payment requires additional verification

## Next Steps

1. ✅ Real Stripe integration deployed
2. Test complete payment flow
3. Monitor payments in Stripe dashboard
4. Set up webhooks for real-time payment updates
5. Implement automatic cleaner payout processing based on payments
6. Move to live keys when ready for production

## Support

For issues with:
- **Stripe**: https://stripe.com/docs/
- **Supabase**: https://supabase.com/docs/
- **Payment Processing**: Check your Stripe dashboard for detailed logs
