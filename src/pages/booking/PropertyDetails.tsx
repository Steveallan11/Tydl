import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { StepIndicator } from '../../components/booking/StepIndicator';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useBooking } from '../../context/BookingContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { PROPERTY_SIZES } from '../../lib/constants';
import { PropertySize } from '../../types/booking';

const sizeIcons: Record<PropertySize, string> = {
  studio: '🏠',
  'one-bed': '🏘️',
  'two-bed': '🏡',
  'three-bed': '🏠',
  'four-plus': '🏢',
};

export function PropertyDetails() {
  const navigate = useNavigate();
  const { formData, updateFormData, pricing } = useBooking();
  const { customer } = useCustomerAuth();
  const [error, setError] = useState<string | null>(null);
  const [useCustomerAddress, setUseCustomerAddress] = useState(!!customer?.full_address);

  // Pre-fill address from customer profile if logged in
  const customerAddress = customer?.full_address ||
    `${customer?.postcode ? `Postcode: ${customer.postcode}` : 'No address on file'}`;

  // If using customer address, update form data
  if (useCustomerAddress && customer?.full_address && !formData.fullAddress) {
    updateFormData({ fullAddress: customer.full_address });
  }

  const handleNext = () => {
    if (!formData.propertySize) {
      setError('Please select property size');
      return;
    }
    if (!formData.fullAddress || formData.fullAddress.trim().length === 0) {
      setError('Address is required');
      return;
    }
    navigate('/book/supplies');
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <StepIndicator currentStep={3} totalSteps={9} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Tell us about your home</h1>
            <p className="text-slate-600 mb-6">Size helps us plan the right time.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                  How many bedrooms?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(PROPERTY_SIZES).map(([key, label]) => (
                    <label
                      key={key}
                      className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.propertySize === key
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-slate-200 hover:border-brand-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="propertySize"
                        value={key}
                        checked={formData.propertySize === key}
                        onChange={(e) => updateFormData({ propertySize: e.target.value as PropertySize })}
                        className="w-4 h-4 text-brand-600 accent-brand-600"
                      />
                      <span className="text-lg">{sizeIcons[key as PropertySize]}</span>
                      <span className="text-slate-700 font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                  Cleaning Address
                </label>

                {/* Use Saved Address Option */}
                {customer?.full_address && (
                  <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all mb-4 ${
                    useCustomerAddress
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-slate-200 hover:border-brand-300'
                  }`}>
                    <input
                      type="radio"
                      name="useCustomerAddress"
                      checked={useCustomerAddress}
                      onChange={(e) => {
                        setUseCustomerAddress(e.target.checked);
                        if (e.target.checked) {
                          updateFormData({ fullAddress: customer.full_address });
                        }
                      }}
                      className="w-4 h-4 text-brand-600 accent-brand-600 mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">Use my saved address</p>
                      <p className="text-sm text-slate-600 mt-1">{customer.full_address}</p>
                    </div>
                  </label>
                )}

                {/* Different Address Option */}
                <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  !useCustomerAddress || !customer?.full_address
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-slate-200 hover:border-brand-300'
                }`}>
                  <input
                    type="radio"
                    name="useCustomerAddress"
                    checked={!useCustomerAddress || !customer?.full_address}
                    onChange={() => setUseCustomerAddress(false)}
                    className="w-4 h-4 text-brand-600 accent-brand-600 mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Different address</p>
                    <textarea
                      placeholder="Enter the full address where we'll clean"
                      value={formData.fullAddress || ''}
                      onChange={(e) => {
                        setUseCustomerAddress(false);
                        updateFormData({ fullAddress: e.target.value });
                      }}
                      rows={3}
                      className="w-full mt-2 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                    />
                  </div>
                </label>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-4 justify-between pt-4">
                <Button variant="outline" onClick={() => navigate('/book/service')}>
                  ← Back
                </Button>
                <Button onClick={handleNext}>
                  Next →
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Pricing Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-brand-50 rounded-lg p-4 border border-brand-200 sticky top-20">
            <div className="text-sm text-slate-600 mb-1">Your price so far</div>
            <div className="text-3xl font-bold font-mono text-brand-600">
              £{Math.round(pricing.totalPrice)}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Price updates as you select options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
