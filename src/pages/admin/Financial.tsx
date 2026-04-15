import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { getPendingPayouts, approvePayout, generateWeeklyPayouts } from '../../lib/payouts';

export function FinancialDashboard() {
  const navigate = useNavigate();
  const { stats, adminId } = useAdmin();
  const { user } = useAuth();
  const [pendingPayouts, setPendingPayouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayout, setSelectedPayout] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    } else {
      loadPayouts();
    }
  }, [user]);

  const loadPayouts = async () => {
    try {
      setIsLoading(true);
      setError('');
      const payouts = await getPendingPayouts();
      setPendingPayouts(payouts);
    } catch (err: any) {
      setError(err.message || 'Failed to load payouts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePayouts = async () => {
    setIsProcessing(true);
    try {
      setError('');
      const summaries = await generateWeeklyPayouts();
      alert(`Generated ${summaries.length} payout batches for this week`);
      await loadPayouts();
    } catch (err: any) {
      setError(err.message || 'Failed to generate payouts');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprovePayout = async (payoutId: string) => {
    setIsProcessing(true);
    try {
      setError('');
      const success = await approvePayout(payoutId);
      if (success) {
        alert('Payout approved!');
        await loadPayouts();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to approve payout');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Financial Dashboard</h1>
        <p className="text-slate-600">Revenue, payouts, and platform margins</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card>
          <p className="text-sm text-slate-600 mb-2">Total Revenue</p>
          <p className="text-4xl font-bold text-slate-900">£{stats.totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-2">{stats.completedBookings} completed bookings</p>
        </Card>

        <Card>
          <p className="text-sm text-slate-600 mb-2">Pending Payments</p>
          <p className="text-4xl font-bold text-yellow-600">£{stats.pendingPayments.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-2">From {stats.assignedBookings} assigned jobs</p>
        </Card>

        <Card>
          <p className="text-sm text-slate-600 mb-2">Pending Payouts</p>
          <p className="text-4xl font-bold text-blue-600">£{stats.pendingPayouts.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-2">To {stats.totalCleaners} cleaners</p>
        </Card>

        <Card>
          <p className="text-sm text-slate-600 mb-2">Platform Margin</p>
          <p className="text-4xl font-bold text-green-600">£{stats.platformMargin.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-2">
            {stats.totalRevenue > 0 ? ((stats.platformMargin / stats.totalRevenue) * 100).toFixed(1) : 0}% of revenue
          </p>
        </Card>
      </div>

      {/* Actions */}
      <Card className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Weekly Payouts</h2>
        <p className="text-slate-600 mb-6">
          Generate and manage cleaner payouts for completed jobs
        </p>

        <div className="flex gap-4 mb-6">
          <Button onClick={handleGeneratePayouts} disabled={isProcessing}>
            {isProcessing ? 'Generating...' : '+ Generate This Week\'s Payouts'}
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/payouts')}>
            View All Payouts
          </Button>
        </div>

        {pendingPayouts.length === 0 ? (
          <div className="bg-slate-50 rounded-lg p-6 text-center">
            <p className="text-slate-600">No pending payouts</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingPayouts.map(payout => (
              <div
                key={payout.id}
                className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">
                      Week of {new Date(payout.periodStart).toLocaleDateString('en-GB')}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      {payout.numJobs} jobs • Total: £{payout.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleApprovePayout(payout.id)}
                      disabled={isProcessing}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <Card>
          <h3 className="text-xl font-bold text-slate-900 mb-6">Revenue by Service</h3>
          <div className="space-y-4">
            {[
              { service: 'Regular Clean', revenue: stats.totalRevenue * 0.4 },
              { service: 'One-Off Clean', revenue: stats.totalRevenue * 0.25 },
              { service: 'Deep Clean', revenue: stats.totalRevenue * 0.2 },
              { service: 'End of Tenancy', revenue: stats.totalRevenue * 0.15 },
            ].map(item => (
              <div key={item.service} className="flex justify-between items-center">
                <span className="text-slate-600">{item.service}</span>
                <div className="flex-1 mx-4 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-brand-600 h-full"
                    style={{ width: `${(item.revenue / stats.totalRevenue) * 100}%` }}
                  />
                </div>
                <span className="font-semibold text-slate-900 min-w-max">
                  £{item.revenue.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-bold text-slate-900 mb-6">Financial Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <span className="text-slate-600">Total Revenue</span>
              <span className="font-bold text-slate-900">£{stats.totalRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <span className="text-slate-600">Cleaner Payouts</span>
              <span className="font-bold text-slate-900">
                £{(stats.totalRevenue - stats.platformMargin).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <span className="text-slate-600">Platform Fee</span>
              <span className="font-bold text-slate-900">£{stats.platformMargin.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-semibold text-slate-900">Profit Margin</span>
              <span className="font-bold text-green-600">
                {stats.totalRevenue > 0 ? ((stats.platformMargin / stats.totalRevenue) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Average Job Value */}
      <Card>
        <h3 className="text-xl font-bold text-slate-900 mb-6">Key Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-slate-600 mb-2">Average Job Value</p>
            <p className="text-3xl font-bold text-slate-900">
              £{stats.averageJobValue.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-2">Completed Bookings</p>
            <p className="text-3xl font-bold text-slate-900">{stats.completedBookings}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-2">Active Cleaners</p>
            <p className="text-3xl font-bold text-slate-900">{stats.verifiedCleaners}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
