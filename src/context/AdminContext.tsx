import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking, BookingStatus } from '../types/booking';
import { Cleaner } from '../types/operations';
import {
  getBookings,
  getCleaners,
  assignCleanerToBooking as assignCleanerToBookingSupabase,
  updateBookingStatus as updateBookingStatusSupabase,
  getDashboardStats,
} from '../lib/supabase';

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
}

interface AdminContextType {
  // Data
  bookings: Booking[];
  cleaners: Cleaner[];
  stats: DashboardStats;

  // Filters
  statusFilter: BookingStatus | 'all';
  setStatusFilter: (status: BookingStatus | 'all') => void;

  // Actions
  assignCleaner: (bookingId: string, cleanerId: string) => Promise<boolean>;
  updateStatus: (bookingId: string, status: BookingStatus) => Promise<boolean>;
  getAvailableCleaners: (postcode: string) => Cleaner[];
  refreshData: () => Promise<void>;

  // UI State
  isLoading: boolean;
  error: string | null;
  selectedBookingId: string | null;
  setSelectedBookingId: (id: string | null) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    assignedBookings: 0,
    inProgressBookings: 0,
    completedBookings: 0,
    totalCleaners: 0,
    verifiedCleaners: 0,
    totalRevenue: 0,
  });
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      setError(null);
      const [bookingsData, cleanersData, statsData] = await Promise.all([
        getBookings(),
        getCleaners(),
        getDashboardStats(),
      ]);

      setBookings(bookingsData as any);
      setCleaners(cleanersData as any);
      setStats(statsData as any);
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
    refreshData,
    isLoading,
    error,
    selectedBookingId,
    setSelectedBookingId,
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
