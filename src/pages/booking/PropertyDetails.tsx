import { StepIndicator } from '../../components/booking/StepIndicator';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { PROPERTY_SIZES } from '../../lib/constants';

export function PropertyDetails() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <StepIndicator currentStep={3} totalSteps={9} />

      <Card>
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Tell us about your property</h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              How many bedrooms?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(PROPERTY_SIZES).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50"
                >
                  <input
                    type="radio"
                    name="propertySize"
                    className="w-4 h-4 text-brand-600 accent-brand-600"
                  />
                  <span className="ml-3 text-slate-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Address
            </label>
            <textarea
              placeholder="Your full address"
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="flex gap-4 justify-between">
          <Button variant="outline">Back</Button>
          <Button>Next</Button>
        </div>
      </Card>
    </div>
  );
}
