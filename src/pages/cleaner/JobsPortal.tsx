import { Card } from '../../components/common/Card';

export function JobsPortal() {
  return (
    <main className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Jobs</h1>

        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Assigned Jobs</h2>
          <p className="text-slate-600">No jobs assigned yet. Check back soon!</p>
        </Card>
      </div>
    </main>
  );
}
