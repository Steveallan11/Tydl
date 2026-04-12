import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export function Pricing() {
  return (
    <main className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Clear, Transparent Pricing</h1>
        <p className="text-xl text-slate-600 mb-12">
          No hidden fees. No surprises. Just honest pricing based on your property size.
        </p>

        {/* Base Pricing Table */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Regular Clean Pricing</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">
                    Property Size
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-900">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-700">Studio</td>
                  <td className="text-right py-3 px-4 text-slate-700 font-medium">
                    £60
                  </td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-700">1 Bedroom</td>
                  <td className="text-right py-3 px-4 text-slate-700 font-medium">
                    £75
                  </td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-700">2 Bedrooms</td>
                  <td className="text-right py-3 px-4 text-slate-700 font-medium">
                    £90
                  </td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-700">3 Bedrooms</td>
                  <td className="text-right py-3 px-4 text-slate-700 font-medium">
                    £105
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-700">4+ Bedrooms</td>
                  <td className="text-right py-3 px-4 text-slate-700 font-medium">
                    £120
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add-ons */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Available Add-ons</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-700">Oven cleaning</span>
              <span className="font-medium text-slate-900">+£25</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-700">Fridge cleaning</span>
              <span className="font-medium text-slate-900">+£20</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-700">Interior windows</span>
              <span className="font-medium text-slate-900">+£30</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-700">Bed change</span>
              <span className="font-medium text-slate-900">+£15</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-700">Products pack</span>
              <span className="font-medium text-slate-900">+£10</span>
            </div>
          </div>
        </Card>

        {/* Frequency Options */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequency Options</h2>
          <p className="text-slate-600 mb-6">
            Choose how often you'd like cleaning. Regular bookings help us build a routine with your cleaner.
          </p>
          <div className="space-y-3">
            <div className="py-2 border-b border-slate-100">
              <div className="font-medium text-slate-900">One-time booking</div>
              <div className="text-sm text-slate-600">Pay full price for one clean</div>
            </div>
            <div className="py-2 border-b border-slate-100">
              <div className="font-medium text-slate-900">Weekly</div>
              <div className="text-sm text-slate-600">Same cleaner every week • Easy reschedule</div>
            </div>
            <div className="py-2 border-b border-slate-100">
              <div className="font-medium text-slate-900">Biweekly</div>
              <div className="text-sm text-slate-600">Every 2 weeks • Perfect for maintenance</div>
            </div>
            <div className="py-2">
              <div className="font-medium text-slate-900">Monthly</div>
              <div className="text-sm text-slate-600">Monthly deep cleans • Flexible scheduling</div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <section className="bg-brand-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Ready to get your home clean?
          </h3>
          <p className="text-slate-600 mb-6">
            Start your booking now. We'll calculate the exact price based on your needs.
          </p>
          <Link to="/book/postcode">
            <Button size="lg">Book Now</Button>
          </Link>
        </section>
      </div>
    </main>
  );
}
