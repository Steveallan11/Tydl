import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SERVICES } from '../../lib/constants';

export function Services() {
  return (
    <main className="bg-white">
      {/* Header */}
      <section className="bg-brand-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Our Services</h1>
          <p className="text-lg text-slate-600">
            Pick the clean you need. We'll get it done.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-8">
            {Object.entries(SERVICES).map(([key, service]) => (
              <div key={key} className="border border-slate-200 rounded-lg p-8 hover:border-brand-500 hover:shadow-md transition-all">
                <div className="flex justify-between items-start gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">
                      {service.label}
                    </h2>
                    <p className="text-slate-600 mb-6 text-lg">{service.description}</p>
                    <ul className="space-y-2 text-slate-600 mb-6">
                      <li>✓ Vetted cleaners</li>
                      <li>✓ Fixed pricing</li>
                      <li>✓ Same-day assignment</li>
                      <li>✓ Easy rescheduling</li>
                    </ul>
                  </div>
                  <Link to="/book/postcode" className="flex-shrink-0">
                    <Button>Book Now</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Add Extras to Your Clean</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'Oven cleaning', price: '+£25' },
              { name: 'Fridge cleaning', price: '+£20' },
              { name: 'Interior windows', price: '+£30' },
              { name: 'Bed change', price: '+£15' },
              { name: 'Products pack', price: '+£10' },
              { name: 'Full cleaning kit', price: '+£50' }
            ].map((addon) => (
              <div key={addon.name} className="bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-center">
                <span className="text-slate-900 font-medium">{addon.name}</span>
                <span className="text-brand-600 font-semibold font-mono">{addon.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to book?</h2>
          <p className="text-lg text-slate-600 mb-8">Pick a service above and book in 90 seconds.</p>
          <Link to="/book/postcode">
            <Button size="lg">Start Booking</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
