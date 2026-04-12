import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              NC
            </div>
            <span className="font-bold text-slate-900 hidden sm:inline">
              Northampton Cleaning
            </span>
          </Link>

          <nav className="hidden md:flex gap-8">
            <Link
              to="/"
              className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
            >
              Services
            </Link>
            <Link
              to="/pricing"
              className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
            >
              About
            </Link>
          </nav>

          <Link
            to="/book/postcode"
            className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}
