import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { DebugPanel } from '../../components/common/DebugPanel';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { CleanerManagementSection } from '../../components/admin/CleanerManagementSection';
import { BookingCard } from '../../components/admin/BookingCard';

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

type TabType = 'overview' | 'cleaners';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { stats, bookings, cleaners, setStatusFilter, isLoading, error, refreshData } = useAdmin();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Get pending bookings
  const pendingBookings = bookings.filter(b => b.status === 'pending').slice(0, 5);

  console.log('[AdminDashboard] Render state:', {
    isLoading,
    error,
    totalBookings: bookings.length,
    pendingBookings: pendingBookings.length,
    cleaners: cleaners.length,
    activeTab,
  });

  return (
    <>
      <DebugPanel />
      <main className="bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <p className="text-red-700">{error}</p>
              <button
                onClick={refreshData}
                className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700">Loading dashboard data...</p>
          </div>
        )}

        {/* Header with Logout */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
            <p className="text-lg text-slate-600">Manage bookings and assign cleaners</p>
          </div>
          <div className="text-right space-y-2">
            <p className="text-sm text-slate-600">Logged in as <strong>{user?.email}</strong></p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
              >
                🔄 Refresh
              </Button>
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
        </div>

        {/* Tab Navigation */}
        <div className="mb-12 border-b border-slate-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('cleaners')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === 'cleaners'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              👥 Cleaners
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {pendingBookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onAssign={() => navigate(`/admin/board?booking=${booking.id}`)}
                  onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                />
              ))}
            </div>
          )}
        </Card>
          </>
        )}

        {/* Cleaners Tab */}
        {activeTab === 'cleaners' && (
          <CleanerManagementSection />
        )}
        </div>
      </main>
    </>
  );
}
