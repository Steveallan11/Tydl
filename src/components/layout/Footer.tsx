import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="group">
            <img
              src="/logo-white.png"
              alt="Tydl"
              className="h-24 w-auto object-contain mb-4 group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
            />
            <p className="text-sm text-slate-400 leading-relaxed">
              Fast, trusted cleaning for busy people in Northamptonshire.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-wide">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/services" className="text-slate-400 hover:text-brand-400 transition-colors duration-300 font-medium">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-slate-400 hover:text-brand-400 transition-colors duration-300 font-medium">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-brand-400 transition-colors duration-300 font-medium">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-wide">Account</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/customer/dashboard" className="text-slate-400 hover:text-brand-400 transition-colors duration-300 font-medium">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/customer/bookings" className="text-slate-400 hover:text-brand-400 transition-colors duration-300 font-medium">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/customer/account" className="text-slate-400 hover:text-brand-400 transition-colors duration-300 font-medium">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-wide">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="tel:+441604123456" className="text-slate-400 hover:text-brand-400 transition-colors duration-300 font-medium">
                  01604 123 456
                </a>
              </li>
              <li className="text-slate-400 text-xs">Mon–Fri, 8am–6pm</li>
              <li>
                <a href="mailto:hello@tydl.com" className="text-slate-400 hover:text-brand-400 transition-colors duration-300 font-medium break-all">
                  hello@tydl.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400 gap-4">
            <p className="font-medium">&copy; 2026 Tydl. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-brand-400 transition-colors duration-300 font-medium">
                Privacy
              </a>
              <a href="#" className="hover:text-brand-400 transition-colors duration-300 font-medium">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
