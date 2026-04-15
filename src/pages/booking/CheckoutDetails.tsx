import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { StepIndicator } from '../../components/booking/StepIndicator';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { StripePaymentForm } from '../../components/booking/StripePaymentForm';
import { useBooking } from '../../context/BookingContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { validateBookingStep } from '../../lib/validation';
import { validateDiscountCode, useDiscountCode } from '../../lib/email';

export function CheckoutDetails() {
  const navigate = useNavigate();
  const { formData, updateFormData, isSubmitting, submitBooking, pricing, bookingId } = useBooking();
  const { customer } = useCustomerAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [discountApplied, setDiscountApplied] = useState<{ code: string; percentage: number } | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Pre-fill from customer profile on mount
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

  const handleApplyDiscount = () => {
    setDiscountError('');
    const code = validateDiscountCode(discountCode.toUpperCase());

    if (!code) {
      setDiscountError('Invalid or expired discount code');
      return;
    }

    setDiscountApplied({ code: code.code, percentage: code.percentage });
    setDiscountCode('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate step 8
    const validationErrors = validateBookingStep(8, formData);
    if (validationErrors.length > 0) {
      const errorMap = validationErrors.reduce((acc, err) => {
        acc[err.field] = err.message;
        return acc;
      }, {} as Record<string, string>);
      setErrors(errorMap);
      return;
    }

    // Show payment form instead of direct submission
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!customer?.id) {
      setPaymentError('No customer ID found');
      return;
    }

    try {
      setPaymentProcessing(true);
      setPaymentError('');

      // Submit booking after successful payment
      await submitBooking(customer.id);

      // Mark discount code as used if applied
      if (discountApplied) {
        useDiscountCode(discountApplied.code);
      }

      // Navigate to confirmation after successful submission
      navigate('/book/confirmation');
    } catch (error) {
      console.error('Booking submission failed:', error);
      setPaymentError('Booking submission failed. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setShowPaymentForm(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <StepIndicator currentStep={8} totalSteps={9} />

      <Card>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Confirm Your Details</h1>
        <p className="text-slate-600 mb-6">We've pre-filled your information from your profile. Update if needed.</p>

        {/* Profile Info Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-900">
            <strong>{customer?.first_name} {customer?.last_name}</strong> • {customer?.email} • {customer?.phone}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Edit if needed</h3>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  First Name
                </label>
              <input
                type="text"
                value={formData.firstName || ''}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none ${
                  errors.firstName ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
                placeholder="John"
              />
              {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
            </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName || ''}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none ${
                    errors.lastName ? 'border-red-500 bg-red-50' : 'border-slate-300'
                  }`}
                  placeholder="Smith"
                />
                {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none ${
                  errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
                placeholder="01604 123456"
              />
              {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Special Instructions (optional)
            </label>
            <textarea
              value={formData.customerNotes || ''}
              onChange={(e) => handleChange('customerNotes', e.target.value)}
              placeholder="Any special requests? e.g., allergies, fragile items, etc."
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
            />
          </div>

          {/* Discount Code */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Have a discount code?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., TYDL10OFF"
                value={discountCode}
                onChange={(e) => {
                  setDiscountCode(e.target.value.toUpperCase());
                  setDiscountError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscount()}
                disabled={discountApplied !== null}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none disabled:bg-slate-100"
              />
              {discountApplied ? (
                <button
                  type="button"
                  onClick={() => setDiscountApplied(null)}
                  className="px-4 py-3 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors"
                >
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyDiscount}
                  disabled={!discountCode}
                  className="px-4 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              )}
            </div>
            {discountApplied && (
              <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  ✓ Discount applied! {discountApplied.percentage}% off your booking.
                </p>
              </div>
            )}
            {discountError && (
              <p className="text-sm text-red-600 mt-2">{discountError}</p>
            )}
          </div>

          {/* Price Summary with Discount */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium">£{pricing.totalPrice.toFixed(2)}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discountApplied.percentage}%)</span>
                  <span>-£{(pricing.totalPrice * discountApplied.percentage / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-lg">
                  £{(pricing.totalPrice * (1 - (discountApplied?.percentage || 0) / 100)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              🔒 Your information is secure and only used to confirm your booking.
            </p>
          </div>

          {/* Payment Form (shown after validation) */}
          {showPaymentForm && (
            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">💳 Payment</h2>
              {paymentError && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">{paymentError}</p>
                </div>
              )}
              <StripePaymentForm
                amount={Math.round(pricing.totalPrice * (1 - (discountApplied?.percentage || 0) / 100) * 100)}
                bookingId={bookingId || 'temp'}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                isProcessing={paymentProcessing}
              />
            </div>
          )}

          {/* Buttons */}
          {!showPaymentForm && (
            <div className="flex gap-4 justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/book/summary')}
                disabled={isSubmitting}
              >
                ← Back
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Continue to Payment'}
              </Button>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}
