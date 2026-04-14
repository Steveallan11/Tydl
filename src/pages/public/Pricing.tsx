import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export function Pricing() {
  return (
    <main className="bg-white">
      {/* Header - Premium */}
      <section className="bg-gradient-to-br from-brand-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">Pricing That's Clear</h1>
          <p className="text-xl text-blue-100">
            No hidden fees. No surprises. Just honest pricing.
          </p>
        </div>
      </section>

      {/* Base Pricing */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Regular Clean Pricing</h2>
            <p className="text-lg text-slate-600">Price depends on your home size. Not on our mood.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
            {[
              { size: 'Studio', beds: '—', price: '60' },
              { size: '1 Bedroom', beds: '1 bed', price: '75' },
              { size: '2 Bedrooms', beds: '2 beds', price: '90' },
              { size: '3 Bedrooms', beds: '3 beds', price: '105' },
              { size: '4+ Bedrooms', beds: '4+ beds', price: '120' }
            ].map((item) => (
              <div key={item.size} className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-xl p-6 hover:border-brand-500 hover:shadow-lg transition-all text-center">
                <div className="text-sm text-slate-600 mb-2 font-medium uppercase tracking-wide">{item.beds}</div>
                <div className="text-3xl font-bold font-mono text-brand-600 mb-2">£{item.price}</div>
                <div className="text-xs text-slate-500">{item.size}</div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-accent-50 to-orange-50 border border-accent-200 rounded-lg p-8 text-center">
            <div className="text-4xl mb-3">💡</div>
            <p className="text-slate-900 font-semibold mb-2">Pro Tip</p>
            <p className="text-slate-600">
              Price stays the same whether you book once, weekly, or monthly. No surprises ever.
            </p>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Customize Your Clean</h2>
            <p className="text-lg text-slate-600">Pick extras. Price updates instantly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Oven cleaning', price: '25', icon: '🔥' },
              { name: 'Fridge cleaning', price: '20', icon: '❄️' },
              { name: 'Interior windows', price: '30', icon: '🪟' },
              { name: 'Bed change', price: '15', icon: '🛏️' },
              { name: 'Products pack', price: '10', icon: '🧴' },
              { name: 'Full cleaning kit', price: '50', icon: '🛠️' }
            ].map((addon) => (
              <div key={addon.name} className="bg-white border border-slate-200 rounded-lg p-6 hover:border-brand-500 hover:shadow-md transition-all">
                <div className="text-4xl mb-3">{addon.icon}</div>
                <div className="flex justify-between items-center">
                  <div className="font-bold text-slate-900">{addon.name}</div>
                  <div className="text-brand-600 font-mono font-semibold">+£{addon.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequency */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How Often?</h2>
            <p className="text-lg text-slate-600">Same price every time, no matter the frequency</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: 'One Time',
                freq: '⚡ Single Clean',
                desc: 'Whenever you want, whenever you\'re ready'
              },
              {
                name: 'Weekly',
                freq: '📅 Every Week',
                desc: 'Same cleaner every time. Same day if you want.'
              },
              {
                name: 'Biweekly',
                freq: '📅 Every 2 Weeks',
                desc: 'Perfect for keeping up between deep cleans'
              },
              {
                name: 'Monthly',
                freq: '📅 Once a Month',
                desc: 'Works for anyone. Total flexibility.'
              }
            ].map((freq) => (
              <div key={freq.name} className="border-2 border-slate-200 rounded-xl p-8 hover:border-brand-500 transition-colors">
                <div className="text-3xl mb-3">{freq.freq.split(' ')[0]}</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{freq.name}</h3>
                <p className="text-slate-600">{freq.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-brand-50 rounded-lg p-8 text-center">
            <p className="text-slate-900 font-semibold mb-2">Same Price. Every Time.</p>
            <p className="text-slate-600">
              Whether you book once, weekly, or monthly—the price stays fixed. No volume discounts, no surprises.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">How Much Will Your Clean Cost?</h2>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { label: '2 Bed Regular', addon: 'Oven', total: '£115' },
                { label: '3 Bed Deep Clean', addon: 'Windows', total: '£135' },
                { label: '1 Bed One-Off', addon: 'Products', total: '£85' },
                { label: '4 Bed + Kit', addon: 'Full Kit', total: '£170' }
              ].map((ex, i) => (
                <div key={i} className={`p-6 text-center ${i !== 0 ? 'border-l border-slate-200' : ''} ${i >= 2 ? 'border-t border-slate-200' : ''}`}>
                  <div className="text-sm text-slate-600 mb-2">{ex.label}</div>
                  <div className="text-xs text-accent-600 font-medium mb-3">+ {ex.addon}</div>
                  <div className="text-2xl font-bold font-mono text-brand-600">{ex.total}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-slate-600 mt-8 text-sm">
            These are just examples. Your price depends on your property size and add-ons.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Pricing Questions?</h2>

          <div className="space-y-4">
            {[
              {
                q: 'Is there a booking fee?',
                a: 'Nope. The price you see is the price you pay. No hidden charges.'
              },
              {
                q: 'What if my home is between sizes?',
                a: 'We\'ll chat with you during booking. We price fairly based on your actual needs, not a formula.'
              },
              {
                q: 'Can I change my add-ons?',
                a: 'Yes. Up to 24 hours before your cleaning. Change your booking, and the price updates instantly.'
              },
              {
                q: 'Do you charge a cancellation fee?',
                a: 'Nope. Cancel anytime. You\'re not locked into anything.'
              }
            ].map((item, i) => (
              <details key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-6 cursor-pointer hover:border-brand-500 transition-colors group">
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

      {/* CTA */}
      <section className="bg-brand-50 py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            See Your Exact Price
          </h2>
          <p className="text-lg text-slate-600 mb-10">
            Pick your property size, add-ons, and frequency. We'll show you the exact cost before you book.
          </p>
          <Link to="/book/postcode">
            <Button size="lg">Calculate Your Price</Button>
          </Link>
          <p className="text-sm text-slate-500 mt-6">No credit card required. 90 seconds to book.</p>
        </div>
      </section>
    </main>
  );
}
