import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { DebugPanel } from '../../components/common/DebugPanel';
import { useAdmin } from '../../context/AdminContext';

export function BookingDetail() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { bookings, cleaners, assignCleaner } = useAdmin();

  const booking = bookings.find(b => b.id === bookingId);
  const assignedCleaner = booking?.assignedCleanerId ? cleaners.find(c => c.id === booking.assignedCleanerId) : null;
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedCleanerId, setSelectedCleanerId] = useState(booking?.assignedCleanerId || '');

  const verifiedCleaners = cleaners.filter(c => c.verificationStatus === 'verified');

  const handleAssignCleaner = async () => {
    if (!selectedCleanerId || !booking) return;

    setIsAssigning(true);
    try {
      console.log('[BookingDetail] Assigning cleaner', selectedCleanerId, 'to booking', booking.id);
      await assignCleaner(booking.id, selectedCleanerId);
      alert('✓ Cleaner assigned successfully!');
    } catch (error) {
      console.error('Error assigning cleaner:', error);
      alert('Error assigning cleaner. Please try again.');
    } finally {
      setIsAssigning(false);
    }
  };

  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <DebugPanel />
        <Card>
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">Booking not found</p>
            <Button
              variant="outline"
              onClick={() => navigate('/admin/board')}
              className="mt-4"
            >
              Back to Board
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <>
      <DebugPanel />
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Navigation */}
        <div className="mb-8 pb-4 border-b border-slate-200 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/board')}
            className="mb-0"
          >
            ← Back to Board
          </Button>
          <p className="text-sm text-slate-500">Booking ID: {booking.id.substring(0, 8)}...</p>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {booking.firstName} {booking.lastName}
              </h1>
              <p className="text-slate-600">{booking.email}</p>
            </div>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(booking.status)}`}>
              {booking.status?.toUpperCase() || 'PENDING'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Booking Details */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-bold text-slate-900 mb-6">Service Details</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Service Type</p>
                  <p className="text-lg font-semibold text-slate-900 capitalize">
                    {booking.serviceType?.replace('-', ' ')}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 mb-1">Property Size</p>
                  <p className="text-lg font-semibold text-slate-900 capitalize">
                    {booking.propertySize?.replace('-', ' ')}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 mb-1">Frequency</p>
                  <p className="text-lg font-semibold text-slate-900 capitalize">
                    {booking.frequency || 'Once'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 mb-1">Supplies</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {booking.supplies === 'platform' ? '✓ Platform Provides' : '✓ Customer Provides'}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-slate-900 mb-6">Scheduling</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Scheduled Date</p>
                  <p className="text-lg font-semibold text-slate-900">{booking.scheduledDate}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 mb-1">Scheduled Time</p>
                  <p className="text-lg font-semibold text-slate-900">{booking.scheduledTime}</p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-slate-900 mb-6">Customer Information</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Name</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {booking.firstName} {booking.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 mb-1">Email</p>
                  <p className="font-mono text-slate-900">{booking.email}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 mb-1">Phone</p>
                  <p className="font-mono text-slate-900">{booking.phone}</p>
                </div>
              </div>
            </Card>

            {booking.customerNotes && (
              <Card className="border-blue-200 bg-blue-50">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Customer Notes</h3>
                <p className="text-slate-700 italic">"{booking.customerNotes}"</p>
              </Card>
            )}
          </div>

          {/* Right Column - Pricing & Assignment */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-bold text-slate-900 mb-6">Pricing & Payment</h3>

              <div className="space-y-4">
                <div className="flex justify-between pb-4 border-b border-slate-200">
                  <span className="text-slate-600">Total Price</span>
                  <span className="text-2xl font-bold text-slate-900">£{booking.totalPrice.toFixed(2)}</span>
                </div>

                {booking.addOns && booking.addOns.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-600 mb-3">Add-ons</p>
                    <div className="flex flex-wrap gap-2">
                      {booking.addOns.map((addon: string) => (
                        <span key={addon} className="inline-block bg-brand-100 text-brand-900 text-xs px-3 py-1 rounded-full font-medium">
                          + {addon}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {booking.needsBeforeAfterImages && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <p className="text-sm text-blue-700">📸 Before & After Photos Requested</p>
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-slate-900 mb-6">Assign Cleaner</h3>

              <div className="space-y-4">
                {assignedCleaner ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-700 font-medium mb-2">✓ Assigned to:</p>
                    <p className="text-lg font-bold text-green-900">
                      {assignedCleaner.firstName} {assignedCleaner.lastName}
                    </p>
                    <p className="text-sm text-green-700 mt-1">{assignedCleaner.email}</p>
                  </div>
                ) : (
                  <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded">
                    ⚠️ No cleaner assigned yet
                  </p>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Verified Cleaner
                  </label>
                  <select
                    value={selectedCleanerId}
                    onChange={(e) => setSelectedCleanerId(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none"
                  >
                    <option value="">-- Choose a cleaner --</option>
                    {verifiedCleaners.map(cleaner => (
                      <option key={cleaner.id} value={cleaner.id}>
                        {cleaner.firstName} {cleaner.lastName} - {cleaner.postcode}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={handleAssignCleaner}
                  disabled={!selectedCleanerId || isAssigning}
                  className="w-full"
                >
                  {isAssigning ? '⏳ Assigning...' : '✓ Assign Cleaner'}
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Booking Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Booking ID</span>
                  <span className="font-mono text-slate-900">{booking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Created</span>
                  <span className="text-slate-900">{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status</span>
                  <span className="font-medium capitalize">{booking.status}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
