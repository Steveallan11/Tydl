import { StepIndicator } from '../../components/booking/StepIndicator';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { FREQUENCIES } from '../../lib/constants';

export function FrequencyScheduling() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <StepIndicator currentStep={5} totalSteps={9} />

      <Card>
        <h1 className="text-3xl font-bold text-slate-900 mb-6">How often do you need cleaning?</h1>

        <div className="space-y-3 mb-6">
          {Object.entries(FREQUENCIES).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center p-4 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50"
            >
              <input
                type="radio"
                name="frequency"
                value={key}
                className="w-5 h-5 text-brand-600 accent-brand-600"
              />
              <div className="ml-4">
                <div className="font-medium text-slate-900">{label}</div>
              </div>
            </label>
          ))}
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Preferred Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Preferred Time
            </label>
            <input
              type="time"
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
