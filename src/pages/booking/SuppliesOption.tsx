import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { StepIndicator } from '../../components/booking/StepIndicator';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useBooking } from '../../context/BookingContext';
import { SuppliesOption as SuppliesOptionType } from '../../types/booking';

export function SuppliesOption() {
  const navigate = useNavigate();
  const { formData, updateFormData } = useBooking();

  // Auto-skip supplies question for services where supplies are included
  useEffect(() => {
    const servicesWithIncludedSupplies = ['one-off-clean', 'deep-clean', 'end-of-tenancy'];
    if (servicesWithIncludedSupplies.includes(formData.serviceType || '')) {
      // Auto-set supplies to platform for these services
      updateFormData({ supplies: 'platform' });
      // Navigate to next step (frequency)
      navigate('/book/frequency');
    }
  }, [formData.serviceType, navigate, updateFormData]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <StepIndicator currentStep={4} totalSteps={9} />

      <Card>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Who provides supplies?</h1>
        <p className="text-slate-600 mb-6">Choose what works best for you.</p>

        <div className="space-y-3 mb-8">
          <label
            className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.supplies === 'platform'
                ? 'border-brand-500 bg-brand-50'
                : 'border-slate-200 hover:border-brand-300'
            }`}
          >
            <input
              type="radio"
              name="supplies"
              value="platform"
              checked={formData.supplies === 'platform'}
              onChange={(e) => updateFormData({ supplies: e.target.value as SuppliesOptionType })}
              className="w-5 h-5 text-brand-600 accent-brand-600 mt-1 flex-shrink-0"
            />
            <div>
              <div className="font-bold text-slate-900 mb-1">We Provide Supplies</div>
              <div className="text-sm text-slate-600">
                We bring all cleaning products and equipment. You just relax.
              </div>
            </div>
          </label>

          <label
            className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.supplies === 'customer'
                ? 'border-brand-500 bg-brand-50'
                : 'border-slate-200 hover:border-brand-300'
            }`}
          >
            <input
              type="radio"
              name="supplies"
              value="customer"
              checked={formData.supplies === 'customer'}
              onChange={(e) => updateFormData({ supplies: e.target.value as SuppliesOptionType })}
              className="w-5 h-5 text-brand-600 accent-brand-600 mt-1 flex-shrink-0"
            />
            <div>
              <div className="font-bold text-slate-900 mb-1">You Provide Supplies</div>
              <div className="text-sm text-slate-600">
                You have supplies at home. We'll use your preferred products.
              </div>
            </div>
          </label>
        </div>

        <div className="flex gap-4 justify-between">
          <Button variant="outline" onClick={() => navigate('/book/property')}>
            ← Back
          </Button>
          <Button onClick={() => navigate('/book/frequency')}>
            Next →
          </Button>
        </div>
      </Card>
    </div>
  );
}
