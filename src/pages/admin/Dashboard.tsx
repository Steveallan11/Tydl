import { Card } from '../../components/common/Card';

export function AdminDashboard() {
  return (
    <main className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-3xl font-bold text-brand-600">15</div>
            <p className="text-slate-600 text-sm">Pending Assignments</p>
          </Card>
          <Card>
            <div className="text-3xl font-bold text-brand-600">42</div>
            <p className="text-slate-600 text-sm">Active Bookings</p>
          </Card>
          <Card>
            <div className="text-3xl font-bold text-brand-600">28</div>
            <p className="text-slate-600 text-sm">Verified Cleaners</p>
          </Card>
          <Card>
            <div className="text-3xl font-bold text-brand-600">£5,840</div>
            <p className="text-slate-600 text-sm">Revenue (This Month)</p>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Bookings</h2>
          <p className="text-slate-600">Admin booking management coming soon.</p>
        </Card>
      </div>
    </main>
  );
}
