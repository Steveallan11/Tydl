import { Card } from '../../components/common/Card';

export function MyBookings() {
  return (
    <main className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Bookings</h1>

        <Card>
          <p className="text-slate-600">
            No bookings yet. <a href="/book/postcode" className="text-brand-600 hover:text-brand-700 font-medium">Create your first booking</a>
          </p>
        </Card>
      </div>
    </main>
  );
}
