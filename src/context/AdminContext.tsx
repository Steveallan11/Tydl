import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking, BookingStatus } from '../types/booking';
import { Cleaner } from '../types/operations';
import {
  getBookings,
  getCleaners,
  assignCleanerToBooking as assignCleanerToBookingSupabase,
  updateBookingStatus as updateBookingStatusSupabase,
  getDashboardStats,
  getAllJobFinancials,
  getPayoutsByStatus,
  saveCleanerBankDetails,
  saveCleanerPayoutSettings,
  logAdminActivity,
  createCleanerAdmin,
} from '../lib/supabase';
import { sendCleanerJobNotificationEmail } from '../lib/email';
import { JobFinancials, CleanerPayout } from '../types/payments';

export interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings?: number;
  assignedBookings: number;
  inProgressBookings: number;
  completedBookings: number;
  totalCleaners: number;
  verifiedCleaners: number;
  totalRevenue: number;
  pendingPayments: number;
  pendingPayouts: number;
  platformMargin: number;
  averageJobValue: number;
}

interface AdminContextType {
  // Data
  bookings: Booking[];
  cleaners: Cleaner[];
  stats: DashboardStats;
  jobFinancials: JobFinancials[];
  pendingPayouts: CleanerPayout[];
  approvedPayouts: CleanerPayout[];

  // Filters
  statusFilter: BookingStatus | 'all';
  setStatusFilter: (status: BookingStatus | 'all') => void;

  // Actions
  assignCleaner: (bookingId: string, cleanerId: string) => Promise<boolean>;
  updateStatus: (bookingId: string, status: BookingStatus) => Promise<boolean>;
  getAvailableCleaners: (postcode: string) => Cleaner[];
  onboardCleaner: (cleanerData: any) => Promise<boolean>;
  refreshData: () => Promise<void>;

