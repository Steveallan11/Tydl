import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

const STATUS_COLORS = {
  pending: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', label: 'Awaiting Confirmation' },
  confirmed: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', label: 'Confirmed' },
  'in-progress': { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', label: 'In Progress' },
  completed: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', label: 'Completed' },
  cancelled: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', label: 'Cancelled' },
};

export function MyBookings() {
  const navigate = useNavigate();
  const { user, logout } = useCustomerAuth();
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const [bookings] = useState([
    {
      id: 'BK-1704067200000',
      date: '2026-04-18',
      time: '14:00',
      service: 'Regular Clean',
      address: '42 High Street, Northampton',
      price: 90,
      status: 'confirmed',
      cleaner: 'Sarah Johnson',
      notes: '3-bedroom house, standard supplies provided',
    },
    {
      id: 'BK-1704067200001',
      date: '2026-04-25',
      time: '10:00',
      service: 'Deep Clean',
      address: '87 Market Road, Northampton',
      price: 130,
      status: 'confirmed',
      cleaner: 'Marcus Thompson',
      notes: '2-bedroom apartment, includes kitchen deep clean',
    },
    {
      id: 'BK-1704067200010',
      date: '2026-04-10',
      service: 'Regular Clean',
      address: '42 High Street, Northampton',
      price: 90,
      status: 'completed',
      cleaner: 'Emma Rodriguez',
      notes: 'Clean completed successfully',
    },
  ]);

  const filteredBookings = filterStatus
    ? bookings.filter(b => b.status === filterStatus)
    : bookings;

  const statusOptions = ['confirmed', 'in-progress', 'completed', 'cancelled'];

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">My Bookings</h1>
            <p className="text-lg text-slate-600">View and manage all your cleaning bookings</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/customer/dashboard')}
              variant="outline"
            >
              ← Back to Dashboard
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

        {/* Filter Tabs */}
        <div className="mb-8 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === null
                ? 'bg-brand-600 text-white'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            All Bookings ({bookings.length})
          </button>
          {statusOptions.map(status => {
            const count = bookings.filter(b => b.status === status).length;
            if (count === 0) return null;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  filterStatus === status
                    ? 'bg-brand-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map(booking => (
              <Card
                key={booking.id}
                className={`border-l-4 ${
                  STATUS_COLORS[booking.status as keyof typeof STATUS_COLORS].border
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{booking.service}</h3>
                    <p className="text-sm text-slate-500 mt-1">Booking ID: {booking.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[booking.status as keyof typeof STATUS_COLORS].badge}`}>
                    {STATUS_COLORS[booking.status as keyof typeof STATUS_COLORS].label}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Date & Time</p>
                    <p className="font-semibold text-slate-900">{booking.date}</p>
                    <p className="text-sm text-slate-700">{booking.time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Address</p>
                    <p className="font-semibold text-slate-900 text-sm">{booking.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Cleaner</p>
                    <p className="font-semibold text-slate-900">{booking.cleaner}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Price</p>
                    <p className="font-mono font-bold text-brand-600 text-lg">£{booking.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Notes</p>
                    <p className="text-sm text-slate-700">{booking.notes}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  {booking.status === 'completed' ? (
                    <Button
                      onClick={() => navigate('/book/postcode')}
                      className="flex-1"
                    >
                      Rebook This Service
                    </Button>
                  ) : booking.status === 'confirmed' ? (
                    <>
                      <Button variant="outline" className="flex-1">
                        View Details
                      </Button>
                      <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                        Cancel Booking
                      </Button>
                    </>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {filterStatus ? 'No bookings with this status' : 'No bookings yet'}
            </h2>
            <p className="text-slate-600 mb-6">
              {filterStatus
                ? 'Try adjusting your filter'
                : 'Start by booking your first cleaning service'}
            </p>
            {!filterStatus && (
              <Button onClick={() => navigate('/book/postcode')}>
                Book a Clean Now
              </Button>
            )}
          </Card>
        )}
      </div>
    </main>
  );
}
