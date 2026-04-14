import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { getCustomerBookings } from '../../lib/supabase';

export function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, customer, logout } = useCustomerAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        if (!customer?.id) {
          setIsLoading(false);
          return;
        }
        const data = await getCustomerBookings(customer.id);
        setBookings(data || []);
      } catch (err: any) {
        console.error('Failed to load bookings:', err);
        setError('Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [customer?.id]);

  // Separate upcoming and completed bookings
  const upcomingBookings = bookings.filter(b =>
    ['pending', 'confirmed', 'assigned', 'in-progress'].includes(b.status)
  );

  const completedCleans = bookings.filter(b => b.status === 'completed');

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-lg text-slate-600">Manage your bookings and scheduled cleans</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/customer/account')}
            >
              👤 Account
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await logout();
                navigate('/customer/login');
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Loading/Error States */}
        {isLoading && (
          <Card className="mb-12 text-center py-8">
            <p className="text-slate-600">Loading your bookings...</p>
          </Card>
        )}

        {error && (
          <Card className="mb-12 bg-red-50 border-red-200 text-red-700">
            <p className="text-sm font-medium">{error}</p>
          </Card>
        )}

        {/* Stats */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <p className="text-sm text-slate-600 mb-1">Upcoming Bookings</p>
              <p className="text-3xl font-bold text-brand-600">{upcomingBookings.length}</p>
            </Card>
            <Card>
              <p className="text-sm text-slate-600 mb-1">Completed Cleans</p>
              <p className="text-3xl font-bold text-green-600">{completedCleans.length}</p>
            </Card>
            <Card>
              <p className="text-sm text-slate-600 mb-1">Total Spent</p>
              <p className="text-3xl font-bold text-slate-900">
                £{(upcomingBookings.reduce((sum, b) => sum + (b.total_price || 0), 0) + completedCleans.reduce((sum, c) => sum + (c.total_price || 0), 0)).toLocaleString()}
              </p>
            </Card>
          </div>
        )}

        {/* Upcoming Bookings */}
        {!isLoading && upcomingBookings.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Upcoming Bookings</h2>
            <div className="space-y-4">
              {upcomingBookings.map(booking => (
                <Card key={booking.id} className="border-l-4 border-l-blue-500">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{booking.service_type}</h3>
                      <p className="text-sm text-slate-500 mt-1">Booking ID: {booking.id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                      booking.status === 'assigned' ? 'bg-purple-100 text-purple-700' :
                      'bg-cyan-100 text-cyan-700'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Date</p>
                      <p className="font-semibold text-slate-900">{booking.scheduled_date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Time</p>
                      <p className="font-semibold text-slate-900">{booking.scheduled_time}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Address</p>
                      <p className="font-semibold text-slate-900 text-sm">{customer?.full_address || 'TBD'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Price</p>
                      <p className="font-mono font-bold text-brand-600 text-lg">£{booking.total_price}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => navigate('/customer/bookings')} className="flex-1">
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/book/postcode')}
                    >
                      Book Another
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : !isLoading && (
          <Card className="mb-12 text-center py-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Upcoming Bookings</h2>
            <p className="text-slate-600 mb-6">Book a cleaning service today</p>
            <Button onClick={() => navigate('/book/postcode')} className="mx-auto">
              Book a Clean Now
            </Button>
          </Card>
        )}

        {/* Completed Cleans */}
        {!isLoading && completedCleans.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Previous Cleans</h2>
            <div className="space-y-4">
              {completedCleans.map(clean => (
                <Card key={clean.id} className="border-l-4 border-l-green-500 opacity-90">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{clean.service_type}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {clean.scheduled_date} • Cleaned by {clean.cleaner?.first_name} {clean.cleaner?.last_name}
                      </p>
                      <p className="text-sm text-slate-600 mt-2">{customer?.full_address || 'Address on file'}</p>
                    </div>
                    <div className="text-right">
                      <div className="mb-3">
                        <p className="text-sm text-slate-600 mb-1">Completed</p>
                        <p className="text-lg font-bold text-green-600">✓</p>
                      </div>
                      <p className="font-mono font-bold text-slate-900 text-lg">£{clean.total_price}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/book/postcode')}
                      className="w-full"
                    >
                      Rebook This Service
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
