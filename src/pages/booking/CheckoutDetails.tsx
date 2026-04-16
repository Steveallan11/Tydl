import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Elements, CardElement, AddressElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { StepIndicator } from '../../components/booking/StepIndicator';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useBooking } from '../../context/BookingContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { validateBookingStep, validatePostcode } from '../../lib/validation';
import { getStripe, createPaymentIntent, confirmPayment, getStripeConfig } from '../../lib/stripe';

// Inner component that uses Stripe hooks
function CheckoutForm() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { formData, updateFormData, isSubmitting, submitBooking, pricing, bookingId } = useBooking();
  const { customer, refreshCustomer } = useCustomerAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentError, setPaymentError] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    updateFormData({ [field]: value } as any);
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const requiredFields: Record<string, boolean> = {
      serviceType: !!formData.serviceType,
      propertySize: !!formData.propertySize,
      scheduledDate: !!formData.scheduledDate,
      scheduledTime: !!formData.scheduledTime,
      firstName: !!formData.firstName,
      lastName: !!formData.lastName,
      email: !!formData.email,
      phone: !!formData.phone,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      setPaymentError(`Missing: ${missingFields.join(', ')}`);
      return;
    }

    if (!customer?.id) {
      setPaymentError('No customer found');
      return;
    }

    if (!stripe || !elements) {
      setPaymentError('Payment system not ready');
      return;
    }

    try {
      setPaymentProcessing(true);
      setPaymentError('');

      // Step 1: Create Payment Intent
      const paymentResult = await createPaymentIntent(
        'temp-booking-id', // Temporary ID, will update after booking created
        customer.id,
        pricing.totalPrice,
        `${formData.serviceType} - ${formData.propertySize}`,
        formData.email
      );

      if (!paymentResult.success || !paymentResult.clientSecret) {
        setPaymentError(paymentResult.error || 'Failed to initialize payment');
        return;
      }

      setPaymentIntentId(paymentResult.paymentIntentId || null);
      setClientSecret(paymentResult.clientSecret);

      // Step 2: Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentResult.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: formData.phone,
            },
          },
        }
      );

      if (stripeError) {
        setPaymentError(stripeError.message || 'Payment failed');
        return;
      }

      if (!paymentIntent || paymentIntent.status !== 'succeeded') {
        setPaymentError('Payment was not completed. Please try again.');
        return;
      }

      // Step 3: Confirm payment in database
      await confirmPayment('temp-booking-id', paymentIntent.id);

      // Step 4: ONLY submit booking after payment succeeded
      await submitBooking(customer.id, paymentIntent.id);
      try { await refreshCustomer(); } catch (e) { console.error('Failed to refresh:', e); }

      setTimeout(() => navigate('/book/confirmation'), 500);
    } catch (error: any) {
      setPaymentError(error.message || 'Booking failed');
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (

    <div className="max-w-2xl mx-auto px-6 py-12">
      <StepIndicator currentStep={8} totalSteps={9} />
      <Card>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Confirm & Pay</h1>
        <div className="bg-brand-50 border border-brand-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-lg mb-4">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Service:</span><span className="font-semibold">{formData.serviceType}</span></div>
            <div className="flex justify-between"><span>Property:</span><span className="font-semibold">{formData.propertySize}</span></div>
            <div className="flex justify-between"><span>Date:</span><span className="font-semibold">{formData.scheduledDate}</span></div>
            <div className="flex justify-between border-t pt-2"><span>Total:</span><span className="font-bold">£{pricing.totalPrice.toFixed(2)}</span></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact Information */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Your Contact Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName || ''}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName || ''}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className="px-4 py-2 border rounded-lg"
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Discount Code */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Discount code (optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., TYDL2026"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                disabled={discountApplied}
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              {!discountApplied && (
                <button
                  type="button"
                  onClick={() => {
                    // TODO: Validate discount code
                    if (discountCode.length > 0) {
                      setDiscountApplied(true);
                    } else {
                      setPaymentError('Enter a discount code');
                    }
                  }}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700"
                >
                  Apply
                </button>
              )}
            </div>
            {discountApplied && <p className="text-sm text-green-600 mt-2">✓ Discount applied</p>}
          </div>

          {/* Payment & Address Information */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Billing Address & Payment</h3>
            <div className="border rounded-lg p-4 bg-slate-50">
              <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
              <div className="bg-white border rounded-lg p-3">
                <AddressElement
                  options={{
                    mode: 'billing',
                    defaultValues: {
                      address: {
                        country: 'GB',
                      },
                    },
                  }}
                />
              </div>
              <p className="text-xs text-amber-700 mt-2 bg-amber-50 p-2 rounded">
                💡 <strong>UK users:</strong> If prompted for a "Zip" field, enter any 5 digits (e.g., 12345). Your UK postcode is collected above.
              </p>
            </div>

            <div className="border rounded-lg p-4 bg-slate-50 mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Card Details</label>
              <div className="bg-white border rounded-lg p-3">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#1e293b',
                        '::placeholder': {
                          color: '#94a3b8',
                        },
                      },
                      invalid: {
                        color: '#dc2626',
                      },
                    },
                  }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                💳 Use Stripe test card: 4242 4242 4242 4242, any future date, any CVC
              </p>
            </div>
          </div>

          {/* Error Message */}
          {paymentError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-medium">{paymentError}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/book/summary')}
              disabled={paymentProcessing}
            >
              ← Back
            </Button>
            <Button
              type="submit"
              disabled={paymentProcessing || !stripe || !elements}
            >
              {paymentProcessing ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Processing Payment...
                </>
              ) : (
                `✓ Pay £${pricing.totalPrice.toFixed(2)}`
              )}
            </Button>
          </div>

          <p className="text-xs text-slate-500 text-center">
            Your payment is processed securely by Stripe. We never see your card details.
          </p>
        </form>
      </Card>
    </div>
  );
}

// Outer component that provides Stripe context
export function CheckoutDetails() {
  const stripeConfig = getStripeConfig();
  const stripePromise = getStripe();

  if (!stripeConfig || !stripePromise) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Card>
          <p className="text-red-600">Payment system is not configured. Please contact support.</p>
        </Card>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={stripeConfig}>
      <CheckoutForm />
    </Elements>
  );
}