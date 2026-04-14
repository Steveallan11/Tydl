import { Booking, BookingStatus } from '../types/booking';
import { Cleaner } from '../types/operations';

/**
 * Get all bookings from localStorage
 */
export function getAllBookings(): Booking[] {
  const bookingKeys = Object.keys(localStorage).filter(key => key.startsWith('booking:'));
  return bookingKeys.map(key => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }).filter(Boolean) as Booking[];
}

/**
 * Get bookings by status
 */
export function getBookingsByStatus(status: BookingStatus): Booking[] {
  const bookings = getAllBookings();
  return bookings.filter(b => b.status === status);
}

/**
 * Get all cleaners from localStorage
 */
export function getAllCleaners(): Cleaner[] {
  const cleanerKeys = Object.keys(localStorage).filter(key => key.startsWith('cleaner:'));
  return cleanerKeys.map(key => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }).filter(Boolean) as Cleaner[];
}

/**
 * Initialize test cleaners (for MVP)
 */
export function initializeTestCleaners(): void {
  const testCleaners: Cleaner[] = [
    {
      id: 'cleaner-001',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@cleaners.local',
      phone: '07700 123456',
      postcode: 'NN1',
      verificationStatus: 'verified',
      jobsCompleted: 47,
      rating: 4.9,
      availability: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
      },
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cleaner-002',
      firstName: 'Marcus',
      lastName: 'Williams',
      email: 'marcus@cleaners.local',
      phone: '07700 234567',
      postcode: 'NN1',
      verificationStatus: 'verified',
      jobsCompleted: 32,
      rating: 4.8,
      availability: {
        monday: true,
        tuesday: false,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: false,
      },
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cleaner-003',
      firstName: 'Emma',
      lastName: 'Chen',
      email: 'emma@cleaners.local',
      phone: '07700 345678',
      postcode: 'NN1',
      verificationStatus: 'verified',
      jobsCompleted: 19,
      rating: 4.7,
      availability: {
        monday: true,
        tuesday: true,
        wednesday: false,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      },
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Check if cleaners already exist
  const existingCleaners = getAllCleaners();
  if (existingCleaners.length === 0) {
    testCleaners.forEach(cleaner => {
      localStorage.setItem(`cleaner:${cleaner.id}`, JSON.stringify(cleaner));
    });
  }
}

/**
 * Assign a cleaner to a booking
 */
export function assignCleanerToBooking(bookingId: string, cleanerId: string): boolean {
  const bookingData = localStorage.getItem(`booking:${bookingId}`);
  if (!bookingData) return false;

  const booking = JSON.parse(bookingData) as Booking;
  booking.assignedCleanerId = cleanerId;
  booking.status = 'assigned';
  booking.updatedAt = new Date().toISOString();

  localStorage.setItem(`booking:${bookingId}`, JSON.stringify(booking));

  // Update cleaner's current job
  const cleanerData = localStorage.getItem(`cleaner:${cleanerId}`);
  if (cleanerData) {
    const cleaner = JSON.parse(cleanerData) as Cleaner;
    cleaner.currentJobId = bookingId;
    cleaner.updatedAt = new Date().toISOString();
    localStorage.setItem(`cleaner:${cleanerId}`, JSON.stringify(cleaner));
  }

  return true;
}

/**
 * Update booking status
 */
export function updateBookingStatus(bookingId: string, status: BookingStatus): boolean {
  const bookingData = localStorage.getItem(`booking:${bookingId}`);
  if (!bookingData) return false;

  const booking = JSON.parse(bookingData) as Booking;
  booking.status = status;
  booking.updatedAt = new Date().toISOString();

  localStorage.setItem(`booking:${bookingId}`, JSON.stringify(booking));
  return true;
}

/**
 * Find available cleaners for a booking
 * Returns cleaners who are verified and available on the booking date
 */
export function findAvailableCleaners(booking: Booking): Cleaner[] {
  const cleaners = getAllCleaners();

  // Filter verified cleaners
  let available = cleaners.filter(c => c.verificationStatus === 'verified');

  // Filter by availability on booking date if available
  if (booking.scheduledDate) {
    const bookingDate = new Date(booking.scheduledDate);
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = dayNames[bookingDate.getDay()] as keyof typeof available[0]['availability'];

    available = available.filter(c => c.availability[dayOfWeek]);
  }

  // Sort by rating (highest first)
  available.sort((a, b) => b.rating - a.rating);

  return available;
}

/**
 * Get dashboard statistics
 */
export function getDashboardStats() {
  const bookings = getAllBookings();
  const cleaners = getAllCleaners();

  return {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    assignedBookings: bookings.filter(b => b.status === 'assigned').length,
    inProgressBookings: bookings.filter(b => b.status === 'in-progress').length,
    completedBookings: bookings.filter(b => b.status === 'completed').length,
    totalCleaners: cleaners.length,
    verifiedCleaners: cleaners.filter(c => c.verificationStatus === 'verified').length,
    totalRevenue: bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.totalPrice, 0),
  };
}

/**
 * Format booking for display
 */
export function formatBookingForDisplay(booking: Booking) {
  return {
    id: booking.id,
    customerName: `${booking.firstName || 'Unknown'} ${booking.lastName || ''}`.trim(),
    email: booking.email,
    phone: booking.phone,
    service: booking.serviceType,
    date: booking.scheduledDate,
    time: booking.scheduledTime,
    price: booking.totalPrice,
    status: booking.status,
    assignedCleanerId: booking.assignedCleanerId,
    createdAt: booking.createdAt,
  };
}

/**
 * Get cleaner by ID
 */
export function getCleanerById(cleanerId: string): Cleaner | null {
  const data = localStorage.getItem(`cleaner:${cleanerId}`);
  return data ? JSON.parse(data) : null;
}
