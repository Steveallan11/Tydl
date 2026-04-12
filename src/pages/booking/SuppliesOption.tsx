import { StepIndicator } from '../../components/booking/StepIndicator';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export function SuppliesOption() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <StepIndicator currentStep={4} totalSteps={9} />

      <Card>
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Who provides supplies?</h1>

        <div className="space-y-3 mb-6">
          <label className="flex items-start p-4 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
            <input
              type="radio"
              name="supplies"
              value="platform"
              className="w-5 h-5 text-brand-600 accent-brand-600 mt-1"
            />
            <div className="ml-4">
              <div className="font-medium text-slate-900">We Provide Supplies</div>
              <div className="text-sm text-slate-600">
                We bring all cleaning products and equipment. You just relax.
              </div>
            </div>
          </label>

          <label className="flex items-start p-4 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
            <input
              type="radio"
              name="supplies"
              value="customer"
              className="w-5 h-5 text-brand-600 accent-brand-600 mt-1"
            />
            <div className="ml-4">
              <div className="font-medium text-slate-900">You Provide Supplies</div>
              <div className="text-sm text-slate-600">
                You have supplies at home. We'll use your preferred products.
              </div>
            </div>
          </label>
        </div>

        <div className="flex gap-4 justify-between">
          <Button variant="outline">Back</Button>
          <Button>Next</Button>
        </div>
      </Card>
    </div>
  );
}
