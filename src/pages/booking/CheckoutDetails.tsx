import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Elements, CardElement, AddressElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { StepIndicator } from '../../components/booking/StepIndicator';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useBooking } from '../../context/BookingContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { validateBookingStep } from '../../lib/validation';

declare const Stripe: any;

export function CheckoutDetails() {
  const navigate = useNavigate();
  const { formData, updateFormData, submitBooking, pricing } = useBooking();
  const { customer, refreshCustomer } = useCustomerAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentError, setPaymentError] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  useEffect(() => {
    if (customer) {
      updateFormData({
        firstName: formData.firstName || customer.first_name || '',
        lastName: formData.lastName || customer.last_name || '',
        email: formData.email || customer.email || '',
        phone: formData.phone || customer.phone || '',
      });
    }
  }, [customer, updateFormData]);

  const handleChange = (field: string, value: string) => {
    updateFormData({ [field]: value } as any);
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validatePaymentFields = () => {
    if (!cardNumber || cardNumber.length < 15) {
      setPaymentError('Please enter a valid card number');
      return false;
    }
    if (!cardExpiry || !cardExpiry.includes('/')) {
      setPaymentError('Please enter expiry date (MM/YY)');
      return false;
    }
    if (!cardCvc || cardCvc.length < 3) {
      setPaymentError('Please enter a valid CVC');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      setPaymentError(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    const validationErrors = validateBookingStep(8, formData);
    if (validationErrors.length > 0) {
      const errorMap = validationErrors.reduce((acc, err) => {
        acc[err.field] = err.message;
        return acc;
      }, {} as Record<string, string>);
      setErrors(errorMap);
      return;
    }

    if (!validatePaymentFields()) {
      return;
    }

    if (!customer?.id) {
      setPaymentError('No customer ID found');
      return;
    }

    try {
      setPaymentProcessing(true);
      setPaymentError('');

      console.log('[CheckoutDetails] Processing payment with card:', cardNumber.slice(-4));

      // For MVP: Simulate payment processing
      // In production, this would call your backend to create a PaymentIntent
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check if card is a test card
      const isTestCard = cardNumber === '4242424242424242' || cardNumber === '5555555555554444';
      if (!isTestCard && !cardNumber.startsWith('4') && !cardNumber.startsWith('5')) {
        setPaymentError('Please use a valid test card (starts with 4 or 5)');
        setPaymentProcessing(false);
        return;
      }

      console.log('[CheckoutDetails] Payment processed successfully');

      // Submit booking after payment success
      await submitBooking(customer.id);
      console.log('[CheckoutDetails] Booking submitted successfully');

      try {
        await refreshCustomer();
      } catch (e) {
        console.error('Failed to refresh customer:', e);
      }

      setTimeout(() => navigate('/book/confirmation'), 500);
    } catch (error: any) {
      console.error('[CheckoutDetails] Payment failed:', error);
      setPaymentError(error.message || 'Payment processing failed. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <StepIndicator currentStep={8} totalSteps={9} />

        <Card>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Confirm Your Details & Pay</h1>
          <p className="text-slate-600 mb-6">Complete your booking by confirming your details and entering payment information.</p>

          {/* Booking Summary */}
          <div className="bg-brand-50 border border-brand-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-lg text-slate-900 mb-4">📋 Your Booking</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Service:</span>
                <span className="font-semibold">{formData.serviceType?.replace(/-/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Property:</span>
                <span className="font-semibold">{formData.propertySize?.replace(/-/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Date:</span>
                <span className="font-semibold">{formData.scheduledDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Time:</span>
                <span className="font-semibold">{formData.scheduledTime}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-base">
                <span>Total:</span>
                <span className="text-lg">£{pricing.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Details */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Customer Details</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Payment Details */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-slate-900 mb-4">💳 Payment Details</h3>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-700">
                  <strong>Test Card:</strong> Use <code className="bg-blue-100 px-2 py-1 rounded">4242 4242 4242 4242</code> with any future date and 3-digit CVC
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
                  maxLength={19}
                  className="w-full px-4 py-2 border rounded-lg font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="12/26"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    maxLength={5}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    maxLength={4}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <p className="text-xs text-amber-700 mt-2 bg-amber-50 p-2 rounded">
                💡 <strong>UK users:</strong> If prompted for a "Zip" field, enter any 5 digits (e.g., 12345). Your UK postcode is collected above.
              </p>
            </div>

            {/* Errors */}
            {paymentError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{paymentError}</p>
              </div>
            )}

            {/* Trust Badge */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">
                🔒 Your payment information is secure and encrypted.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/book/summary')}
                disabled={paymentProcessing}
              >
                ← Back
              </Button>
              <Button
                type="submit"
                disabled={paymentProcessing}
              >
                {paymentProcessing ? '💳 Processing Payment...' : '✓ Pay & Confirm Booking'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

// Outer component that provides Stripe context
