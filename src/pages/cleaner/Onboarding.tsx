import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export function CleanerOnboarding() {
  return (
    <main className="py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Cleaner Onboarding</h1>

        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Welcome to the Team</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                placeholder="Your first name"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                placeholder="Your phone number"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Postcode Service Area
              </label>
              <input
                type="text"
                placeholder="e.g., NN1"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="pt-4">
              <Button>Submit Application</Button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
