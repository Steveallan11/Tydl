import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking, BookingStatus } from '../types/booking';
import { Cleaner } from '../types/operations';
import {
  getAllBookings,
  getAllCleaners,
  assignCleanerToBooking,
  updateBookingStatus,
  findAvailableCleaners,
  getDashboardStats,
  initializeTestCleaners,
} from '../lib/admin';

export interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
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
  assignCleaner: (bookingId: string, cleanerId: string) => boolean;
  updateStatus: (bookingId: string, status: BookingStatus) => boolean;
  getAvailableCleaners: (booking: Booking) => Cleaner[];
  refreshData: () => void;

  // UI State
  isLoading: boolean;
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
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const refreshData = () => {
    setBookings(getAllBookings());
    setCleaners(getAllCleaners());
    setStats(getDashboardStats());
  };

  // Initialize cleaners and load data on mount
  useEffect(() => {
    initializeTestCleaners();
    refreshData();
    setIsLoading(false);
  }, []);

  const assignCleaner = (bookingId: string, cleanerId: string): boolean => {
    const success = assignCleanerToBooking(bookingId, cleanerId);
    if (success) {
      refreshData();
    }
    return success;
  };

  const updateStatus = (bookingId: string, status: BookingStatus): boolean => {
    const success = updateBookingStatus(bookingId, status);
    if (success) {
      refreshData();
    }
    return success;
  };

  const getAvailableCleaners = (booking: Booking): Cleaner[] => {
    return findAvailableCleaners(booking);
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
