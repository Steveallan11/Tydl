import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { SERVICES } from '../../lib/constants';

export function Services() {
  const serviceIcons = {
    'regular-clean': '🧹',
    'one-off-clean': '✨',
    'deep-clean': '🧽',
    'end-of-tenancy': '🏠'
  };

  const addOns = [
    { name: 'Oven cleaning', price: '£25', icon: '🔥' },
    { name: 'Fridge cleaning', price: '£20', icon: '❄️' },
    { name: 'Interior windows', price: '£30', icon: '🪟' },
    { name: 'Bed change', price: '£15', icon: '🛏️' },
    { name: 'Products pack', price: '£10', icon: '🧴' },
    { name: 'Full cleaning kit', price: '£50', icon: '🛠️' }
  ];

  return (
    <main className="bg-white">
      {/* Header - Premium */}
      <section className="bg-gradient-to-br from-brand-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-blue-100">
            Pick the clean you need. We'll handle the rest.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-8">
            {Object.entries(SERVICES).map(([key, service]) => (
              <div key={key} className="border-2 border-slate-200 rounded-xl p-8 hover:border-brand-500 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-5xl">{serviceIcons[key as keyof typeof serviceIcons]}</div>
                      <div>
                        <h2 className="text-3xl font-bold text-slate-900">
                          {service.label}
                        </h2>
                        <p className="text-slate-600">{service.description}</p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">What's Included:</h3>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        <li>✓ Professional cleaner (vetted & verified)</li>
                        <li>✓ All supplies included (or use your own)</li>
                        <li>✓ Same-day cleaner assignment</li>
                        <li>✓ Flexible rescheduling</li>
                      </ul>
                    </div>
                  </div>
                  <Link to="/book/postcode" className="flex-shrink-0">
                    <Button size="lg">Book Now</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Make Your Clean Extra Special</h2>
            <p className="text-lg text-slate-600">Add extras to your booking</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addOns.map((addon) => (
              <div key={addon.name} className="bg-white border border-slate-200 rounded-lg p-6 hover:border-brand-500 hover:shadow-md transition-all">
                <div className="text-4xl mb-3">{addon.icon}</div>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-slate-900">{addon.name}</div>
                  </div>
                  <div className="text-brand-600 font-semibold font-mono">{addon.price}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-600 mb-4">Mix and match add-ons. Price updates instantly as you select.</p>
            <Link to="/book/postcode">
              <Button variant="outline" size="lg">
                See Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Tydl */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Why Tydl for These Services?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning Fast Booking</h3>
              <p className="text-slate-600">Pick your service, see the price, book in 90 seconds. Done.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Trusted Cleaners</h3>
              <p className="text-slate-600">Every cleaner is background checked and rated by real customers.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Honest Pricing</h3>
              <p className="text-slate-600">Fixed prices, no surprises. What you see is what you pay.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-50 py-16 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Pick a service. Get it booked.</h2>
          <p className="text-lg text-slate-600 mb-8">90 seconds to a cleaner assigned.</p>
          <Link to="/book/postcode">
            <Button size="lg">Start Booking</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
