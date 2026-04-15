import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { PricingManagementModal, PricingConfig, AddOnConfig } from '../../components/admin/PricingManagementModal';
import { useAuth } from '../../context/AuthContext';

export function AdminSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [pricingRules, setPricingRules] = useState<PricingConfig[]>([]);
  const [addOns, setAddOns] = useState<AddOnConfig[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    }
  }, [user]);

  // Load pricing from localStorage (in real app, this would be from Supabase)
  useEffect(() => {
    const savedPricing = localStorage.getItem('admin_pricing_rules');
    const savedAddOns = localStorage.getItem('admin_add_ons');

    if (savedPricing) {
      setPricingRules(JSON.parse(savedPricing));
    }
    if (savedAddOns) {
      setAddOns(JSON.parse(savedAddOns));
    }
  }, []);

  const handleSavePricing = async (pricing: PricingConfig[], addOns: AddOnConfig[]) => {
    try {
      setIsSaving(true);
      setError('');
      setSuccessMessage('');

      // Save to localStorage (in real app, this would be a Supabase update)
      localStorage.setItem('admin_pricing_rules', JSON.stringify(pricing));
      localStorage.setItem('admin_add_ons', JSON.stringify(addOns));

      setPricingRules(pricing);
      setAddOns(addOns);
      setShowPricingModal(false);
      setSuccessMessage('Pricing updated successfully! Changes will apply to new bookings.');

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to save pricing');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Settings</h1>
        <p className="text-slate-600">Manage pricing, services, and platform configuration</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Pricing Management Section */}
      <Card className="mb-12">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Pricing & Services</h2>
            <p className="text-slate-600">
              Configure customer prices, cleaner payouts, and service add-ons
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Service Pricing Summary */}
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Service Rules</h3>
            <p className="text-slate-600 text-sm mb-4">
              {pricingRules.length} pricing rules configured
            </p>
            {pricingRules.length > 0 && (
              <div className="space-y-2 text-sm text-slate-600">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            )}
          </div>

          {/* Add-Ons Summary */}
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Add-Ons</h3>
            <p className="text-slate-600 text-sm mb-4">
              {addOns.length} add-on options configured
            </p>
            {addOns.length > 0 && (
              <div className="space-y-1 text-sm text-slate-600">
                {addOns.slice(0, 3).map((addon) => (
                  <p key={addon.id}>• {addon.name}</p>
                ))}
                {addOns.length > 3 && <p>• ... and {addOns.length - 3} more</p>}
              </div>
            )}
          </div>
        </div>

        <Button onClick={() => setShowPricingModal(true)}>
          ⚙️ Manage Pricing & Services
        </Button>
      </Card>

      {/* Other Settings Sections */}
      <Card className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Platform Settings</h2>

        <div className="space-y-6">
          <div className="border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">Booking Notifications</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Configure email and SMS notifications for bookings and assignments
                </p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">Payout Schedule</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Set cleaner payout schedule and frequency
                </p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">Service Areas</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Manage postcodes and geographic service areas
                </p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Pricing Modal */}
      {showPricingModal && (
        <PricingManagementModal
          onClose={() => setShowPricingModal(false)}
          onSave={handleSavePricing}
          initialPricing={pricingRules}
          initialAddOns={addOns}
        />
      )}
    </div>
  );
}
