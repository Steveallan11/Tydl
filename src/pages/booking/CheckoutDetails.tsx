import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { StepIndicator } from '../../components/booking/StepIndicator';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { DebugPanel } from '../../components/common/DebugPanel';
import { useBooking } from '../../context/BookingContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { validateBookingStep } from '../../lib/validation';
import { validateDiscountCode, useDiscountCode } from '../../lib/email';

export function CheckoutDetails() {
  const navigate = useNavigate();
  const { formData, updateFormData, isSubmitting, submitBooking, pricing, bookingId } = useBooking();
  const { customer, refreshCustomer } = useCustomerAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [discountApplied, setDiscountApplied] = useState<{ code: string; percentage: number } | null>(null);
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

    // Pre-submit validation - check all required fields are set
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

    // For now, skip Stripe and submit booking directly for testing
    // TODO: Re-enable Stripe payment flow once validation is fixed
    if (!customer?.id) {
      console.error('[CheckoutDetails] No customer ID found');
      setPaymentError('No customer ID found');
      return;
    }

    try {
      setPaymentProcessing(true);
      setPaymentError('');

      console.log('[CheckoutDetails] Submitting booking directly (Stripe disabled for testing)');

      // Submit booking after validation
      await submitBooking(customer.id);

      console.log('[CheckoutDetails] Booking submitted successfully');

      // Refresh customer data to reflect saved address for future bookings
      try {
        await refreshCustomer();
        console.log('[CheckoutDetails] Customer profile refreshed with updated address');
      } catch (refreshError) {
        console.error('[CheckoutDetails] Failed to refresh customer profile:', refreshError);
      }

      // Mark discount code as used if applied
      if (discountApplied) {
        useDiscountCode(discountApplied.code);
      }

      // Navigate to confirmation
      console.log('[CheckoutDetails] Navigating to confirmation');
      setTimeout(() => navigate('/book/confirmation'), 500);
    } catch (error: any) {
      console.error('[CheckoutDetails] Booking submission failed:', error);
      const errorMsg = error.message || error.toString() || 'Booking submission failed. Please try again.';
      setPaymentError(errorMsg);
    } finally {
      setPaymentProcessing(false);
    }
  };


  return (
    <>
      <DebugPanel />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <StepIndicator currentStep={8} totalSteps={9} />

        <Card>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Confirm Your Details</h1>
        <p className="text-slate-600 mb-6">We've pre-filled your information from your profile. Update if needed.</p>

        {/* Booking Summary - What They're Getting */}
        <div className="bg-brand-50 border border-brand-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-lg text-slate-900 mb-4">📋 Your Booking Summary</h3>

          <div className="space-y-3 text-sm">
            {/* Service */}
            <div className="flex justify-between py-2">
              <span className="text-slate-600">Service Type:</span>
              <span className="font-semibold text-slate-900">{formData.serviceType?.replace(/-/g, ' ').toUpperCase()}</span>
            </div>

            {/* Property Size */}
            <div className="flex justify-between py-2 border-t border-brand-200">
              <span className="text-slate-600">Property Size:</span>
              <span className="font-semibold text-slate-900">{formData.propertySize?.replace(/-/g, ' ').toUpperCase()}</span>
            </div>

            {/* Supplies */}
            <div className="flex justify-between py-2">
              <span className="text-slate-600">Supplies:</span>
              <span className="font-semibold text-slate-900">
                {formData.supplies === 'platform' ? '✓ We Provide' : '✓ You Provide'}
              </span>
            </div>

            {/* Frequency */}
            <div className="flex justify-between py-2">
              <span className="text-slate-600">Frequency:</span>
              <span className="font-semibold text-slate-900">{formData.frequency?.toUpperCase() || 'ONCE'}</span>
            </div>

            {/* Scheduled Date & Time */}
            <div className="flex justify-between py-2 border-t border-brand-200">
              <span className="text-slate-600">Scheduled Date:</span>
              <span className="font-semibold text-slate-900">{formData.scheduledDate}</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-slate-600">Scheduled Time:</span>
              <span className="font-semibold text-slate-900">{formData.scheduledTime}</span>
            </div>

            {/* Add-ons */}
            {formData.addOns && formData.addOns.length > 0 && (
              <div className="py-2 border-t border-brand-200">
                <div className="text-slate-600 mb-2">Add-ons:</div>
                <div className="flex flex-wrap gap-2">
                  {(formData.addOns as any[]).map((addon) => (
                    <span key={addon} className="inline-block bg-brand-200 text-brand-900 text-xs px-3 py-1 rounded-full font-medium">
                      + {addon}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Before/After Images */}
            {formData.needsBeforeAfterImages && (
              <div className="py-2 border-t border-brand-200">
                <div className="flex items-center gap-2 text-blue-700 bg-blue-50 p-2 rounded">
                  <span>📸</span>
                  <span className="text-sm font-medium">Before & After Photos Requested</span>
                </div>
              </div>
            )}
          </div>
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              🔒 Your information is secure and only used to confirm your booking.
            </p>
          </div>

          {/* Payment Error */}
          {paymentError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{paymentError}</p>
            </div>
          )}

          {/* Testing Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-900">
              ⚠️ <strong>Testing Mode:</strong> Payment processing is disabled. Click "Confirm Booking" to complete your booking and receive a confirmation email.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/book/summary')}
              disabled={isSubmitting || paymentProcessing}
            >
              ← Back
            </Button>
            <Button type="submit" disabled={isSubmitting || paymentProcessing}>
              {isSubmitting || paymentProcessing ? 'Processing...' : '✓ Confirm Booking'}
            </Button>
          </div>
        </form>
      </Card>
      </div>
    </>
  );
}
