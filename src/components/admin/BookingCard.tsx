import { Booking } from '../../types/booking';
import { Button } from '../common/Button';
import { SERVICES, PROPERTY_SIZES } from '../../lib/constants';

interface BookingCardProps {
  booking: Booking;
  onAssign: () => void;
}

export function BookingCard({ booking, onAssign }: BookingCardProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800',
      confirmed: 'bg-blue-100 text-blue-800',
      assigned: 'bg-purple-100 text-purple-800',
      'in-progress': 'bg-green-100 text-green-800',
      completed: 'bg-slate-100 text-slate-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-slate-100 text-slate-800';
  };

  const service = booking.serviceType ? SERVICES[booking.serviceType] : undefined;
  const propSize = booking.propertySize ? PROPERTY_SIZES[booking.propertySize] : undefined;

  return (
    <div className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-900">
            {booking.firstName} {booking.lastName}
          </h3>
          <p className="text-sm text-slate-500">{booking.email}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-brand-600 font-mono">
            £{Math.round(booking.totalPrice)}
          </div>
          <span className={`inline-block text-xs font-semibold px-2 py-1 rounded mt-1 ${getStatusColor(booking.status)}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Service Details */}
      <div className="bg-slate-50 rounded-lg p-3 mb-4 space-y-2">
        <div className="flex items-start gap-2">
          <span className="font-semibold text-slate-700 w-24">Service:</span>
          <div className="flex-1">
            <p className="text-slate-900 font-medium">{service?.label || booking.serviceType}</p>
            <p className="text-xs text-slate-600">{service?.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-slate-200 pt-2">
          <span className="font-semibold text-slate-700 w-24">Property:</span>
          <span className="text-slate-900">{propSize || booking.propertySize}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 w-24">Frequency:</span>
          <span className="text-slate-900">{booking.frequency ? booking.frequency.charAt(0).toUpperCase() + booking.frequency.slice(1) : 'Once'}</span>
        </div>
        {booking.addOns && booking.addOns.length > 0 && (
          <div className="flex items-start gap-2">
            <span className="font-semibold text-slate-700 w-24">Add-ons:</span>
            <div className="flex flex-wrap gap-1">
              {(booking.addOns as any[]).map((addon) => (
                <span key={addon} className="inline-block bg-brand-100 text-brand-700 text-xs px-2 py-1 rounded">
                  {addon}
                </span>
              ))}
            </div>
          </div>
        )}
        {booking.supplies && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 w-24">Supplies:</span>
            <span className="text-slate-900">{booking.supplies === 'platform' ? '✓ Platform' : '✓ Customer'}</span>
          </div>
        )}
        {booking.needsBeforeAfterImages && (
          <div className="flex items-center gap-2 text-blue-700 bg-blue-50 p-2 rounded">
            <span>📸</span>
            <span className="text-sm font-medium">Before/after photos requested</span>
          </div>
        )}
      </div>

      {/* Date & Time */}
      <div className="border-t border-slate-200 pt-3 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-600">Scheduled for</p>
            <p className="font-semibold text-slate-900">
              {booking.scheduledDate}
            </p>
            <p className="font-semibold text-slate-900">
              {booking.scheduledTime}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600">Customer phone</p>
            <p className="font-semibold text-slate-900">{booking.phone || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Customer Notes */}
      {booking.customerNotes && (
        <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-4">
          <p className="text-xs font-semibold text-blue-900">Notes:</p>
          <p className="text-sm text-blue-800">{booking.customerNotes}</p>
        </div>
      )}

      {/* Action Button */}
      {booking.status === 'pending' && (
        <Button
          className="w-full"
          onClick={onAssign}
        >
          👤 Assign Cleaner
        </Button>
      )}
    </div>
  );
}
