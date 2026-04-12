import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export function About() {
  return (
    <main className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">About Northampton Cleaning</h1>

        {/* Mission */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            We believe busy households deserve access to trusted, affordable cleaning services without the hassle of managing multiple bookings or unclear pricing.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Our mission is simple: make professional cleaning accessible, reliable, and stress-free for families and professionals across Northamptonshire.
          </p>
        </Card>

        {/* Values */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Transparency</h3>
              <p className="text-slate-600 text-sm">
                Clear pricing. No hidden fees. You know exactly what you're paying for.
              </p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Quality</h3>
              <p className="text-slate-600 text-sm">
                Vetted cleaners. Professional standards. We take pride in every clean.
              </p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Reliability</h3>
              <p className="text-slate-600 text-sm">
                Consistent service. Easy rescheduling. You can count on us, every time.
              </p>
            </Card>
          </div>
        </section>

        {/* Trust & Safety */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Trust & Safety</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-2xl flex-shrink-0">✓</div>
              <div>
                <h3 className="font-semibold text-slate-900">Vetted Cleaners</h3>
                <p className="text-slate-600 text-sm">All cleaners undergo thorough background checks and verification.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl flex-shrink-0">🔒</div>
              <div>
                <h3 className="font-semibold text-slate-900">Secure Bookings</h3>
                <p className="text-slate-600 text-sm">Your home and personal data are protected with industry-standard security.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl flex-shrink-0">📞</div>
              <div>
                <h3 className="font-semibold text-slate-900">Support</h3>
                <p className="text-slate-600 text-sm">Our team is here to help. Contact us anytime during business hours.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* How It Works */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">How It Works</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Book Online</h3>
                <p className="text-slate-600 text-sm">
                  Tell us your location, property size, and preferred date. Takes just 5 minutes.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Instant Confirmation</h3>
                <p className="text-slate-600 text-sm">
                  We assign your cleaner and send you confirmation details immediately.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Perfect Clean</h3>
                <p className="text-slate-600 text-sm">
                  Your cleaner arrives at the scheduled time with all supplies. Professional clean every time.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Easy Rebook</h3>
                <p className="text-slate-600 text-sm">
                  Ready to book again? Rebook in one click with your preferred cleaner.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Ready to experience the difference?
          </h3>
          <Link to="/book/postcode">
            <Button size="lg">Book Your First Clean</Button>
          </Link>
        </section>
      </div>
    </main>
  );
}
