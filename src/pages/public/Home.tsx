import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SERVICES } from '../../lib/constants';
import { useEffect, useState } from 'react';
import { ScrollIndicator, useIntersectionAnimation, AnimatedCounter } from '../../hooks/useInteractions';

export function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="bg-white overflow-hidden">
      {/* Hero Section - Premium */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20 overflow-hidden">
        {/* Hero Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/hero-background.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/30 to-black/40" />

        {/* Fallback Gradient (if video doesn't load) */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-blue-50 opacity-0" />

        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <div className="mb-8 inline-block">
                <span className="bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-transparent font-bold text-sm tracking-widest uppercase">
                  ✨ Cleaning Reimagined
                </span>
              </div>

              <h1 className="text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                Get your home clean in <span className="bg-gradient-to-r from-blue-300 to-blue-200 bg-clip-text text-transparent">minutes</span>
              </h1>

              <p className="text-xl text-blue-100 mb-4 font-medium">
                No phone calls. No emails. No games.
              </p>
              <p className="text-lg text-blue-50 mb-12 leading-relaxed">
                Book a trusted local cleaner in 90 seconds. We assign your cleaner same day. You get their name, photo, and rating.
              </p>

              <Link to="/book/postcode" className="group inline-block mb-12">
                <button className="relative px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-700 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden">
                  <span className="relative z-10">Start Booking Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </Link>

              {/* Trust Signals */}
              <div className="space-y-3 pt-8 border-t border-white/30 mt-4">
                <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm px-4 py-3 rounded-lg hover:bg-white/25 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform">✓</div>
                  <div>
                    <div className="font-bold text-white text-lg">500+</div>
                    <div className="text-blue-100 text-sm">Homes cleaned this month</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm px-4 py-3 rounded-lg hover:bg-white/25 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-yellow-400/40 rounded-full flex items-center justify-center text-yellow-200 font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform">⭐</div>
                  <div>
                    <div className="font-bold text-white text-lg">4.9★</div>
                    <div className="text-blue-100 text-sm">Average rating</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm px-4 py-3 rounded-lg hover:bg-white/25 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-cyan-400/40 rounded-full flex items-center justify-center text-cyan-200 font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform">⚡</div>
                  <div>
                    <div className="font-bold text-white text-lg">90s</div>
                    <div className="text-blue-100 text-sm">Book in seconds</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Visual - Animated Card */}
            <div className="hidden lg:flex items-center justify-center animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="relative w-full max-w-md">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-blue-600 rounded-3xl blur-2xl opacity-20" />

                {/* Main card */}
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 overflow-hidden">
                  {/* Card header gradient */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-brand-400 to-blue-400 opacity-10 rounded-full blur-2xl" />

                  <div className="relative">
                    {/* Icon/Visual */}
                    <div className="mb-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-blue-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                        ✨
                      </div>
                    </div>

                    {/* Booking Info */}
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide mb-2">Your Next Clean</p>
                        <div className="flex items-baseline gap-3">
                          <p className="text-3xl font-bold text-slate-900">Tuesday</p>
                          <p className="text-lg text-slate-600">2:00 PM</p>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-6">
                        <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide mb-3">Your Cleaner</p>
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                            S
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">Sarah K.</p>
                            <p className="text-sm text-slate-600">⭐ 4.9 • Verified</p>
                          </div>
                        </div>
                      </div>

                      <button className="w-full mt-8 py-3 bg-gradient-to-r from-brand-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95">
                        Confirm Booking
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ScrollIndicator />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-brand-600 to-brand-800 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tr from-blue-600 to-brand-600 rounded-full opacity-10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-5xl font-bold mb-6">
              Loved by <span className="bg-gradient-to-r from-brand-400 to-blue-400 bg-clip-text text-transparent">busy people</span>
            </h2>
            <p className="text-xl text-slate-300">See why 500+ Northamptonshire homes trust Tydl</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah M.',
                role: 'Marketing Manager',
                quote: 'Finally, a cleaning service that respects my time. Booked in 2 minutes. Done.',
                rating: 5,
                avatar: '👩‍💼',
                delay: '0s'
              },
              {
                name: 'James P.',
                role: 'Software Developer',
                quote: 'No phone calls, no surprise fees, no hassle. This is how it should be.',
                rating: 5,
                avatar: '👨‍💻',
                delay: '0.1s'
              },
              {
                name: 'Emma L.',
                role: 'Working Parent',
                quote: 'Same cleaner every week. One click to rebook. Game changer for our family.',
                rating: 5,
                avatar: '👩‍🦰',
                delay: '0.2s'
              }
            ].map((testimonial, i) => (
              <div key={i} className="animate-fade-in-up group" style={{animationDelay: testimonial.delay}}>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 hover:border-brand-600 transition-all duration-300 hover:shadow-xl hover:shadow-brand-600/20 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-slate-400">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <span key={j} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-slate-300 text-lg leading-relaxed flex-1">&quot;{testimonial.quote}&quot;</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-brand-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Homes Cleaned', count: 500, suffix: '+', icon: '🏠' },
              { label: 'Average Rating', count: 4, suffix: '.9★', icon: '⭐' },
              { label: 'Book in seconds', count: 90, suffix: 's', icon: '⚡' },
              { label: 'Avg Assignment', count: 24, suffix: 'h', icon: '🚀' }
            ].map((stat, i) => (
              <div key={i} className="text-center group animate-fade-in-up text-white hover:scale-110 transition-transform duration-300" style={{animationDelay: `${i * 0.1}s`}}>
                <div className="mb-4 text-5xl group-hover:scale-125 transition-transform duration-300">{stat.icon}</div>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <AnimatedCounter value={stat.count} suffix={stat.suffix} duration={2500} />
                </div>
                <div className="text-blue-100 text-sm lg:text-base font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Enhanced */}
      <section className="py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">What We Clean</h2>
            <p className="text-xl text-slate-600">Pick your service. We handle the rest.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(SERVICES).map(([key, service], index) => {
              const icons = {
                'regular-clean': '🧹',
                'one-off-clean': '✨',
                'deep-clean': '🧽',
                'end-of-tenancy': '🏠'
              };
              return (
                <Link key={key} to="/book/postcode" className="group animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="relative bg-white rounded-2xl p-8 h-full flex flex-col overflow-hidden border border-slate-200 group-hover:border-brand-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    {/* Gradient background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10">
                      <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300 origin-left">
                        {icons[key as keyof typeof icons]}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                        {service.label}
                      </h3>
                      <p className="text-slate-600 text-sm mb-8 flex-1 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="flex items-center text-brand-600 font-bold text-sm gap-2 group-hover:gap-3 transition-all">
                        <span>Choose Service</span>
                        <span className="text-lg">→</span>
                      </div>
                    </div>

                    {/* Border gradient on hover */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-brand-500/30 to-blue-500/30 border border-transparent" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-32 bg-slate-900 text-white overflow-hidden">
        {/* Background gradient elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/20 to-blue-900/20" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-br from-brand-600 to-blue-600 rounded-full opacity-10 blur-3xl -translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-20 animate-fade-in-up">
            <h2 className="text-5xl font-bold mb-4">
              How Tydl <span className="bg-gradient-to-r from-brand-400 to-blue-400 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-slate-300">From booking to clean in 4 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'Tell Us What You Need', desc: 'Service type, date, property size. Takes 90 seconds.' },
              { num: '2', title: 'See Your Price', desc: 'Locked in instantly. No negotiations, no surprises.' },
              { num: '3', title: 'Meet Your Cleaner', desc: 'Assigned within hours with name, photo, and rating.' },
              { num: '4', title: 'Relax', desc: 'They show up. Your home gets clean. Book again in 1 click.' }
            ].map((step, i) => (
              <div key={i} className="group animate-fade-in-up" style={{animationDelay: `${i * 0.15}s`}}>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-600 to-brand-700 rounded-full flex items-center justify-center font-bold text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-lg mb-3 group-hover:text-brand-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-32 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 animate-fade-in-up">
            <h2 className="text-5xl font-bold text-slate-900 mb-4">Pricing That Makes Sense</h2>
            <p className="text-xl text-slate-600">Simple. Transparent. No hidden fees.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            {[
              { size: 'Studio', price: '£60' },
              { size: '1 Bed', price: '£75' },
              { size: '2 Bed', price: '£90' },
              { size: '3 Bed', price: '£105' },
              { size: '4+ Bed', price: '£120' }
            ].map((item, i) => (
              <div key={item.size} className="group animate-fade-in-up" style={{animationDelay: `${i * 0.1}s`}}>
                <div className="relative bg-white border border-slate-200 rounded-2xl p-8 text-center hover:border-brand-500 hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1 group-hover:bg-gradient-to-br group-hover:from-brand-50 group-hover:to-blue-50">
                  <div className="text-sm text-slate-600 font-semibold uppercase tracking-wide mb-4">{item.size}</div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-transparent font-mono">{item.price}</div>
                  <div className="mt-4 text-xs text-slate-500 group-hover:text-brand-600 transition-colors">/clean</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center animate-fade-in-up" style={{animationDelay: '0.5s'}}>
            <Link to="/pricing">
              <button className="group relative px-8 py-4 bg-white border-2 border-brand-600 text-brand-600 font-bold rounded-xl hover:bg-brand-600 hover:text-white transition-all duration-300 inline-flex items-center gap-2 hover:gap-3">
                See Full Pricing
                <span className="text-lg">→</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Tydl Section */}
      <section className="py-32 bg-gradient-to-r from-brand-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="animate-fade-in-up">
              <h2 className="text-5xl font-bold text-slate-900 mb-8 leading-tight">
                Why Choose <span className="bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-transparent">Tydl</span> Over Everyone Else?
              </h2>

              <div className="space-y-8">
                {[
                  {
                    title: 'Built for Busy People',
                    desc: "Not for people who love shopping for cleaning services. You have better things to do."
                  },
                  {
                    title: 'Real People, Real Service',
                    desc: "You get a real cleaner's name and photo. Not a company. Not a robot. A person."
                  },
                  {
                    title: 'One-Click Rebooking',
                    desc: 'Loved your cleaner? Book them again in literally one click. No forms, no calls.'
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group animate-fade-in-up" style={{animationDelay: `${i * 0.15}s`}}>
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      ✓
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 mb-2 text-lg group-hover:text-brand-600 transition-colors">{item.title}</div>
                      <div className="text-slate-600 leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-blue-600 rounded-3xl blur-2xl opacity-20" />
              <div className="relative bg-white rounded-3xl p-12 shadow-2xl border border-slate-100">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-brand-50 rounded-xl group">
                    <div className="text-3xl">⚡</div>
                    <div>
                      <div className="font-bold text-slate-900">Fast Booking</div>
                      <div className="text-sm text-slate-600">90 seconds start to finish</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl group">
                    <div className="text-3xl">👤</div>
                    <div>
                      <div className="font-bold text-slate-900">Real Cleaners</div>
                      <div className="text-sm text-slate-600">Vetted and verified locally</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-accent-50 rounded-xl group">
                    <div className="text-3xl">💚</div>
                    <div>
                      <div className="font-bold text-slate-900">No Surprises</div>
                      <div className="text-sm text-slate-600">Price locked, guaranteed quality</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-5xl font-bold text-slate-900 mb-4">Common Questions</h2>
            <p className="text-xl text-slate-600">Everything you need to know</p>
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
              <details key={i} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:border-brand-500 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{animationDelay: `${i * 0.05}s`}}>
                <summary className="font-bold text-slate-900 flex justify-between items-center p-6 group-open:bg-gradient-to-r group-open:from-brand-50 group-open:to-blue-50 transition-colors duration-300">
                  <span className="text-lg">{item.q}</span>
                  <span className="text-brand-600 group-open:rotate-180 transition-transform duration-300 text-xl">▼</span>
                </summary>
                <div className="border-t border-slate-100 px-6 py-4 bg-slate-50 group-open:bg-white transition-colors duration-300">
                  <p className="text-slate-600 leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-r from-brand-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48" />
        </div>

        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          <h3 className="text-4xl font-bold mb-4 animate-fade-in-up">Get 10% Off Your First Clean</h3>
          <p className="text-blue-100 mb-8 text-lg animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            Join 500+ busy Northamptonshire people who clean smarter.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-6 py-4 rounded-xl border-0 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-600 outline-none font-medium"
            />
            <button type="submit" className="px-6 py-4 bg-white text-brand-600 font-bold rounded-xl hover:bg-slate-100 transition-all duration-300 whitespace-nowrap hover:shadow-xl active:scale-95">
              Get 10% Off
            </button>
          </form>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 text-center bg-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-brand-100 to-blue-100 rounded-full opacity-50 blur-3xl -translate-y-1/2" />

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-6xl font-bold text-slate-900 mb-6 animate-fade-in-up leading-tight">
            Ready to clean <span className="bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-transparent">smarter?</span>
          </h2>
          <p className="text-xl text-slate-600 mb-12 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            Book your first clean in 90 seconds. No credit card required. First clean satisfaction guaranteed.
          </p>

          <Link to="/book/postcode" className="group inline-block animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <button className="relative px-10 py-5 bg-gradient-to-r from-brand-600 to-brand-700 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden">
              <span className="relative z-10">Start Booking Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </Link>

          <p className="text-sm text-slate-500 mt-8 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            ✓ First clean satisfaction guaranteed or we&apos;ll redo it free
          </p>
        </div>
      </section>
    </main>
  );
}
