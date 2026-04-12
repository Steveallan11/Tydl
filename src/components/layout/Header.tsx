import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-white sticky top-0 z-40 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              T
            </div>
            <span className="font-bold text-slate-900 text-lg hidden sm:inline">
              Tydl
            </span>
          </Link>

          <nav className="hidden md:flex gap-8">
            <Link
              to="/services"
              className="text-slate-600 hover:text-brand-600 text-sm font-medium transition-colors"
            >
              Services
            </Link>
            <Link
              to="/pricing"
              className="text-slate-600 hover:text-brand-600 text-sm font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="text-slate-600 hover:text-brand-600 text-sm font-medium transition-colors"
            >
              About
            </Link>
          </nav>

          <Link
            to="/book/postcode"
            className="bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors shadow-sm"
          >
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}
