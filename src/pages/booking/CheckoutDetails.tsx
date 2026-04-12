import { StepIndicator } from '../../components/booking/StepIndicator';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export function CheckoutDetails() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <StepIndicator currentStep={8} totalSteps={9} />

      <Card>
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Your Details</h1>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Smith"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
            <input
              type="tel"
              placeholder="01604 123456"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Additional Notes
            </label>
            <textarea
              placeholder="Any special instructions for your cleaner?"
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="flex gap-4 justify-between">
          <Button variant="outline">Back</Button>
          <Button>Complete Booking</Button>
        </div>
      </Card>
    </div>
  );
}
