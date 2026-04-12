import { StepIndicator } from '../../components/booking/StepIndicator';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ADD_ONS } from '../../lib/constants';

export function AddOns() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <StepIndicator currentStep={6} totalSteps={9} />

      <Card>
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Add any extras?</h1>
        <p className="text-slate-600 mb-6">These are optional. Choose what you need.</p>

        <div className="space-y-3 mb-6">
          {Object.entries(ADD_ONS).map(([key, addon]) => (
            <label
              key={key}
              className="flex items-center p-4 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50"
            >
              <input
                type="checkbox"
                className="w-5 h-5 text-brand-600 rounded accent-brand-600"
              />
              <div className="ml-4 flex-1">
                <div className="font-medium text-slate-900">{addon.label}</div>
              </div>
              <div className="text-slate-700 font-medium">+£{addon.basePrice}</div>
            </label>
          ))}
        </div>

        <div className="flex gap-4 justify-between">
          <Button variant="outline">Back</Button>
          <Button>Next</Button>
        </div>
      </Card>
    </div>
  );
}
