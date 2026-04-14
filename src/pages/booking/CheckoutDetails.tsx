import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { StepIndicator } from '../../components/booking/StepIndicator';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useBooking } from '../../context/BookingContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { validateBookingStep } from '../../lib/validation';

export function CheckoutDetails() {
  const navigate = useNavigate();
  const { formData, updateFormData, isSubmitting, submitBooking } = useBooking();
  const { customer } = useCustomerAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    try {
      await submitBooking();
      // Navigate to confirmation after successful submission
      navigate('/book/confirmation');
    } catch (error) {
      console.error('Booking submission failed:', error);
    }
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

          {/* Trust Badge */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              🔒 Your information is secure and only used to confirm your booking.
            </p>
          </div>

          {/* Buttons */}
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
              {isSubmitting ? 'Processing...' : 'Confirm Booking'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
