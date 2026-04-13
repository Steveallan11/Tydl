import { useNavigate } from 'react-router-dom';
import { StepIndicator } from '../../components/booking/StepIndicator';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useBooking } from '../../context/BookingContext';
import { PricingBreakdownComponent } from '../../components/booking/PricingBreakdown';

export function PriceSummary() {
  const navigate = useNavigate();
  const { formData, pricing } = useBooking();

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <StepIndicator currentStep={7} totalSteps={9} />

      <Card>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Review Your Booking</h1>
        <p className="text-slate-600 mb-8">Everything locked in. Ready to proceed?</p>

        {/* Booking Details */}
        <div className="bg-slate-50 rounded-lg p-6 mb-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-slate-700">Service</span>
            <span className="font-semibold text-slate-900">{pricing.details.baseService}</span>
          </div>
          {formData.scheduledDate && formData.scheduledTime && (
            <div className="flex justify-between">
              <span className="text-slate-700">Date & Time</span>
              <span className="font-semibold text-slate-900">
                {formData.scheduledDate} at {formData.scheduledTime}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-700">Supplies</span>
            <span className="font-semibold text-slate-900">
              {formData.supplies === 'platform' ? 'We Provide' : 'You Provide'}
            </span>
          </div>
          {formData.frequency && (
            <div className="flex justify-between">
              <span className="text-slate-700">Frequency</span>
              <span className="font-semibold text-slate-900 capitalize">{formData.frequency}</span>
            </div>
          )}
        </div>

        {/* Pricing Breakdown */}
        <PricingBreakdownComponent pricing={pricing} />

        <div className="bg-gradient-to-r from-accent-50 to-orange-50 border border-accent-200 rounded-lg p-4 mt-6">
          <p className="text-sm text-orange-900">
            ✓ <strong>Price locked in.</strong> This is what you'll pay. No hidden fees, no surprises.
          </p>
        </div>

        <div className="flex gap-4 justify-between pt-8">
          <Button variant="outline" onClick={() => navigate('/book/addons')}>
            ← Back
          </Button>
          <Button onClick={() => navigate('/book/checkout')}>
            Proceed to Payment →
          </Button>
        </div>
      </Card>
    </div>
  );
}