  // UI State
  isLoading: boolean;
  error: string | null;
  selectedBookingId: string | null;
  setSelectedBookingId: (id: string | null) => void;
  adminId?: string;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [jobFinancials, setJobFinancials] = useState<JobFinancials[]>([]);
  const [pendingPayouts, setPendingPayouts] = useState<CleanerPayout[]>([]);
  const [approvedPayouts, setApprovedPayouts] = useState<CleanerPayout[]>([]);
  const [adminId, setAdminId] = useState<string>();
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    assignedBookings: 0,
    inProgressBookings: 0,
    completedBookings: 0,
    totalCleaners: 0,
    verifiedCleaners: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    pendingPayouts: 0,
    platformMargin: 0,
    averageJobValue: 0,
  });
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      setError(null);
      console.log('[AdminContext] Refreshing data...');

      // Fetch only essential data - skip calls to non-existent tables
      const [bookingsData, cleanersData, statsData] = await Promise.all([
        getBookings(),
        getCleaners(),
        getDashboardStats(),
      ]);

      console.log('[AdminContext] Raw bookings data:', bookingsData);
      console.log('[AdminContext] Cleaners data:', cleanersData);
      console.log('[AdminContext] Stats data:', statsData);

      // Transform bookings to flatten customer data from Supabase relations
      const transformedBookings = (bookingsData as any[])?.map((booking: any) => ({
        ...booking,
        // Flatten customer data from nested relation
        firstName: booking.customer?.first_name || booking.firstName,
        lastName: booking.customer?.last_name || booking.lastName,
        email: booking.customer?.email || booking.email,
        phone: booking.customer?.phone || booking.phone,
        // Keep original camelCase service_type as serviceType for compatibility
        serviceType: booking.service_type || booking.serviceType,
        propertySize: booking.property_size || booking.propertySize,
        assignedCleanerId: booking.cleaner_id || booking.assignedCleanerId,
        scheduledDate: booking.scheduled_date || booking.scheduledDate,
        scheduledTime: booking.scheduled_time || booking.scheduledTime,
        totalPrice: booking.total_price || booking.totalPrice,
        customerId: booking.customer_id || booking.customerId,
        customerNotes: booking.customer_notes || booking.customerNotes,
        addOns: booking.add_ons || booking.addOns,
        needsBeforeAfterImages: booking.needs_before_after_images || booking.needsBeforeAfterImages,
      })) || [];

      console.log('[AdminContext] Transformed bookings:', transformedBookings);

      // Transform cleaners to flatten data and convert snake_case to camelCase
      const transformedCleaners = (cleanersData as any[])?.map((cleaner: any) => ({
        ...cleaner,
        firstName: cleaner.first_name || cleaner.firstName,
        lastName: cleaner.last_name || cleaner.lastName,
        verificationStatus: cleaner.verification_status || cleaner.verificationStatus,
        jobsCompleted: cleaner.jobs_completed || cleaner.jobsCompleted || 0,
        currentJobId: cleaner.current_job_id || cleaner.currentJobId,
        createdAt: cleaner.created_at || cleaner.createdAt,
        updatedAt: cleaner.updated_at || cleaner.updatedAt,
      })) || [];

      setBookings(transformedBookings as any);
      setCleaners(transformedCleaners as any);
      setJobFinancials([]);
      setPendingPayouts([]);
      setApprovedPayouts([]);

      console.log('[AdminContext] Bookings state set to:', transformedBookings.length, 'items');

      // Use stats as-is (skip the extra calculations that require missing tables)
      setStats(statsData as any);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('[AdminContext] Error refreshing data:', err);
    }
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await refreshData();
      setIsLoading(false);
    };
    loadData();
  }, []);

  const assignCleaner = async (bookingId: string, cleanerId: string): Promise<boolean> => {
    try {
      setError(null);
      console.log('[AdminContext] Assigning cleaner', cleanerId, 'to booking', bookingId);

      // Assign cleaner in database
      await assignCleanerToBookingSupabase(bookingId, cleanerId);

      // Get the updated booking details
      const updatedBookings = await getBookings();
      const booking = updatedBookings.find((b: any) => b.id === bookingId);

      // Get the assigned cleaner details
      const allCleaners = await getCleaners();
      const cleaner = allCleaners.find((c: any) => c.id === cleanerId);

      if (booking && cleaner) {
        console.log('[AdminContext] Sending job notification email to cleaner:', cleaner.email);

        // Send email to cleaner about new job assignment
        const emailSent = await sendCleanerJobNotificationEmail(
          cleaner.email,
          `${cleaner.first_name || cleaner.firstName} ${cleaner.last_name || cleaner.lastName}`,
          {
            bookingId: booking.id,
            customerName: `${booking.customer?.first_name || booking.firstName} ${booking.customer?.last_name || booking.lastName}`,
            serviceType: booking.service_type || booking.serviceType,
            scheduledDate: booking.scheduled_date || booking.scheduledDate,
            scheduledTime: booking.scheduled_time || booking.scheduledTime,
            propertySize: booking.property_size || booking.propertySize,
            address: booking.customer?.full_address || booking.address || 'Address not provided',
            customerPhone: booking.customer?.phone || booking.phone,
            customerNotes: booking.customer_notes || booking.customerNotes,
            totalPrice: booking.total_price || booking.totalPrice,
          }
        );

        if (emailSent) {
          console.log('[AdminContext] Job notification email sent successfully');
        } else {
          console.warn('[AdminContext] Job notification email failed to send');
        }
      }

      // Refresh data to get all updates
      await refreshData();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to assign cleaner');
      console.error('Error assigning cleaner:', err);
      return false;
    }
  };

  const updateStatus = async (bookingId: string, status: BookingStatus): Promise<boolean> => {
    try {
      setError(null);
      await updateBookingStatusSupabase(bookingId, status);
      await refreshData();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
      console.error('Error updating status:', err);
      return false;
    }
  };

  const getAvailableCleaners = (postcode: string): Cleaner[] => {
    return cleaners.filter(
      (c: any) =>
        c.postcode === postcode &&
        (c.verification_status === 'verified' || c.verificationStatus === 'verified')
    );
  };

  const onboardCleaner = async (cleanerData: any): Promise<boolean> => {
    try {
      setError(null);
      console.log('[onboardCleaner] Starting cleaner onboarding with data:', {
        email: cleanerData.email,
        firstName: cleanerData.firstName,
        lastName: cleanerData.lastName,
      });

      // Step 1: Create cleaner record (essential)
      console.log('[onboardCleaner] Creating cleaner record...');
      const newCleaner = await createCleanerAdmin({
        email: cleanerData.email,
        first_name: cleanerData.firstName,
        last_name: cleanerData.lastName,
        phone: cleanerData.phone,
        postcode: cleanerData.postcode,
      });

      console.log('[onboardCleaner] Cleaner created successfully:', newCleaner.id);

      if (!newCleaner.id) {
        throw new Error('Failed to create cleaner record');
      }

      const cleanerId = newCleaner.id;

      // Step 2: Save bank details (optional - table may not exist yet)
      try {
        console.log('[onboardCleaner] Saving bank details for cleaner:', cleanerId);
        await saveCleanerBankDetails(cleanerId, {
          account_holder_name: cleanerData.accountHolderName,
          sort_code: cleanerData.sortCode,
          account_number: cleanerData.accountNumber,
        });
        console.log('[onboardCleaner] Bank details saved');
      } catch (bankErr) {
        console.warn('[onboardCleaner] Bank details table not available yet, skipping:', bankErr);
        // Don't block onboarding if bank details table doesn't exist
      }

      // Step 3: Save payout settings (optional - table may not exist yet)
      try {
        console.log('[onboardCleaner] Saving payout settings...');
        await saveCleanerPayoutSettings(cleanerId, {
          compensation_type: cleanerData.compensationType,
          flat_rate_per_job: cleanerData.flatRatePerJob,
          hourly_rate: cleanerData.hourlyRate,
          percentage_of_revenue: cleanerData.percentageOfRevenue,
          payout_frequency: cleanerData.payoutFrequency,
          minimum_payout: cleanerData.minimumPayout,
        });
        console.log('[onboardCleaner] Payout settings saved');
      } catch (payoutErr) {
        console.warn('[onboardCleaner] Payout settings table not available yet, skipping:', payoutErr);
        // Don't block onboarding if payout settings table doesn't exist
      }

      // Step 4: Log activity (optional - table may not exist yet)
      if (adminId) {
        try {
          console.log('[onboardCleaner] Logging admin activity...');
          await logAdminActivity(
            adminId,
            'onboard_cleaner',
            'cleaner',
            cleanerId,
            {},
            {
              email: cleanerData.email,
              compensation_type: cleanerData.compensationType,
              payout_frequency: cleanerData.payoutFrequency,
            }
          );
        } catch (activityErr) {
          console.warn('[onboardCleaner] Activity log table not available yet, skipping:', activityErr);
          // Don't block onboarding if activity log table doesn't exist
        }
      }

      console.log('[onboardCleaner] Refreshing admin data...');
      await refreshData();
      console.log('[onboardCleaner] Cleaner onboarding completed successfully!');
      return true;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to onboard cleaner';
      setError(errorMsg);
      console.error('[onboardCleaner] Error:', {
        message: errorMsg,
        code: err.code,
        details: err.details,
        stack: err.stack,
      });
      return false;
    }
  };

  // Filter bookings by status
  const filteredBookings = statusFilter === 'all'
    ? bookings
    : bookings.filter(b => b.status === statusFilter);

  const value: AdminContextType = {
    bookings: filteredBookings,
    cleaners,
    stats,
    statusFilter,
    setStatusFilter,
    assignCleaner,
    updateStatus,
    getAvailableCleaners,
    onboardCleaner,
    refreshData,
    isLoading,
    error,
    selectedBookingId,
    setSelectedBookingId,
    jobFinancials,
    pendingPayouts,
    approvedPayouts,
    adminId,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
