import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export function About() {
  return (
    <main className="bg-white">
      {/* Header */}
      <section className="bg-brand-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">About Tydl</h1>
          <p className="text-lg text-slate-600">
            Fast cleaning for busy people.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why We Built Tydl</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-4">
              Booking a cleaner shouldn't feel like a hassle. You shouldn't need to:
            </p>
            <ul className="space-y-2 text-slate-600 mb-8">
              <li>• Wait on hold</li>
              <li>• Get quotes from 5 different companies</li>
              <li>• Worry about hidden fees</li>
              <li>• Hope someone shows up</li>
            </ul>
            <p className="text-slate-600 text-lg leading-relaxed">
              <strong>Tydl is different.</strong> Book in 90 seconds. Get a real person assigned.
              Pay a fair price. Your home gets clean. Repeat.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Speed</h3>
              <p className="text-slate-600">
                Book in minutes, not hours. Your time matters.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Honesty</h3>
              <p className="text-slate-600">
                Fixed prices, no surprises. We tell you what's happening.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Trust</h3>
              <p className="text-slate-600">
                Real cleaners, background checked. You know who's coming.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">The Tydl Way</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="w-12 h-12 bg-brand-600 text-white rounded-lg flex items-center justify-center font-bold text-xl mb-4">1</div>
              <h3 className="font-bold text-slate-900 mb-2">Tell Us</h3>
              <p className="text-slate-600 text-sm">What you need, when, and where.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-brand-600 text-white rounded-lg flex items-center justify-center font-bold text-xl mb-4">2</div>
              <h3 className="font-bold text-slate-900 mb-2">We Assign</h3>
              <p className="text-slate-600 text-sm">Real cleaner with name, photo, rating.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-brand-600 text-white rounded-lg flex items-center justify-center font-bold text-xl mb-4">3</div>
              <h3 className="font-bold text-slate-900 mb-2">They Clean</h3>
              <p className="text-slate-600 text-sm">Show up. Do the job. Do it well.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-brand-600 text-white rounded-lg flex items-center justify-center font-bold text-xl mb-4">4</div>
              <h3 className="font-bold text-slate-900 mb-2">Rebook</h3>
              <p className="text-slate-600 text-sm">One click. Same cleaner. Done.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">We Take Safety Seriously</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">✓</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Background Checked</h3>
                <p className="text-slate-600">Every cleaner is vetted and verified before they step foot in your home.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">🔒</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Your Data is Safe</h3>
                <p className="text-slate-600">We protect your personal information with industry-standard encryption and security practices.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">£</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Fair Pricing</h3>
                <p className="text-slate-600">No surprises. Fixed price. Your cleaner gets paid fairly, you pay fairly.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">☎</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Real Support</h3>
                <p className="text-slate-600">Call us. Email us. We're here to help, not to hide behind a chatbot.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Experience the Tydl Difference
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            See what happens when a cleaning company actually respects your time.
          </p>
          <Link to="/book/postcode">
            <Button size="lg">Book Now</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
