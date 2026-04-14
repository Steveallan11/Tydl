import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export function About() {
  return (
    <main className="bg-white">
      {/* Header - Premium */}
      <section className="bg-gradient-to-br from-brand-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">About Tydl</h1>
          <p className="text-xl text-blue-100">
            We built a cleaning service for people who value their time.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold text-slate-900 mb-8">Why We Built Tydl</h2>

            <div className="bg-gradient-to-r from-brand-50 to-blue-50 border border-brand-200 rounded-xl p-8 mb-12">
              <p className="text-slate-900 text-lg leading-relaxed mb-6">
                Booking a cleaner shouldn't feel like a hassle. You shouldn't need to:
              </p>
              <ul className="space-y-3 text-slate-700">
                <li className="flex gap-3">
                  <span className="text-brand-600 font-bold">✗</span>
                  <span>Wait on hold for 20 minutes</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-600 font-bold">✗</span>
                  <span>Get wildly different quotes from 5 companies</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-600 font-bold">✗</span>
                  <span>Discover hidden fees at checkout</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-600 font-bold">✗</span>
                  <span>Hope someone actually shows up</span>
                </li>
              </ul>
            </div>

            <div className="border-l-4 border-brand-600 pl-8">
              <p className="text-lg text-slate-900 font-semibold mb-3">
                Tydl is different.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed">
                Book in 90 seconds. See your cleaner assigned within 24 hours. Pay the exact price we promised. Your home gets clean. Rebook in one click. Repeat forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 border border-slate-200 hover:border-brand-500 hover:shadow-lg transition-all">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Speed</h3>
              <p className="text-slate-600">
                Book in 90 seconds, not 90 minutes. We know your time is valuable.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 border border-slate-200 hover:border-brand-500 hover:shadow-lg transition-all">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Honesty</h3>
              <p className="text-slate-600">
                Fixed prices, no surprises, no games. We tell you exactly what to expect.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 border border-slate-200 hover:border-brand-500 hover:shadow-lg transition-all">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Trust</h3>
              <p className="text-slate-600">
                Real people, background checked, rated by customers. You know who's coming.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">The Tydl Way</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-b from-brand-50 to-white border border-brand-200 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mb-4 mx-auto">1</div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">You Tell Us</h3>
              <p className="text-slate-600 text-sm">Service type, date, property size. 2 minutes.</p>
            </div>
            <div className="bg-gradient-to-b from-brand-50 to-white border border-brand-200 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mb-4 mx-auto">2</div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">We Assign</h3>
              <p className="text-slate-600 text-sm">Within 24h. Real name, photo, 4.9★ rating.</p>
            </div>
            <div className="bg-gradient-to-b from-brand-50 to-white border border-brand-200 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mb-4 mx-auto">3</div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">They Clean</h3>
              <p className="text-slate-600 text-sm">Show up on time. Do great work. Leave happy.</p>
            </div>
            <div className="bg-gradient-to-b from-brand-50 to-white border border-brand-200 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mb-4 mx-auto">4</div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Rebook</h3>
              <p className="text-slate-600 text-sm">One click. Same person. Same time. Repeat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">We Take Safety & Trust Seriously</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Background Checked</h3>
              <p className="text-slate-600">Every cleaner goes through thorough vetting before they step foot in your home. No exceptions.</p>
            </div>
            <div className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Rated by Customers</h3>
              <p className="text-slate-600">You see real ratings from real people. 4.9★ average. If someone drops below 4.5★, we have a conversation.</p>
            </div>
            <div className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Your Data is Protected</h3>
              <p className="text-slate-600">Industry-standard encryption. We don't sell your data. We don't share it. We protect it.</p>
            </div>
            <div className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real Support</h3>
              <p className="text-slate-600">Call us. Email us. Real people answer. We're here to help, not hide behind a chatbot.</p>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-accent-50 to-orange-50 border border-accent-200 rounded-xl p-8 text-center">
            <p className="text-slate-900 font-semibold mb-2">Our Guarantee</p>
            <p className="text-slate-600">
              If you're not satisfied with your clean, we'll redo it free or refund you. No questions. That's our promise.
            </p>
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
