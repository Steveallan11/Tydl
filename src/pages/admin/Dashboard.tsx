import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({
  label,
  value,
  icon,
  color = 'blue',
}: {
  label: string;
  value: string | number;
  icon: string;
  color?: 'blue' | 'green' | 'amber' | 'red';
}) => {
  const bgColors = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    amber: 'bg-amber-50 border-amber-200',
    red: 'bg-red-50 border-red-200',
  };

  const iconBgColors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className={`${bgColors[color]} border rounded-lg p-6`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`${iconBgColors[color]} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { stats, bookings, cleaners, setStatusFilter } = useAdmin();

  // Get pending bookings
  const pendingBookings = bookings.filter(b => b.status === 'pending').slice(0, 5);

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header with Logout */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
            <p className="text-lg text-slate-600">Manage bookings and assign cleaners</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600 mb-2">Logged in as <strong>{user?.email}</strong></p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            label="Total Bookings"
            value={stats.totalBookings}
            icon="📋"
            color="blue"
          />
          <StatCard
            label="Pending Assignment"
            value={stats.pendingBookings}
            icon="⏳"
            color="amber"
          />
          <StatCard
            label="In Progress"
            value={stats.inProgressBookings}
            icon="🔄"
            color="green"
          />
          <StatCard
            label="Total Revenue"
            value={`£${Math.round(stats.totalRevenue)}`}
            icon="💰"
            color="green"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            label="Verified Cleaners"
            value={`${stats.verifiedCleaners} / ${stats.totalCleaners}`}
            icon="👤"
            color="blue"
          />
          <StatCard
            label="Completed Cleanings"
            value={stats.completedBookings}
            icon="✓"
            color="green"
          />
          <StatCard
            label="Assigned Bookings"
            value={stats.assignedBookings}
            icon="📌"
            color="blue"
          />
        </div>

        {/* Actions and Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Actions</h2>
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/admin/board')}
                className="w-full text-left"
              >
                📊 View Booking Board
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/admin/financial')}
                className="w-full text-left"
              >
                💰 Financial Dashboard
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/admin/settings')}
                className="w-full text-left"
              >
                ⚙️ Settings & Pricing
              </Button>
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">System Status</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-600">Database</span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span className="text-slate-600">Email Service</span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">Cleaners Available</span>
                <span className="font-semibold text-slate-900">{cleaners.length}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Pending Bookings Quick View */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Pending Bookings</h2>
            <Button variant="secondary" size="sm" onClick={() => navigate('/admin/board')}>
              View All →
            </Button>
          </div>

          {pendingBookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">No pending bookings</p>
              <p className="text-slate-500 text-sm mt-2">All bookings have been assigned! 🎉</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Service</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Date & Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingBookings.map(booking => (
                    <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {booking.firstName} {booking.lastName}
                          </p>
                          <p className="text-sm text-slate-500">{booking.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{booking.serviceType}</td>
                      <td className="py-3 px-4 text-slate-700">
                        {booking.scheduledDate} at {booking.scheduledTime}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        £{Math.round(booking.totalPrice)}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          onClick={() => navigate(`/admin/board?booking=${booking.id}`)}
                        >
                          Assign
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
