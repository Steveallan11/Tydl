import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SERVICES } from '../../lib/constants';

export function Home() {
  return (
    <main className="bg-white">
      {/* Hero Section - Premium */}
      <section className="bg-gradient-to-br from-brand-600 via-brand-500 to-blue-600 text-white pt-24 pb-32 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -ml-36 -mb-36" />

        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
                Get your home clean in minutes
              </h1>
              <p className="text-xl text-blue-100 mb-2 font-medium">
                Book now. Get your cleaner assigned same day.
              </p>
              <p className="text-lg text-blue-50 mb-10">
                No calls. No emails. No games. Just trusted cleaners showing up to make your life easier.
              </p>
              <Link to="/book/postcode">
                <Button size="lg" className="!bg-white !text-brand-600 hover:!bg-slate-100">
                  Book Now
                </Button>
              </Link>

              {/* Trust badges */}
              <div className="mt-12 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <span>✓</span>
                  <span>500+ happy homes cleaned</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>⭐</span>
                  <span>4.9 average rating</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>🚀</span>
                  <span>Book in 90 seconds</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hidden md:block relative">
              <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-8 border border-white border-opacity-20">
                <div className="bg-gradient-to-br from-accent-50 to-amber-100 rounded-xl h-64 flex items-center justify-center">
                  <div className="text-6xl">✨</div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="bg-white bg-opacity-10 rounded-lg p-4">
                    <div className="text-sm text-blue-100 mb-1">Your next clean</div>
                    <div className="font-semibold">Tuesday, 2:00 PM</div>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-lg p-4">
                    <div className="text-sm text-blue-100 mb-1">Your cleaner</div>
                    <div className="font-semibold">Sarah • ⭐ 4.9 • Verified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Loved by Busy People</h2>
            <p className="text-lg text-slate-600">See what real customers think about Tydl</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah M.',
                role: 'Marketing Manager',
                quote: 'Finally, a cleaning service that respects my time. Booked in 2 minutes. Done.',
                rating: 5,
                avatar: '👩‍💼'
              },
              {
                name: 'James P.',
                role: 'Software Developer',
                quote: 'No phone calls, no surprise fees, no hassle. This is how it should be.',
                rating: 5,
                avatar: '👨‍💻'
              },
              {
                name: 'Emma L.',
                role: 'Working Parent',
                quote: 'Same cleaner every week. One click to rebook. Game changer for our family.',
                rating: 5,
                avatar: '👩‍🦰'
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <span key={j} className="text-accent-500">★</span>
                  ))}
                </div>
                <p className="text-slate-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-brand-600 mb-2">500+</div>
              <div className="text-slate-600 text-sm">Homes Cleaned</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-600 mb-2">4.9★</div>
              <div className="text-slate-600 text-sm">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-600 mb-2">90s</div>
              <div className="text-slate-600 text-sm">Average Booking Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-600 mb-2">24h</div>
              <div className="text-slate-600 text-sm">Cleaner Assignment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Enhanced */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">What We Clean</h2>
            <p className="text-lg text-slate-600">Choose the service. We handle the rest.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(SERVICES).map(([key, service]) => {
              const icons = {
                'regular-clean': '🧹',
                'one-off-clean': '✨',
                'deep-clean': '🧽',
                'end-of-tenancy': '🏠'
              };
              return (
                <Link key={key} to="/book/postcode" className="group">
                  <div className="border border-slate-200 rounded-xl p-8 hover:border-brand-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 h-full flex flex-col bg-white">
                    <div className="text-5xl mb-4">{icons[key as keyof typeof icons]}</div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
                      {service.label}
                    </h3>
                    <p className="text-slate-600 text-sm mb-6 flex-1">
                      {service.description}
                    </p>
                    <div className="inline-flex items-center text-brand-600 font-semibold text-sm group-hover:gap-2 gap-1 transition-all">
                      <span>Book</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
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

      {/* FAQ Section */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Common Questions</h2>
            <p className="text-lg text-slate-600">Everything you need to know</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How quickly can I book?',
                a: 'Within 90 seconds. Seriously. Tell us your location, pick a service, and you\'re done.'
              },
              {
                q: 'How do I know my cleaner is vetted?',
                a: 'Every cleaner goes through background checks. You\'ll see their name, photo, and ratings before your appointment.'
              },
              {
                q: 'What if I need to reschedule?',
                a: 'Easy. Just log in and reschedule with one click. No calls, no explanations needed.'
              },
              {
                q: 'Can I keep the same cleaner?',
                a: 'Yes. If you book regularly, you\'ll get the same person. They learn your home, your preferences, everything.'
              },
              {
                q: 'What if I\'m not happy?',
                a: 'We\'ll make it right. Contact us and we\'ll rebook with a different cleaner at no extra charge.'
              },
              {
                q: 'Do I need to provide supplies?',
                a: 'Nope. We bring everything. Or if you prefer your own products, just let us know when you book.'
              }
            ].map((item, i) => (
              <details key={i} className="bg-white border border-slate-200 rounded-lg p-6 cursor-pointer hover:border-brand-500 transition-colors group">
                <summary className="font-bold text-slate-900 flex justify-between items-center">
                  <span>{item.q}</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-slate-600 mt-4">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-brand-50 py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Want to save 10%?</h3>
          <p className="text-slate-600 mb-6">
            Sign up for our newsletter and get 10% off your first clean.
          </p>
          <form className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
            />
            <Button type="submit" className="whitespace-nowrap">
              Get 10% Off
            </Button>
          </form>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Ready to clean smarter?
          </h2>
          <p className="text-lg text-slate-600 mb-10">
            Book your first clean in 90 seconds. No credit card required.
          </p>
          <Link to="/book/postcode">
            <Button size="lg" className="text-base px-8 py-3">
              Start Booking
            </Button>
          </Link>
          <p className="text-sm text-slate-500 mt-6">
            First clean satisfaction guaranteed or we\'ll redo it free.
          </p>
        </div>
      </section>
    </main>
  );
}
