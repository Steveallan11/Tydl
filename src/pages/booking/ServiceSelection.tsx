import { StepIndicator } from '../../components/booking/StepIndicator';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { SERVICES } from '../../lib/constants';

export function ServiceSelection() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <StepIndicator currentStep={2} totalSteps={9} />

      <Card>
        <h1 className="text-3xl font-bold text-slate-900 mb-6">What service do you need?</h1>

        <div className="space-y-3 mb-6">
          {Object.entries(SERVICES).map(([key, service]) => (
            <label
              key={key}
              className="flex items-center p-4 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <input
                type="radio"
                name="service"
                className="w-5 h-5 text-brand-600 accent-brand-600"
              />
              <div className="ml-4">
                <div className="font-medium text-slate-900">{service.label}</div>
                <div className="text-sm text-slate-600">{service.description}</div>
              </div>
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
