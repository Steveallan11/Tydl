import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                NC
              </div>
              <span className="font-bold text-white">Northampton Cleaning</span>
            </div>
            <p className="text-sm">
              Trusted local cleaning for busy households in Northamptonshire.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Customer</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/customer/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/customer/bookings" className="hover:text-white transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/customer/account" className="hover:text-white transition-colors">
                  Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: hello@northamptoncleaning.com</li>
              <li>Phone: 01604 123 456</li>
              <li>Available: Mon-Fri, 8am-6pm</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8">
          <div className="flex justify-between items-center text-sm">
            <p>&copy; 2024 Northampton Cleaning. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
