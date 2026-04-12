import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export function Pricing() {
  return (
    <main className="bg-white">
      {/* Header */}
      <section className="bg-brand-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Transparent Pricing</h1>
          <p className="text-lg text-slate-600">
            No hidden fees. No surprises. Just honest pricing.
          </p>
        </div>
      </section>

      {/* Base Pricing */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Regular Clean Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { size: 'Studio', price: '60' },
              { size: '1 Bedroom', price: '75' },
              { size: '2 Bedrooms', price: '90' },
              { size: '3 Bedrooms', price: '105' },
              { size: '4+ Bedrooms', price: '120' }
            ].map((item) => (
              <div key={item.size} className="border border-slate-200 rounded-lg p-6 hover:border-brand-500 transition-colors">
                <div className="text-slate-600 text-sm mb-2">{item.size}</div>
                <div className="text-4xl font-bold font-mono text-brand-600">£{item.price}</div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
            <p className="text-sm text-blue-900">
              💡 <strong>Pro tip:</strong> Prices stay the same whether you book once, weekly, or monthly. No surprises.
            </p>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Add-ons</h2>
          <p className="text-slate-600 mb-6">Make your clean even better. Pick and mix.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Oven cleaning', price: '25' },
              { name: 'Fridge cleaning', price: '20' },
              { name: 'Interior windows', price: '30' },
              { name: 'Bed change', price: '15' },
              { name: 'Products pack', price: '10' },
              { name: 'Full cleaning kit', price: '50' }
            ].map((addon) => (
              <div key={addon.name} className="bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-center">
                <span className="text-slate-900 font-medium">{addon.name}</span>
                <span className="text-brand-600 font-mono font-semibold">+£{addon.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequency */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">How Often?</h2>
          <div className="space-y-4 mb-12">
            {[
              { name: 'One-time booking', desc: 'Single clean whenever you want' },
              { name: 'Weekly', desc: 'Same day every week • Same cleaner • Easy reschedule' },
              { name: 'Biweekly', desc: 'Every 2 weeks • Great for maintenance' },
              { name: 'Monthly', desc: 'Once a month • Works for anyone' }
            ].map((freq) => (
              <div key={freq.name} className="border border-slate-200 rounded-lg p-6">
                <div className="font-bold text-slate-900 mb-1">{freq.name}</div>
                <div className="text-slate-600 text-sm">{freq.desc}</div>
              </div>
            ))}
          </div>

          <div className="bg-brand-50 rounded-lg p-8 text-center">
            <p className="text-slate-600 mb-4">Same fixed price. Same high quality. Every time.</p>
            <p className="text-sm text-slate-500">No discounts for frequent bookings. We treat every clean with the same care.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-50 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            See Your Exact Price
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Tell us your property size and preferred add-ons. We'll show you the exact price before you book.
          </p>
          <Link to="/book/postcode">
            <Button size="lg">Start Booking</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
