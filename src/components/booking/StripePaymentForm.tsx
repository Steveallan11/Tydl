import { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { getStripe, createPaymentIntent } from '../../lib/stripe';
import { Stripe as StripeType } from '@stripe/stripe-js';
import { supabase } from '../../lib/supabase';

interface StripePaymentFormProps {
  amount: number;
  bookingId: string;
  customerId?: string;
  customerEmail?: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  isProcessing?: boolean;
}

/**
 * Stripe Payment Form Component
 * Handles card payment collection and confirmation
 */
export function StripePaymentForm({
  amount,
  bookingId,
  customerId,
  customerEmail,
  onSuccess,
  onError,
  isProcessing = false,
}: StripePaymentFormProps) {
  const [stripe, setStripe] = useState<StripeType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');

  // Initialize Stripe
  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await getStripe();
        if (!stripeInstance) {
          setError('Stripe payment processing is not available. Please check back later or contact support.');
          console.warn('[StripePaymentForm] Stripe instance is null - keys may not be configured');
          setIsLoading(false);
          return;
        }

        setStripe(stripeInstance);

        // Get Supabase URL from env
        const url = import.meta.env.VITE_SUPABASE_URL;
        if (url) {
          setSupabaseUrl(url);
        }

        // Create payment intent
        console.log('[StripePaymentForm] Creating payment intent for booking:', bookingId);
        const result = await createPaymentIntent(
          bookingId,
          customerId || 'unknown',
          amount / 100, // Convert from pence to pounds
          `Cleaning Service - Booking ${bookingId}`,
          customerEmail
        );

        if (result.success && result.clientSecret) {
          setClientSecret(result.clientSecret);
          console.log('[StripePaymentForm] Client secret obtained:', result.paymentIntentId);
        } else {
          throw new Error(result.error || 'Failed to create payment intent');
        }

        setIsLoading(false);
      } catch (err: any) {
        console.error('[StripePaymentForm] Initialization error:', err);
        setError(err.message || 'Failed to initialize Stripe');
        setIsLoading(false);
      }
    };

    initializeStripe();
  }, [bookingId, customerId, customerEmail, amount]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientSecret) {
      setCardError('Stripe is not initialized. Please refresh and try again.');
      return;
    }

    setCardError(null);
    setIsLoading(true);

    try {
      console.log('[StripePaymentForm] Confirming payment for:', bookingId);

      // Validate card inputs
      if (!cardNumber || cardNumber.length < 15) {
        throw new Error('Please enter a valid card number');
      }
      if (!expiry || !expiry.includes('/')) {
        throw new Error('Please enter expiry date (MM/YY)');
      }
      if (!cvc || cvc.length < 3) {
        throw new Error('Please enter a valid CVC');
      }

      const [month, year] = expiry.split('/');
      const expYear = 2000 + parseInt(year);

      // Call server-side function to confirm payment
      const session = await supabase.auth.getSession();
      const response = await fetch(
        `${supabaseUrl}/functions/v1/confirm-payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.data.session?.access_token || ''}`,
          },
          body: JSON.stringify({
            clientSecret,
            cardNumber: cardNumber.replace(/\s/g, ''),
            expMonth: parseInt(month),
            expYear,
            cvc,
            email: customerEmail,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Payment failed');
      }

      if (result.succeeded) {
        console.log('[StripePaymentForm] Payment succeeded:', result.paymentIntentId);
        onSuccess(result.paymentIntentId);
      } else {
        setCardError(`Payment status: ${result.status}. Please try again.`);
        onError(`Payment status: ${result.status}`);
      }
    } catch (err: any) {
      const message = err.message || 'Payment failed. Please try again.';
      console.error('[StripePaymentForm] Payment error:', err);
      setCardError(message);
      onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !clientSecret) {
    return (
      <div className="bg-slate-50 rounded-lg p-6 text-center">
        <p className="text-slate-600">Setting up secure payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  // Format expiry MM/YY
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  return (
    <form onSubmit={handlePayment} className="space-y-6">
      {/* Card Information */}
      <div className="bg-slate-50 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-slate-900">Payment Information</h3>

        {/* Card Details - Test Mode Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900 mb-3 font-medium">🔒 Secure Test Payment</p>
          <div className="space-y-2 text-xs text-blue-800">
            <p><strong>Test Card:</strong> 4242 4242 4242 4242</p>
            <p><strong>Exp Date:</strong> Any future date (e.g., 12/26)</p>
            <p><strong>CVC:</strong> Any 3 digits (e.g., 123)</p>
            <p className="mt-2 italic">This Stripe test card will not charge your actual card.</p>
          </div>
        </div>

        {/* Card Number Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Card Number
          </label>
          <input
            type="text"
            placeholder="4242 4242 4242 4242"
            maxLength={19}
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
            disabled={isLoading || isProcessing}
          />
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              placeholder="MM/YY"
              maxLength={5}
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
              disabled={isLoading || isProcessing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              CVC
            </label>
            <input
              type="text"
              placeholder="123"
              maxLength={3}
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
              disabled={isLoading || isProcessing}
            />
          </div>
        </div>
      </div>

      {/* Amount Summary */}
      <div className="bg-slate-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-900">Amount to pay:</span>
          <span className="text-2xl font-bold text-brand-600">£{(amount / 100).toFixed(2)}</span>
        </div>
      </div>

      {cardError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{cardError}</p>
        </div>
      )}

      {/* Payment Button */}
      <Button
        type="submit"
        disabled={isProcessing || isLoading || !clientSecret}
        className="w-full"
      >
        {isLoading ? '💳 Securing Payment...' : isProcessing ? '💳 Completing Booking...' : '💳 Complete Payment'}
      </Button>

      {/* Security Note */}
      <div className="text-center text-xs text-slate-600">
        <p>🔒 Your payment information is secured by Stripe</p>
      </div>
    </form>
  );
}
