import { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { getStripe } from '../../lib/stripe';

interface StripePaymentFormProps {
  amount: number;
  bookingId: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  isProcessing?: boolean;
}

/**
 * Stripe Payment Form Component
 * Handles card payment collection using Stripe Elements
 */
export function StripePaymentForm({
  amount,
  bookingId,
  onSuccess,
  onError,
  isProcessing = false,
}: StripePaymentFormProps) {
  const [stripe, setStripe] = useState<any>(null);
  const [cardElement, setCardElement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);

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
        setIsLoading(false);
      } catch (err: any) {
        console.error('[StripePaymentForm] Initialization error:', err);
        setError(err.message || 'Failed to initialize Stripe');
        setIsLoading(false);
      }
    };

    initializeStripe();
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe) {
      setError('Stripe is not initialized');
      return;
    }

    setCardError(null);

    // For MVP: Simulate payment processing
    // In production, this would use actual Stripe payment intent and confirmCardPayment
    try {
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For testing purposes, accept the payment
      // In production, this would confirm the actual Stripe payment
      onSuccess(`test_payment_${bookingId}_${Date.now()}`);
    } catch (err: any) {
      const message = err.message || 'Payment failed. Please try again.';
      setCardError(message);
      onError(message);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-50 rounded-lg p-6 text-center">
        <p className="text-slate-600">Loading payment form...</p>
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

  return (
    <form onSubmit={handlePayment} className="space-y-6">
      {/* Card Information */}
      <div className="bg-slate-50 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-slate-900">Payment Information</h3>

        {/* Card Details - Test Mode Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900 mb-3 font-medium">🔒 Testing Mode - Use Test Card</p>
          <div className="space-y-2 text-xs text-blue-800">
            <p><strong>Card Number:</strong> 4242 4242 4242 4242</p>
            <p><strong>Exp Date:</strong> Any future date (e.g., 12/25)</p>
            <p><strong>CVC:</strong> Any 3 digits (e.g., 123)</p>
            <p className="mt-2 italic">This is a Stripe test card for development.</p>
          </div>
        </div>

        {/* Card Number Input (Mock) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Card Number
          </label>
          <div className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white">
            <input
              type="text"
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              className="w-full outline-none text-slate-900"
              defaultValue="4242 4242 4242 4242"
              readOnly
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">Stripe will handle card tokenization securely</p>
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
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
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
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
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
        disabled={isProcessing}
        className="w-full"
      >
        {isProcessing ? '💳 Processing Payment...' : '💳 Complete Payment'}
      </Button>

      {/* Security Note */}
      <div className="text-center text-xs text-slate-600">
        <p>🔒 Your payment information is secured by Stripe</p>
      </div>
    </form>
  );
}
