import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { Booking, BookingStatus } from '../../types/booking';

type ColumnStatus = 'pending' | 'assigned' | 'in-progress' | 'completed';

const COLUMNS: Record<ColumnStatus, { label: string; color: string; icon: string }> = {
  pending: { label: 'Pending', color: 'amber', icon: '⏳' },
  assigned: { label: 'Assigned', color: 'blue', icon: '📌' },
  'in-progress': { label: 'In Progress', color: 'purple', icon: '🔄' },
  completed: { label: 'Completed', color: 'green', icon: '✓' },
};

const BookingCard = ({
  booking,
  onAssign,
}: {
  booking: Booking;
  onAssign: (bookingId: string) => void;
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <div className="mb-3">
        <p className="font-semibold text-slate-900 text-sm">
          {booking.firstName} {booking.lastName}
        </p>
        <p className="text-xs text-slate-500">{booking.email}</p>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div>
          <span className="text-slate-600">Service:</span>
          <span className="ml-2 font-medium text-slate-900">{booking.serviceType}</span>
        </div>
        <div>
          <span className="text-slate-600">Date:</span>
          <span className="ml-2 font-medium text-slate-900">{booking.scheduledDate}</span>
        </div>
        <div>
          <span className="text-slate-600">Time:</span>
          <span className="ml-2 font-medium text-slate-900">{booking.scheduledTime}</span>
        </div>
        <div>
          <span className="text-slate-600">Price:</span>
          <span className="ml-2 font-mono font-bold text-brand-600">
            £{Math.round(booking.totalPrice)}
          </span>
        </div>
      </div>

      {booking.status === 'pending' && (
        <Button
          size="sm"
          onClick={() => onAssign(booking.id)}
          className="w-full"
        >
          Assign Cleaner
        </Button>
      )}

      <p className="text-xs text-slate-500 mt-2">ID: {booking.id}</p>
    </div>
  );
};

const KanbanColumn = ({
  status,
  bookings,
  onAssign,
}: {
  status: ColumnStatus;
  bookings: Booking[];
  onAssign: (bookingId: string) => void;
}) => {
  const config = COLUMNS[status];
  const colorMap: Record<string, string> = {
    amber: 'bg-amber-50 border-amber-200',
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    green: 'bg-green-50 border-green-200',
  };

  return (
    <div className={`${colorMap[config.color]} border rounded-lg p-4 h-full`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{config.icon}</span>
        <h3 className="text-lg font-bold text-slate-900">{config.label}</h3>
        <span className="ml-auto bg-slate-200 text-slate-700 text-sm font-semibold px-2 py-1 rounded">
          {bookings.length}
        </span>
      </div>

      <div className="space-y-3">
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 text-sm">No bookings</p>
          </div>
        ) : (
          bookings.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onAssign={onAssign}
            />
          ))
        )}
      </div>
    </div>
  );
};

export function BookingBoard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { bookings, assignCleaner, cleaners } = useAdmin();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [selectedCleaner, setSelectedCleaner] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Organize bookings by status
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const assignedBookings = bookings.filter(b => b.status === 'assigned');
  const inProgressBookings = bookings.filter(b => b.status === 'in-progress');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  const handleAssignCleaner = (bookingId: string) => {
    setSelectedBooking(bookingId);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleConfirmAssignment = async () => {
    if (!selectedBooking || !selectedCleaner) {
      setErrorMessage('Please select both booking and cleaner');
      return;
    }

    try {
      setIsAssigning(true);
      setErrorMessage(null);

      // Call assignCleaner which triggers notifications
      const success = await assignCleaner(selectedBooking, selectedCleaner);

      if (success) {
        // Get cleaner name for success message
        const cleaner = cleaners.find(c => c.id === selectedCleaner);
        const cleanerName = cleaner ? `${cleaner.firstName} ${cleaner.lastName}` : 'Cleaner';

        setSuccessMessage(`✓ Assigned to ${cleanerName}! Notifications sent.`);

        // Clear form and show success for 2 seconds
        setSelectedBooking(null);
        setSelectedCleaner(null);

        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setErrorMessage('Failed to assign cleaner');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Error assigning cleaner');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Booking Board</h1>
            <p className="text-lg text-slate-600">Manage booking workflow</p>
          </div>
          <div className="flex gap-3">
            <div className="text-right">
              <p className="text-sm text-slate-600 mb-2">Logged in as <strong>{user?.email}</strong></p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  navigate('/admin/login');
                }}
              >
                Logout
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/admin/dashboard')}
            >
              ← Dashboard
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <KanbanColumn
            status="pending"
            bookings={pendingBookings}
            onAssign={handleAssignCleaner}
          />
          <KanbanColumn
            status="assigned"
            bookings={assignedBookings}
            onAssign={handleAssignCleaner}
          />
          <KanbanColumn
            status="in-progress"
            bookings={inProgressBookings}
            onAssign={handleAssignCleaner}
          />
          <KanbanColumn
            status="completed"
            bookings={completedBookings}
            onAssign={handleAssignCleaner}
          />
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="max-w-md mx-auto mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Assignment Modal / Form */}
        {selectedBooking && (
          <Card className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Assign Cleaner</h2>

            <div className="mb-6 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600 mb-1">Booking ID</p>
              <p className="font-mono text-slate-900">{selectedBooking}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Select Cleaner
              </label>
              <div className="space-y-2">
                {cleaners.length === 0 ? (
                  <p className="text-slate-600 text-sm">No cleaners available</p>
                ) : (
                  cleaners.map(cleaner => (
                    <label
                      key={cleaner.id}
                      className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedCleaner === cleaner.id
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-slate-200 hover:border-brand-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="cleaner"
                        value={cleaner.id}
                        checked={selectedCleaner === cleaner.id}
                        onChange={(e) => setSelectedCleaner(e.target.value)}
                        disabled={isAssigning}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">
                          {cleaner.firstName} {cleaner.lastName}
                        </p>
                        <p className="text-xs text-slate-500">
                          ⭐ {cleaner.rating} • {cleaner.jobsCompleted} jobs
                        </p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedBooking(null)}
                className="flex-1"
                disabled={isAssigning}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAssignment}
                disabled={!selectedCleaner || isAssigning}
                className="flex-1"
              >
                {isAssigning ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Assigning...
                  </>
                ) : (
                  '✓ Assign & Notify'
                )}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
