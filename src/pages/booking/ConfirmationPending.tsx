import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useBooking } from '../../context/BookingContext';

export function ConfirmationPending() {
  const { bookingId, formData, pricing } = useBooking();

  return (
    <main className="bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Success State */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-100 to-green-100 rounded-full mb-6">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Booking Confirmed</h1>
          <p className="text-xl text-slate-600">
            We're assigning your cleaner. Details coming soon.
          </p>
        </div>

        {/* Booking Details Card */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Booking</h2>

          <div className="space-y-4">
            <div className="flex justify-between pb-4 border-b border-slate-200">
              <span className="text-slate-600">Booking ID</span>
              <span className="font-mono font-bold text-slate-900">{bookingId}</span>
            </div>

            <div className="flex justify-between pb-4 border-b border-slate-200">
              <span className="text-slate-600">Service</span>
              <span className="font-semibold text-slate-900">{pricing.details.baseService}</span>
            </div>

            {formData.scheduledDate && (
              <div className="flex justify-between pb-4 border-b border-slate-200">
                <span className="text-slate-600">Scheduled</span>
                <span className="font-semibold text-slate-900">
                  {formData.scheduledDate} at {formData.scheduledTime}
                </span>
              </div>
            )}

            <div className="flex justify-between pb-4 border-b border-slate-200">
              <span className="text-slate-600">Total Price</span>
              <span className="font-semibold font-mono text-slate-900">£{Math.round(pricing.totalPrice)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600">Status</span>
              <span className="inline-flex items-center gap-2 text-slate-900 font-semibold">
                <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
                Cleaner Being Assigned
              </span>
            </div>
          </div>
        </Card>

        {/* What Happens Next */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">What Happens Next?</h3>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Within 24 Hours</h4>
                <p className="text-slate-600 text-sm">
                  We'll email and text you with your cleaner's name, photo, phone number, and vehicle details.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Before Your Clean</h4>
                <p className="text-slate-600 text-sm">
                  Your cleaner will text to confirm they're on the way. You'll get a knock on the door.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">After Your Clean</h4>
                <p className="text-slate-600 text-sm">
                  Rate your cleaner and rebook in one click. That's it.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Guarantee */}
        <Card className="mb-8 bg-gradient-to-r from-accent-50 to-orange-50 border-accent-200">
          <div className="flex gap-4">
            <span className="text-3xl flex-shrink-0">🛡️</span>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Our Guarantee</h4>
              <p className="text-slate-600 text-sm">
                Not happy? We'll redo the clean free or refund you. No questions, no hassle. That's our promise.
              </p>
            </div>
          </div>
        </Card>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/" className="flex-1">
            <Button variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
          <Link to="/customer/dashboard" className="flex-1">
            <Button className="w-full">
              View My Bookings
            </Button>
          </Link>
        </div>

        {/* Contact */}
        <div className="text-center mt-8 text-sm text-slate-600">
          <p>Questions? Call <a href="tel:01604123456" className="font-semibold text-brand-600 hover:text-brand-700">01604 123 456</a> or email hello@tydl.com</p>
        </div>
      </div>
    </main>
  );
}
