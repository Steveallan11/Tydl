import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Public pages
import { Home } from './pages/public/Home';
import { Services } from './pages/public/Services';
import { Pricing } from './pages/public/Pricing';
import { About } from './pages/public/About';

// Booking flow
import { Postcode } from './pages/booking/Postcode';
import { ServiceSelection } from './pages/booking/ServiceSelection';
import { PropertyDetails } from './pages/booking/PropertyDetails';
import { SuppliesOption } from './pages/booking/SuppliesOption';
import { FrequencyScheduling } from './pages/booking/FrequencyScheduling';
import { AddOns } from './pages/booking/AddOns';
import { PriceSummary } from './pages/booking/PriceSummary';
import { CheckoutDetails } from './pages/booking/CheckoutDetails';
import { ConfirmationPending } from './pages/booking/ConfirmationPending';

// Customer pages
import { CustomerDashboard } from './pages/customer/Dashboard';
import { MyBookings } from './pages/customer/MyBookings';
import { Account } from './pages/customer/Account';

// Admin pages
import { AdminDashboard } from './pages/admin/Dashboard';

// Cleaner pages
import { CleanerOnboarding } from './pages/cleaner/Onboarding';
import { JobsPortal } from './pages/cleaner/JobsPortal';

export function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Header />
        <main className="flex-1">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />

            {/* Booking flow routes */}
            <Route path="/book/postcode" element={<Postcode />} />
            <Route path="/book/service" element={<ServiceSelection />} />
            <Route path="/book/property" element={<PropertyDetails />} />
            <Route path="/book/supplies" element={<SuppliesOption />} />
            <Route path="/book/frequency" element={<FrequencyScheduling />} />
            <Route path="/book/addons" element={<AddOns />} />
            <Route path="/book/summary" element={<PriceSummary />} />
            <Route path="/book/checkout" element={<CheckoutDetails />} />
            <Route path="/book/confirmation" element={<ConfirmationPending />} />

            {/* Customer routes */}
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/bookings" element={<MyBookings />} />
            <Route path="/customer/account" element={<Account />} />

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Cleaner routes */}
            <Route path="/cleaner/onboarding" element={<CleanerOnboarding />} />
            <Route path="/cleaner/jobs" element={<JobsPortal />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
