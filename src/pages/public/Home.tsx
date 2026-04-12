import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SERVICES } from '../../lib/constants';

export function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Book trusted local cleaning in minutes
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Clear pricing. Vetted cleaners. Easy rebooking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/book/postcode">
                <Button size="lg">Book a Clean Now</Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(SERVICES).map(([key, service]) => (
              <Card key={key}>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {service.label}
                </h3>
                <p className="text-slate-600 text-sm mb-4">{service.description}</p>
                <Link to="/book/postcode">
                  <Button variant="secondary" size="sm" className="w-full">
                    Book Now
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Why Choose Northampton Cleaning?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <div className="text-3xl mb-3">✓</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Vetted Cleaners</h3>
              <p className="text-slate-600 text-sm">
                All our cleaners are carefully vetted and verified for your peace of mind.
              </p>
            </Card>
            <Card>
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Clear Pricing</h3>
              <p className="text-slate-600 text-sm">
                No surprises. Transparent, fixed pricing based on your property size.
              </p>
            </Card>
            <Card>
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Easy Rebooking</h3>
              <p className="text-slate-600 text-sm">
                Book your next clean in just one click. Regular service made simple.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to get your home clean?
          </h2>
          <p className="text-slate-600 mb-8">
            Start your first booking today. It takes just 5 minutes.
          </p>
          <Link to="/book/postcode">
            <Button size="lg">Start Booking</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
