import { StepIndicator } from '../../components/booking/StepIndicator';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export function Postcode() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <StepIndicator currentStep={1} totalSteps={9} />

      <Card>
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Where are you located?</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Postcode
            </label>
            <input
              type="text"
              placeholder="e.g., NN1 1AA"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
            />
            <p className="text-xs text-slate-500 mt-2">
              We operate in Northamptonshire. Enter your postcode to check availability.
            </p>
          </div>

          <div className="flex gap-4 justify-between pt-4">
            <Button variant="outline">Back</Button>
            <Button>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
