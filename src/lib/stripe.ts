import { supabase } from './supabase';
import { loadStripe, Stripe as StripeType } from '@stripe/stripe-js';

// Debug: Log environment variables
console.log('[Stripe Init] VITE_STRIPE_PUBLIC_KEY:', import.meta.env.VITE_STRIPE_PUBLIC_KEY ? '✓ Set' : '✗ Missing');

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

if (!STRIPE_PUBLIC_KEY) {
  console.warn('[Stripe] ⚠️ Stripe public key not configured in environment variables');
  console.warn('[Stripe] Expected VITE_STRIPE_PUBLIC_KEY in .env.local');
}

interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  status: 'succeeded' | 'processing' | 'requires_payment_method' | 'requires_confirmation';
}

interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  clientSecret?: string;
  error?: string;
}

// Initialize Stripe
let stripePromise: Promise<StripeType | null> | null = null;

export async function getStripe() {
  if (!stripePromise && STRIPE_PUBLIC_KEY) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
}

/**
 * Create a payment intent for a booking
 * Calls the Supabase Edge Function to securely create a Stripe payment intent
 */
export async function createPaymentIntent(
  bookingId: string,
  customerId: string,
  amount: number,
  description: string,
  email?: string
): Promise<PaymentResult> {
  try {
    if (!STRIPE_PUBLIC_KEY) {
      throw new Error('Stripe is not configured');
    }

    if (!SUPABASE_URL) {
      throw new Error('Supabase URL not configured');
    }

    console.log('[Stripe] Creating payment intent via Edge Function:', {
      bookingId,
      customerId,
      amount,
      description,
    });

    // Call Supabase Edge Function to create payment intent securely
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/create-payment-intent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}`,
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to pence
          description,
          bookingId,
          customerId,
          email,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create payment intent');
    }

    const data = await response.json();

    console.log('[Stripe] Payment intent created successfully:', data.paymentIntentId);

    // Store payment intent reference in database
    await supabase
      .from('job_financials')
      .insert([
        {
          booking_id: bookingId,
          customer_id: customerId,
          customer_payment: amount,
          cleaner_payout: 0, // Will be calculated separately
          platform_fee: 0,
          net_profit: 0,
          payment_method: 'card',
          payment_status: 'pending',
          stripe_payment_id: data.paymentIntentId,
          created_at: new Date().toISOString(),
        },
      ]);

    return {
      success: true,
      paymentIntentId: data.paymentIntentId,
      clientSecret: data.clientSecret,
    };
  } catch (error: any) {
    console.error('[Stripe] Error creating payment intent:', error);
    return {
      success: false,
      error: error.message || 'Failed to create payment intent',
    };
  }
}

/**
 * Confirm payment for a booking (after customer completes Stripe payment)
 */
export async function confirmPayment(bookingId: string, paymentIntentId: string): Promise<PaymentResult> {
  try {
    // Update the job financial record to mark payment as captured
    const { data, error } = await supabase
      .from('job_financials')
      .update({
        payment_status: 'captured',
        stripe_payment_id: paymentIntentId,
      })
      .eq('booking_id', bookingId)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      paymentIntentId: paymentIntentId,
    };
  } catch (error: any) {
    console.error('Error confirming payment:', error);
    return {
      success: false,
      error: error.message || 'Failed to confirm payment',
    };
  }
}

/**
 * Get payment status for a booking
 */
export async function getPaymentStatus(bookingId: string) {
  try {
    const { data, error } = await supabase
      .from('job_financials')
      .select('*')
      .eq('booking_id', bookingId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  } catch (error: any) {
    console.error('Error getting payment status:', error);
    return null;
  }
}

/**
 * Get Stripe configuration for Elements
 */
export function getStripeConfig() {
  if (!STRIPE_PUBLIC_KEY) {
    console.warn('Stripe public key not configured');
    return null;
  }

  return {
    publishableKey: STRIPE_PUBLIC_KEY,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#4f46e5', // brand-600
        colorBackground: '#ffffff',
        colorText: '#1e293b',
        colorDanger: '#dc2626',
        borderRadius: '8px',
        fontFamily: 'system-ui, sans-serif',
      },
    },
  };
}

/**
 * Save customer payment method for future use
 */
export async function savePaymentMethod(customerId: string, paymentMethodId: string) {
  try {
    // Store payment method reference (not the actual card details)
    const { data, error } = await supabase
      .from('customers')
      .update({
        // Add payment_method_id field to customers table if needed
      })
      .eq('id', customerId)
      .select()
      .single();

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error saving payment method:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Process refund for a cancelled booking
 */
export async function processRefund(bookingId: string, reason: string) {
  try {
    // Update payment status to refunded
    const { data, error } = await supabase
      .from('job_financials')
      .update({
        payment_status: 'refunded',
        notes: `Refunded - ${reason}`,
      })
      .eq('booking_id', bookingId)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      message: 'Refund processed successfully',
    };
  } catch (error: any) {
    console.error('Error processing refund:', error);
    return {
      success: false,
      error: error.message || 'Failed to process refund',
    };
  }
}
