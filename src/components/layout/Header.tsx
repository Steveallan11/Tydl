import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center group">
            <img
              src="/logo.png"
              alt="Tydl"
              className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          <nav className="hidden md:flex gap-8">
            <Link
              to="/services"
              className="text-slate-600 hover:text-brand-600 text-sm font-semibold transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-600 hover:after:w-full after:transition-all after:duration-300"
            >
              Services
            </Link>
            <Link
              to="/pricing"
              className="text-slate-600 hover:text-brand-600 text-sm font-semibold transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-600 hover:after:w-full after:transition-all after:duration-300"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="text-slate-600 hover:text-brand-600 text-sm font-semibold transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-600 hover:after:w-full after:transition-all after:duration-300"
            >
              About
            </Link>
          </nav>

          <Link
            to="/book/postcode"
            className="group relative overflow-hidden bg-gradient-to-r from-brand-600 to-brand-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">Book Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-700 to-brand-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>
      </div>
    </header>
  );
}
