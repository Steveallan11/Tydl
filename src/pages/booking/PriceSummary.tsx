import { StepIndicator } from '../../components/booking/StepIndicator';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export function PriceSummary() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <StepIndicator currentStep={7} totalSteps={9} />

      <Card>
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Price Summary</h1>

        <div className="bg-slate-50 rounded-lg p-6 mb-6 space-y-3">
          <div className="flex justify-between text-slate-700">
            <span>Regular Clean (2 bedrooms)</span>
            <span>£90.00</span>
          </div>
          <div className="flex justify-between text-slate-700">
            <span>Oven cleaning</span>
            <span>£25.00</span>
          </div>
          <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>£115.00</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900">
            ✓ This booking is for one clean on your selected date and time.
          </p>
        </div>

        <div className="flex gap-4 justify-between">
          <Button variant="outline">Back</Button>
          <Button>Proceed to Payment</Button>
        </div>
      </Card>
    </div>
  );
}
