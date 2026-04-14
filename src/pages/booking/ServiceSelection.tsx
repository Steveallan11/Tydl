import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { StepIndicator } from '../../components/booking/StepIndicator';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useBooking } from '../../context/BookingContext';
import { SERVICES } from '../../lib/constants';
import { ServiceType } from '../../types/booking';

const serviceIcons = {
  'regular-clean': '🧹',
  'one-off-clean': '✨',
  'deep-clean': '🧽',
  'end-of-tenancy': '🏠',
};

export function ServiceSelection() {
  const navigate = useNavigate();
  const { formData, updateFormData } = useBooking();
  const [error, setError] = useState<string | null>(null);

  const handleServiceSelect = (serviceType: ServiceType) => {
    updateFormData({ serviceType });
    setError(null);
  };

  const handleNext = () => {
    if (!formData.serviceType) {
      setError('Please select a service');
      return;
    }
    navigate('/book/property');
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <StepIndicator currentStep={2} totalSteps={9} />

      <Card>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">What service do you need?</h1>
        <p className="text-slate-600 mb-6">Pick the clean that suits you.</p>

        <div className="space-y-3 mb-6">
          {Object.entries(SERVICES).map(([key, service]) => (
            <label
              key={key}
              className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.serviceType === key
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-slate-200 hover:border-brand-300'
              }`}
            >
              <input
                type="radio"
                name="service"
                value={key}
                checked={formData.serviceType === key}
                onChange={() => handleServiceSelect(key as ServiceType)}
                className="w-5 h-5 text-brand-600 accent-brand-600 mt-1 flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{serviceIcons[key as ServiceType]}</span>
                  <div>
                    <div className="font-bold text-slate-900">{service.label}</div>
                    <div className="text-sm text-slate-600">{service.description}</div>
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>

        {error && <p className="text-sm text-red-600 mb-6">{error}</p>}

        <div className="flex gap-4 justify-between pt-4">
          <Button variant="outline" onClick={() => navigate('/book/postcode')}>
            ← Back
          </Button>
          <Button onClick={handleNext}>
            Next →
          </Button>
        </div>
      </Card>
    </div>
  );
}
