import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Customer authentication
 */
export async function signUpCustomer(email: string, password: string, firstName: string, lastName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signInCustomer(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOutCustomer() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentCustomer() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

/**
 * Admin authentication
 */
export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Check if user is admin
  const { data: adminData, error: adminError } = await supabase
    .from('admins')
    .select('id, role')
    .eq('auth_id', data.user?.id)
    .single();

  if (adminError) {
    await supabase.auth.signOut();
    throw new Error('Not authorized as admin');
  }

  return { user: data.user, admin: adminData };
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentAdmin() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return null;

  const { data: adminData, error: adminError } = await supabase
    .from('admins')
    .select('id, role, auth_id')
    .eq('auth_id', userData.user.id)
    .single();

  if (adminError) return null;

  return {
    user: userData.user,
    admin: adminData,
  };
}

/**
 * Bookings
 */
export async function createBooking(bookingData: any) {
  const { data: userData } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('bookings')
    .insert([
      {
        customer_id: userData.user?.id,
        ...bookingData,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getCustomerBookings(customerId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function assignCleanerToBooking(bookingId: string, cleanerId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      assigned_cleaner_id: cleanerId,
      status: 'assigned',
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Cleaners
 */
export async function getCleaners() {
  const { data, error } = await supabase
    .from('cleaners')
    .select('*')
    .eq('verification_status', 'verified');

  if (error) throw error;
  return data;
}

export async function getCleanerById(cleanerId: string) {
  const { data, error } = await supabase
    .from('cleaners')
    .select('*')
    .eq('id', cleanerId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Dashboard stats
 */
export async function getDashboardStats() {
  const [bookings, cleaners] = await Promise.all([
    getBookings(),
    getCleaners(),
  ]);

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b: any) => b.status === 'pending').length,
    assignedBookings: bookings.filter((b: any) => b.status === 'assigned').length,
    inProgressBookings: bookings.filter((b: any) => b.status === 'in-progress').length,
    completedBookings: bookings.filter((b: any) => b.status === 'completed').length,
    totalCleaners: cleaners.length,
    verifiedCleaners: cleaners.filter((c: any) => c.verification_status === 'verified').length,
    totalRevenue: bookings
      .filter((b: any) => b.status === 'completed')
      .reduce((sum: number, b: any) => sum + (b.total_price || 0), 0),
  };

  return stats;
}
