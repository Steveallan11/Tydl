import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { StepIndicator } from '../../components/booking/StepIndicator';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useBooking } from '../../context/BookingContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { validatePostcode } from '../../lib/validation';
import { updateCustomerProfile } from '../../lib/supabase';

export function Postcode() {
  const navigate = useNavigate();
  const { formData, updateFormData } = useBooking();
  const { customer } = useCustomerAuth();
  const [error, setError] = useState<string | null>(null);

  // Auto-advance if logged in and has postcode
  useEffect(() => {
    if (!customer) {
      // Not logged in - redirect to signup
      navigate('/customer/signup', { replace: true });
    } else if (customer.postcode && !formData.postcode) {
      // Logged in with postcode on file - use it and advance
      updateFormData({ postcode: customer.postcode });
      navigate('/book/service', { replace: true });
    }
  }, [customer, navigate, formData.postcode, updateFormData]);

  const handlePostcodeChange = (value: string) => {
    updateFormData({ postcode: value });
    setError(null);
  };

  const handleNext = async () => {
    if (!formData.postcode || formData.postcode.trim().length === 0) {
      setError('Postcode is required');
      return;
    }
    if (!validatePostcode(formData.postcode)) {
      setError('Please enter a valid UK postcode');
      return;
    }

    // Save postcode to customer profile
    if (customer?.id) {
      try {
        await updateCustomerProfile(customer.id, {
          postcode: formData.postcode,
        });
      } catch (err) {
        console.error('Failed to save postcode:', err);
        // Don't block navigation if save fails
      }
    }

    navigate('/book/service');
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <StepIndicator currentStep={1} totalSteps={9} />

      <Card>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Where are you located?</h1>
        <p className="text-slate-600 mb-6">We service Northamptonshire postcodes. Let's check yours.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Postcode
            </label>
            <input
              type="text"
              placeholder="e.g., NN1 1AA"
              value={formData.postcode || ''}
              onChange={(e) => handlePostcodeChange(e.target.value.toUpperCase())}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none transition-colors ${
                error
                  ? 'border-red-500 bg-red-50'
                  : 'border-slate-300'
              }`}
              autoFocus
            />
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            <p className="text-xs text-slate-500 mt-2">
              UK postcodes only. Format: NN1 1AA or NN11AA
            </p>
          </div>

          <div className="flex gap-4 justify-between pt-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button onClick={handleNext}>
              Next →
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
