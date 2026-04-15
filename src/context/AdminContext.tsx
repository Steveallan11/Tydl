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
      const [bookingsData, cleanersData, statsData, financialsData, pendingPayoutsData, approvedPayoutsData] = await Promise.all([
        getBookings(),
        getCleaners(),
        getDashboardStats(),
        getAllJobFinancials(),
        getPayoutsByStatus('pending'),
        getPayoutsByStatus('approved'),
      ]);

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
      })) || [];

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
      setJobFinancials(financialsData as any);
      setPendingPayouts(pendingPayoutsData as any);
      setApprovedPayouts(approvedPayoutsData as any);

      // Calculate additional stats
      const pendingPayments = (financialsData as any[])?.filter((f: any) => f.payment_status === 'pending').reduce((sum: number, f: any) => sum + f.customer_payment, 0) || 0;
      const platformFees = (financialsData as any[])?.reduce((sum: number, f: any) => sum + f.platform_fee, 0) || 0;
      const avgValue = transformedBookings?.length > 0 ? (statsData as any).totalRevenue / transformedBookings.length : 0;

      setStats({
        ...statsData as any,
        pendingPayments,
        pendingPayouts: (pendingPayoutsData as any[])?.reduce((sum: number, p: any) => sum + p.total_amount, 0) || 0,
        platformMargin: platformFees,
        averageJobValue: avgValue,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('Error refreshing admin data:', err);
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
      await assignCleanerToBookingSupabase(bookingId, cleanerId);
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

      // Step 1: Create cleaner record
      const newCleaner = await createCleanerAdmin({
        email: cleanerData.email,
        first_name: cleanerData.firstName,
        last_name: cleanerData.lastName,
        phone: cleanerData.phone,
        postcode: cleanerData.postcode,
      });

      if (!newCleaner.id) {
        throw new Error('Failed to create cleaner record');
      }

      const cleanerId = newCleaner.id;

      // Step 2: Save bank details
      await saveCleanerBankDetails(cleanerId, {
        account_holder_name: cleanerData.accountHolderName,
        sort_code: cleanerData.sortCode,
        account_number: cleanerData.accountNumber,
      });

      // Step 3: Save payout settings
      await saveCleanerPayoutSettings(cleanerId, {
        compensation_type: cleanerData.compensationType,
        flat_rate_per_job: cleanerData.flatRatePerJob,
        hourly_rate: cleanerData.hourlyRate,
        percentage_of_revenue: cleanerData.percentageOfRevenue,
        payout_frequency: cleanerData.payoutFrequency,
        minimum_payout: cleanerData.minimumPayout,
      });

      // Step 4: Log activity
      if (adminId) {
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
      }

      await refreshData();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to onboard cleaner');
      console.error('Error onboarding cleaner:', err);
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
