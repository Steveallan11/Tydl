import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

export function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useCustomerAuth();
  const [upcomingBookings] = useState([
    {
      id: 'BK-1704067200000',
      date: '2026-04-18',
      time: '14:00',
      service: 'Regular Clean',
      address: '42 High Street, Northampton',
      price: 90,
      status: 'confirmed',
    },
  ]);

  const [completedCleans] = useState([
    {
      id: 'BK-1704067200010',
      date: '2026-04-10',
      service: 'Deep Clean',
      address: '15 Park Lane, Northampton',
      price: 130,
      cleaner: 'Sarah Johnson',
      rating: 5,
    },
    {
      id: 'BK-1704067200011',
      date: '2026-04-03',
      service: 'Regular Clean',
      address: '42 High Street, Northampton',
      price: 90,
      cleaner: 'Emma Rodriguez',
      rating: 5,
    },
  ]);

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

        {/* Stats */}
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
              £{(upcomingBookings.reduce((sum, b) => sum + b.price, 0) + completedCleans.reduce((sum, c) => sum + c.price, 0)).toLocaleString()}
            </p>
          </Card>
        </div>

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Upcoming Bookings</h2>
            <div className="space-y-4">
              {upcomingBookings.map(booking => (
                <Card key={booking.id} className="border-l-4 border-l-blue-500">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{booking.service}</h3>
                      <p className="text-sm text-slate-500 mt-1">Booking ID: {booking.id}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                      Confirmed
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Date</p>
                      <p className="font-semibold text-slate-900">{booking.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Time</p>
                      <p className="font-semibold text-slate-900">{booking.time}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Address</p>
                      <p className="font-semibold text-slate-900 text-sm">{booking.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Price</p>
                      <p className="font-mono font-bold text-brand-600 text-lg">£{booking.price}</p>
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
        ) : (
          <Card className="mb-12 text-center py-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Upcoming Bookings</h2>
            <p className="text-slate-600 mb-6">Book a cleaning service today</p>
            <Button onClick={() => navigate('/book/postcode')} className="mx-auto">
              Book a Clean Now
            </Button>
          </Card>
        )}

        {/* Completed Cleans */}
        {completedCleans.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Previous Cleans</h2>
            <div className="space-y-4">
              {completedCleans.map(clean => (
                <Card key={clean.id} className="border-l-4 border-l-green-500 opacity-90">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{clean.service}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {clean.date} • Cleaned by {clean.cleaner}
                      </p>
                      <p className="text-sm text-slate-600 mt-2">{clean.address}</p>
                    </div>
                    <div className="text-right">
                      <div className="mb-3">
                        <p className="text-sm text-slate-600 mb-1">Your Rating</p>
                        <p className="text-lg font-bold text-brand-600">
                          {'⭐'.repeat(clean.rating)}
                        </p>
                      </div>
                      <p className="font-mono font-bold text-slate-900 text-lg">£{clean.price}</p>
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
