import { Card } from '../../components/common/Card';

export function CustomerDashboard() {
  return (
    <main className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="text-3xl font-bold text-brand-600">2</div>
            <p className="text-slate-600 text-sm">Upcoming Bookings</p>
          </Card>
          <Card>
            <div className="text-3xl font-bold text-brand-600">12</div>
            <p className="text-slate-600 text-sm">Completed Cleans</p>
          </Card>
          <Card>
            <div className="text-3xl font-bold text-brand-600">£1,240</div>
            <p className="text-slate-600 text-sm">Total Spent</p>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Upcoming Bookings</h2>
          <p className="text-slate-600">No upcoming bookings yet. <a href="/book/postcode" className="text-brand-600 hover:text-brand-700 font-medium">Book a clean</a></p>
        </Card>
      </div>
    </main>
  );
}
