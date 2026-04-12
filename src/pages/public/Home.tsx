import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SERVICES } from '../../lib/constants';

export function Home() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="bg-white pt-20 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-50 rounded-full -mr-48 -mt-48 opacity-60" />
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Get your home clean in minutes
            </h1>
            <p className="text-xl text-slate-600 mb-2 font-medium">
              Book now. Get your cleaner assigned same day.
            </p>
            <p className="text-lg text-slate-500 mb-10">
              No calls. No emails. No games. Just a cleaner showing up to make your life easier.
            </p>
            <Link to="/book/postcode">
              <Button size="lg" className="text-base px-8 py-3">
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-fafbfc py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="text-2xl flex-shrink-0">✓</div>
              <div>
                <div className="font-semibold text-slate-900">Vetted Cleaners</div>
                <div className="text-sm text-slate-600">Every cleaner background checked</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl flex-shrink-0">£</div>
              <div>
                <div className="font-semibold text-slate-900">Clear Pricing</div>
                <div className="text-sm text-slate-600">Price locked in. No surprises.</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl flex-shrink-0">⚡</div>
              <div>
                <div className="font-semibold text-slate-900">Lightning Fast</div>
                <div className="text-sm text-slate-600">Book in 90 seconds, not 90 minutes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Services</h2>
            <p className="text-lg text-slate-600">Pick the clean you need. Get it booked in minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(SERVICES).map(([key, service]) => (
              <Link key={key} to="/book/postcode" className="group">
                <div className="border border-slate-200 rounded-xl p-6 hover:border-brand-500 hover:shadow-lg transition-all duration-200 h-full flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
                    {service.label}
                  </h3>
                  <p className="text-slate-600 text-sm mb-6 flex-1">
                    {service.description}
                  </p>
                  <div className="text-brand-600 font-semibold text-sm">Book now →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16">How Tydl Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="w-12 h-12 bg-brand-600 rounded-full flex items-center justify-center font-bold text-lg mb-4">1</div>
              <h3 className="font-bold text-lg mb-2">Tell Us What You Need</h3>
              <p className="text-slate-400 text-sm">Service type, date, and property size. Takes 2 minutes.</p>
            </div>

            <div>
              <div className="w-12 h-12 bg-brand-600 rounded-full flex items-center justify-center font-bold text-lg mb-4">2</div>
              <h3 className="font-bold text-lg mb-2">See Your Price</h3>
              <p className="text-slate-400 text-sm">Price locked in instantly. No negotiations, no surprises.</p>
            </div>

            <div>
              <div className="w-12 h-12 bg-brand-600 rounded-full flex items-center justify-center font-bold text-lg mb-4">3</div>
              <h3 className="font-bold text-lg mb-2">Meet Your Cleaner</h3>
              <p className="text-slate-400 text-sm">We assign within hours. You get their name, photo, and phone.</p>
            </div>

            <div>
              <div className="w-12 h-12 bg-brand-600 rounded-full flex items-center justify-center font-bold text-lg mb-4">4</div>
              <h3 className="font-bold text-lg mb-2">Relax</h3>
              <p className="text-slate-400 text-sm">They show up. Your home gets clean. You book again in 1 click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Pricing That Makes Sense</h2>
          <p className="text-lg text-slate-600 mb-12">Simple. Transparent. No hidden fees.</p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { size: 'Studio', price: '£60' },
              { size: '1 Bed', price: '£75' },
              { size: '2 Bed', price: '£90' },
              { size: '3 Bed', price: '£105' },
              { size: '4+ Bed', price: '£120' }
            ].map((item) => (
              <div key={item.size} className="border border-slate-200 rounded-lg p-4 text-center hover:border-brand-500 transition-colors">
                <div className="text-sm text-slate-600 mb-2">{item.size}</div>
                <div className="text-2xl font-bold text-brand-600 font-mono">{item.price}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/pricing">
              <Button variant="outline" size="lg">
                See Full Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Tydl Section */}
      <section className="bg-brand-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Why Choose Tydl Over Everyone Else?
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-brand-600 font-bold text-2xl flex-shrink-0">→</div>
                <div>
                  <div className="font-bold text-slate-900 mb-1">Built for Busy People</div>
                  <div className="text-slate-600">Not for people who love shopping for cleaning services. You have better things to do.</div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-brand-600 font-bold text-2xl flex-shrink-0">→</div>
                <div>
                  <div className="font-bold text-slate-900 mb-1">Real People, Real Service</div>
                  <div className="text-slate-600">You get a real cleaner's name and photo. Not a company. Not a robot. A person.</div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-brand-600 font-bold text-2xl flex-shrink-0">→</div>
                <div>
                  <div className="font-bold text-slate-900 mb-1">One-Click Rebooking</div>
                  <div className="text-slate-600">Loved your cleaner? Book them again in literally one click. No forms, no calls.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Let's Get Your Home Clean
          </h2>
          <p className="text-lg text-slate-600 mb-10">
            Book now. 90 seconds. No phone calls.
          </p>
          <Link to="/book/postcode">
            <Button size="lg" className="text-base px-8 py-3">
              Start Booking
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
