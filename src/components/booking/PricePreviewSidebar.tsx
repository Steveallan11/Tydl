import { useBooking } from '../../context/BookingContext';
import { Card } from '../common/Card';

export function PricePreviewSidebar() {
  const { formData, pricing } = useBooking();

  return (
    <Card className="sticky top-20 h-fit">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Price Summary</h2>

      <div className="space-y-4 text-sm">
        {/* Base Service Price */}
        {formData.serviceType && (
          <div className="flex justify-between items-start">
            <span className="text-slate-600">
              {formData.serviceType}
              {formData.frequency && ` (${formData.frequency})`}
            </span>
            <span className="font-semibold text-slate-900">£{pricing.basePrice.toFixed(2)}</span>
          </div>
        )}

        {/* Supplies Option Impact */}
        {formData.supplies && (
          <div className="flex justify-between items-start text-xs">
            <span className="text-slate-600">
              {formData.supplies === 'platform' ? 'Platform provides supplies' : 'Customer provides supplies'}
            </span>
            {formData.supplies === 'customer' && (
              <span className="font-semibold text-green-600">-£5.00</span>
            )}
          </div>
        )}

        {/* Add-ons */}
        {pricing.details.addOns.length > 0 && (
          <>
            <div className="border-t border-slate-200 pt-3">
              {pricing.details.addOns.map((addOn) => (
                <div key={addOn.name} className="flex justify-between items-start mb-2">
                  <span className="text-slate-600">{addOn.name}</span>
                  <span className="font-semibold text-slate-900">+£{addOn.customerPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Property Size Impact */}
        {formData.propertySize && (
          <div className="text-xs text-slate-500 pt-2">
            Property: {formData.propertySize}
          </div>
        )}

        {/* Total */}
        <div className="border-t border-slate-200 pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-900">Total:</span>
            <span className="text-2xl font-bold text-brand-600">£{pricing.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Frequency Multiplier Info */}
        {formData.frequency && formData.frequency !== 'once' && (
          <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-800 mt-4">
            <p className="font-medium mb-1">Price recalculates</p>
            <p>Your {formData.frequency} service price adapts to keep it fair.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
