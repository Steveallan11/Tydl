import { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export interface PricingConfig {
  serviceType: string;
  propertySize: string;
  frequency: string;
  customerPrice: number;
  cleanerPayout: number;
}

export interface AddOnConfig {
  id: string;
  name: string;
  description: string;
  customerPrice: number;
  cleanerPayout: number;
}

interface PricingManagementModalProps {
  onClose: () => void;
  onSave: (pricing: PricingConfig[], addOns: AddOnConfig[]) => Promise<void>;
  initialPricing?: PricingConfig[];
  initialAddOns?: AddOnConfig[];
}

export function PricingManagementModal({
  onClose,
  onSave,
  initialPricing = [],
  initialAddOns = [],
}: PricingManagementModalProps) {
  const [activeTab, setActiveTab] = useState<'services' | 'addons'>('services');
  const [pricingRules, setPricingRules] = useState<PricingConfig[]>(initialPricing);
  const [addOns, setAddOns] = useState<AddOnConfig[]>(initialAddOns);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const serviceTypes = ['regular-clean', 'one-off-clean', 'deep-clean', 'end-of-tenancy'];
  const propertySizes = ['studio', 'one-bed', 'two-bed', 'three-bed', 'four-plus'];
  const frequencies = ['once', 'weekly', 'biweekly', 'monthly'];

  const handleAddPricingRule = () => {
    setPricingRules([
      ...pricingRules,
      {
        serviceType: serviceTypes[0],
        propertySize: propertySizes[0],
        frequency: frequencies[0],
        customerPrice: 0,
        cleanerPayout: 0,
      },
    ]);
  };

  const handleRemovePricingRule = (index: number) => {
    setPricingRules(pricingRules.filter((_, i) => i !== index));
  };

  const handleUpdatePricingRule = (index: number, field: keyof PricingConfig, value: any) => {
    const updated = [...pricingRules];
    updated[index] = { ...updated[index], [field]: value };
    setPricingRules(updated);
  };

  const handleAddAddOn = () => {
    setAddOns([
      ...addOns,
      {
        id: `addon-${Date.now()}`,
        name: '',
        description: '',
        customerPrice: 0,
        cleanerPayout: 0,
      },
    ]);
  };

  const handleRemoveAddOn = (index: number) => {
    setAddOns(addOns.filter((_, i) => i !== index));
  };

  const handleUpdateAddOn = (index: number, field: keyof AddOnConfig, value: any) => {
    const updated = [...addOns];
    updated[index] = { ...updated[index], [field]: value };
    setAddOns(updated);
  };

  const handleSave = async () => {
    try {
      setError('');
      setIsSaving(true);

      // Validate pricing rules
      if (pricingRules.some(p => p.customerPrice < 0 || p.cleanerPayout < 0)) {
        setError('Prices cannot be negative');
        return;
      }

      // Validate add-ons
      if (addOns.some(a => !a.name || a.customerPrice < 0 || a.cleanerPayout < 0)) {
        setError('Add-ons must have a name and valid prices');
        return;
      }

      await onSave(pricingRules, addOns);
    } catch (err: any) {
      setError(err.message || 'Failed to save pricing');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Pricing Management</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'services'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Service Pricing
          </button>
          <button
            onClick={() => setActiveTab('addons')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'addons'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Add-Ons
          </button>
        </div>

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Service Pricing Rules</h3>
              <Button onClick={handleAddPricingRule} variant="outline" size="sm">
                + Add Rule
              </Button>
            </div>

            {pricingRules.length === 0 ? (
              <div className="bg-slate-50 rounded-lg p-6 text-center">
                <p className="text-slate-600">No pricing rules defined. Click "Add Rule" to create one.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pricingRules.map((rule, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Service Type
                        </label>
                        <select
                          value={rule.serviceType}
                          onChange={(e) =>
                            handleUpdatePricingRule(idx, 'serviceType', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                        >
                          {serviceTypes.map((type) => (
                            <option key={type} value={type}>
                              {type.replace(/-/g, ' ')}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Property Size
                        </label>
                        <select
                          value={rule.propertySize}
                          onChange={(e) =>
                            handleUpdatePricingRule(idx, 'propertySize', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                        >
                          {propertySizes.map((size) => (
                            <option key={size} value={size}>
                              {size.replace(/-/g, ' ')}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Frequency
                        </label>
                        <select
                          value={rule.frequency}
                          onChange={(e) =>
                            handleUpdatePricingRule(idx, 'frequency', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                        >
                          {frequencies.map((freq) => (
                            <option key={freq} value={freq}>
                              {freq}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Customer Price (£)
                        </label>
                        <input
                          type="number"
                          value={rule.customerPrice}
                          onChange={(e) =>
                            handleUpdatePricingRule(idx, 'customerPrice', parseFloat(e.target.value))
                          }
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Cleaner Payout (£)
                        </label>
                        <input
                          type="number"
                          value={rule.cleanerPayout}
                          onChange={(e) =>
                            handleUpdatePricingRule(idx, 'cleanerPayout', parseFloat(e.target.value))
                          }
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleRemovePricingRule(idx)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add-Ons Tab */}
        {activeTab === 'addons' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Add-On Options</h3>
              <Button onClick={handleAddAddOn} variant="outline" size="sm">
                + Add Option
              </Button>
            </div>

            {addOns.length === 0 ? (
              <div className="bg-slate-50 rounded-lg p-6 text-center">
                <p className="text-slate-600">No add-ons defined. Click "Add Option" to create one.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {addOns.map((addon, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Add-On Name
                        </label>
                        <input
                          type="text"
                          value={addon.name}
                          onChange={(e) =>
                            handleUpdateAddOn(idx, 'name', e.target.value)
                          }
                          placeholder="e.g., Oven Cleaning"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          value={addon.description}
                          onChange={(e) =>
                            handleUpdateAddOn(idx, 'description', e.target.value)
                          }
                          placeholder="Brief description"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Customer Price (£)
                        </label>
                        <input
                          type="number"
                          value={addon.customerPrice}
                          onChange={(e) =>
                            handleUpdateAddOn(idx, 'customerPrice', parseFloat(e.target.value))
                          }
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Cleaner Payout (£)
                        </label>
                        <input
                          type="number"
                          value={addon.cleanerPayout}
                          onChange={(e) =>
                            handleUpdateAddOn(idx, 'cleanerPayout', parseFloat(e.target.value))
                          }
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleRemoveAddOn(idx)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-4 justify-end pt-6 border-t border-slate-200 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : '✓ Save Changes'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
