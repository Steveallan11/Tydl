import { useNavigate } from 'react-router-dom';
import { StepIndicator } from '../../components/booking/StepIndicator';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useBooking } from '../../context/BookingContext';
import { ADD_ONS } from '../../lib/constants';
import { AddOn } from '../../types/booking';

const addonIcons: Record<AddOn, string> = {
  oven: '🔥',
  fridge: '❄️',
  windows: '🪟',
  bedchange: '🛏️',
  productspack: '🧴',
  fullkit: '🛠️',
};

export function AddOns() {
  const navigate = useNavigate();
  const { formData, updateFormData, pricing } = useBooking();

  const toggleAddOn = (addon: AddOn) => {
    const current = formData.addOns || [];
    if (current.includes(addon)) {
      updateFormData({ addOns: current.filter((a) => a !== addon) });
    } else {
      updateFormData({ addOns: [...current, addon] });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <StepIndicator currentStep={6} totalSteps={9} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Add any extras?</h1>
            <p className="text-slate-600 mb-6">Optional. Choose what you need.</p>

            <div className="space-y-3 mb-8">
              {Object.entries(ADD_ONS).map(([key, addon]) => {
                const isSelected = (formData.addOns || []).includes(key as AddOn);
                return (
                  <label
                    key={key}
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-slate-200 hover:border-brand-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleAddOn(key as AddOn)}
                      className="w-5 h-5 text-brand-600 rounded accent-brand-600"
                    />
                    <span className="text-2xl">{addonIcons[key as AddOn]}</span>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900">{addon.label}</div>
                    </div>
                    <div className="text-brand-600 font-semibold font-mono">+£{addon.basePrice}</div>
                  </label>
                );
              })}
            </div>

            <div className="flex gap-4 justify-between pt-4">
              <Button variant="outline" onClick={() => navigate('/book/frequency')}>
                ← Back
              </Button>
              <Button onClick={() => navigate('/book/summary')}>
                Next →
              </Button>
            </div>
          </Card>
        </div>

        {/* Pricing Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-gradient-to-br from-brand-50 to-blue-50 rounded-lg p-6 border border-brand-200 sticky top-20">
            <div className="text-sm text-slate-600 mb-3 font-semibold uppercase tracking-wide">Total Price</div>
            <div className="text-4xl font-bold font-mono text-brand-600 mb-4">
              £{Math.round(pricing.totalPrice)}
            </div>

            <div className="space-y-2 text-sm bg-white rounded-lg p-3">
              {pricing.details.baseService && (
                <div className="flex justify-between text-slate-600">
                  <span>Base service</span>
                  <span className="font-mono">£{pricing.basePrice}</span>
                </div>
              )}
              {pricing.details.addOns.length > 0 && (
                <>
                  <div className="border-t border-slate-100 pt-2">
                    {pricing.details.addOns.map((addon) => (
                      <div key={addon.name} className="flex justify-between text-slate-600 mb-1">
                        <span>{addon.name}</span>
                        <span className="font-mono">+£{addon.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="font-mono">£{Math.round(pricing.totalPrice)}</span>
                  </div>
                </>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-4">
              ✓ Price locked in. No hidden fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
