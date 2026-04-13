import { PricingBreakdown } from '../../lib/pricing';

interface PricingBreakdownProps {
  pricing: PricingBreakdown;
  compact?: boolean;
}

export function PricingBreakdownComponent({ pricing, compact = false }: PricingBreakdownProps) {
  const { basePrice, addOnsTotal, subtotal, totalPrice, details } = pricing;

  if (compact) {
    // Minimal version for embedding in pages
    return (
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="flex justify-between items-baseline gap-4">
          <div>
            <div className="text-sm text-slate-600 mb-1">Your price</div>
            <div className="text-3xl font-bold font-mono text-brand-600">
              £{Math.round(totalPrice)}
            </div>
          </div>
          <div className="text-right text-xs text-slate-500 space-y-1">
            {basePrice > 0 && <div>Base: £{basePrice}</div>}
            {addOnsTotal > 0 && <div>Add-ons: £{addOnsTotal}</div>}
          </div>
        </div>
      </div>
    );
  }

  // Full breakdown version for summary page
  return (
    <div className="bg-gradient-to-br from-brand-50 to-blue-50 rounded-lg p-8 border border-brand-200">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">Price Breakdown</h3>

      <div className="space-y-4 mb-6">
        {/* Base Service */}
        {basePrice > 0 && (
          <div className="flex justify-between items-center pb-4 border-b border-brand-100">
            <span className="text-slate-700">
              {details.baseService}
            </span>
            <span className="font-semibold font-mono text-slate-900">£{basePrice}</span>
          </div>
        )}

        {/* Add-ons */}
        {details.addOns.length > 0 && (
          <div className="space-y-2">
            {details.addOns.map((addon) => (
              <div key={addon.name} className="flex justify-between items-center text-slate-600">
                <span className="text-sm">{addon.name}</span>
                <span className="font-mono text-sm">+£{addon.price}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t-2 border-brand-200 pt-4 mb-4" />

      {/* Subtotal */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-slate-600">Subtotal</span>
        <span className="font-semibold font-mono text-slate-700">£{subtotal}</span>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center bg-white rounded-lg p-4 border border-brand-200">
        <span className="text-lg font-bold text-slate-900">Total Price</span>
        <span className="text-3xl font-bold font-mono text-brand-600">
          £{Math.round(totalPrice)}
        </span>
      </div>

      {/* Note */}
      <p className="text-xs text-slate-600 mt-4 text-center">
        This price is locked in. No hidden fees ever.
      </p>
    </div>
  );
}
