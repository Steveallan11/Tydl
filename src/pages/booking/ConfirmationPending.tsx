import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export function ConfirmationPending() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">✓</div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Booking Received</h1>
        <p className="text-xl text-slate-600">
          We're assigning your cleaner. Confirmation coming soon.
        </p>
      </div>

      <Card className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">What happens next?</h2>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">We Assign Your Cleaner</h3>
              <p className="text-slate-600 text-sm">
                Within 24 hours, we'll match you with a vetted cleaner who's perfect for your home.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">You'll Get Details</h3>
              <p className="text-slate-600 text-sm">
                We'll email and SMS you with your cleaner's name, photo, and arrival details.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Clean Day Arrives</h3>
              <p className="text-slate-600 text-sm">
                Your cleaner arrives with all supplies (if you chose platform supplies) and gets to work.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Relax & Rebook</h3>
              <p className="text-slate-600 text-sm">
                Enjoy your clean home. Need another? Rebook in one click with your same cleaner.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Your Booking Details</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Booking ID:</span>
            <span className="font-medium text-slate-900">#BK-2024-001234</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Service:</span>
            <span className="font-medium text-slate-900">Regular Clean</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Scheduled:</span>
            <span className="font-medium text-slate-900">March 15, 2024 at 10:00 AM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Total Price:</span>
            <span className="font-medium text-slate-900">£115.00</span>
          </div>
        </div>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <p className="text-sm text-blue-900">
          📧 Check your email for your booking confirmation and cleaner details.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/" className="flex-1">
          <Button variant="outline" className="w-full">
            Back to Home
          </Button>
        </Link>
        <Link to="/customer/dashboard" className="flex-1">
          <Button className="w-full">View My Bookings</Button>
        </Link>
      </div>
    </div>
  );
}
