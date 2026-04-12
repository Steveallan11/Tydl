import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SERVICES } from '../../lib/constants';

export function Services() {
  return (
    <main className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Our Cleaning Services</h1>
        <p className="text-xl text-slate-600 mb-12">
          Choose the perfect cleaning solution for your home. All services include premium supplies and professional cleaners.
        </p>

        <div className="space-y-8">
          {Object.entries(SERVICES).map(([key, service]) => (
            <Card key={key}>
              <div className="flex justify-between items-start gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    {service.label}
                  </h2>
                  <p className="text-slate-600 mb-4 text-lg">{service.description}</p>
                  <ul className="space-y-2 text-slate-600 mb-6">
                    <li>✓ Professional cleaners</li>
                    <li>✓ Vetted and verified</li>
                    <li>✓ Transparent pricing</li>
                    <li>✓ Easy rescheduling</li>
                  </ul>
                </div>
                <Link to="/book/postcode">
                  <Button>Book Now</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Add-ons Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Available Add-ons</h2>
          <p className="text-slate-600 mb-6">
            Customize your clean with our optional add-ons:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-slate-700">• Oven cleaning</div>
            <div className="text-slate-700">• Fridge cleaning</div>
            <div className="text-slate-700">• Interior windows</div>
            <div className="text-slate-700">• Bed change</div>
            <div className="text-slate-700">• Products pack</div>
            <div className="text-slate-700">• Full cleaning kit</div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 bg-brand-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Ready to book your clean?
          </h3>
          <Link to="/book/postcode">
            <Button size="lg">Start Booking</Button>
          </Link>
        </section>
      </div>
    </main>
  );
}
