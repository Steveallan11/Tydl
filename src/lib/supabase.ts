import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[Supabase Init] Raw URL:', supabaseUrl);
console.log('[Supabase Init] Raw URL type:', typeof supabaseUrl);
console.log('[Supabase Init] Raw URL length:', supabaseUrl?.length);

// Clean the URL if it has extra formatting
if (supabaseUrl && typeof supabaseUrl === 'string') {
  supabaseUrl = supabaseUrl.trim().replace(/^[<"]|[>"]$/g, '');
}

console.log('[Supabase Init] Cleaned URL:', supabaseUrl);
console.log('[Supabase Init] URL exists:', !!supabaseUrl);
console.log('[Supabase Init] Key exists:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  const error = new Error(`Missing Supabase environment variables. URL: ${!!supabaseUrl}, Key: ${!!supabaseAnonKey}`);
  console.error('[Supabase Init] Error:', error);
  throw error;
}

console.log('[Supabase Init] Creating client with URL:', supabaseUrl);
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('[Supabase Init] Client created successfully!');

// ============================================================================
// CUSTOMER AUTHENTICATION & PROFILE
// ============================================================================

export async function signUpCustomer(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  postcode: string,
  phone: string
) {
  // Step 1: Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Signup failed');

  // Step 2: Create customer record in customers table
  const { data: customerData, error: customerError } = await supabase
    .from('customers')
    .insert([
      {
        id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        postcode,
      },
    ])
    .select()
    .single();

  if (customerError) {
    // Delete auth user if customer record creation fails
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw customerError;
  }

  return { user: authData.user, customer: customerData };
}

export async function signInCustomer(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error('Sign in failed');

  // Get customer profile
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (customerError) throw customerError;

  return { user: data.user, customer };
}

export async function signOutCustomer() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentCustomer() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return null;

  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', userData.user.id)
    .single();

  if (customerError) return null;

  return { user: userData.user, customer };
}

export async function updateCustomerProfile(
  customerId: string,
  updates: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    postcode?: string;
    full_address?: string;
  }
) {
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', customerId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// CLEANER AUTHENTICATION & PROFILE
// ============================================================================

export async function signUpCleaner(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone: string,
  postcode: string
) {
  // Step 1: Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Signup failed');

  // Step 2: Create cleaner record in cleaners table
  const { data: cleanerData, error: cleanerError } = await supabase
    .from('cleaners')
    .insert([
      {
        id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        postcode,
        verification_status: 'pending',
      },
    ])
    .select()
    .single();

  if (cleanerError) {
    // Delete auth user if cleaner record creation fails
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw cleanerError;
  }

  return { user: authData.user, cleaner: cleanerData };
}

export async function signInCleaner(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error('Sign in failed');

  // Get cleaner profile
  const { data: cleaner, error: cleanerError } = await supabase
    .from('cleaners')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (cleanerError) throw cleanerError;

  return { user: data.user, cleaner };
}

export async function signOutCleaner() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentCleaner() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return null;

  const { data: cleaner, error: cleanerError } = await supabase
    .from('cleaners')
    .select('*')
    .eq('id', userData.user.id)
    .single();

  if (cleanerError) return null;

  return { user: userData.user, cleaner };
}

export async function updateCleanerProfile(
  cleanerId: string,
  updates: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    postcode?: string;
    monday?: boolean;
    tuesday?: boolean;
    wednesday?: boolean;
    thursday?: boolean;
    friday?: boolean;
    saturday?: boolean;
    sunday?: boolean;
  }
) {
  const { data, error } = await supabase
    .from('cleaners')
    .update(updates)
    .eq('id', cleanerId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCleanerJobs(cleanerId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      *,
      customer:customers(id, first_name, last_name, email, phone, full_address)
      `
    )
    .eq('cleaner_id', cleanerId)
    .in('status', ['confirmed', 'assigned', 'in-progress'])
    .order('scheduled_date', { ascending: true });

  if (error) throw error;
  return data;
}

// ============================================================================
// ADMIN AUTHENTICATION
// ============================================================================

export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error('Sign in failed');

  // Check if user is admin
  const { data: admin, error: adminError } = await supabase
    .from('admin_users')
    .select('id, email, role')
    .eq('email', email)
    .single();

  if (adminError) {
    await supabase.auth.signOut();
    throw new Error('Not authorized as admin');
  }

  return { user: data.user, admin };
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentAdmin() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return null;

  const { data: admin, error: adminError } = await supabase
    .from('admin_users')
    .select('id, email, role')
    .eq('email', userData.user.email!)
    .single();

  if (adminError) return null;

  return { user: userData.user, admin };
}

// ============================================================================
// BOOKINGS
// ============================================================================

export async function createBooking(bookingData: {
  customer_id: string;
  service_type: string;
  property_size: string;
  supplies: string;
  frequency: string;
  add_ons: string[];
  total_price: number;
  scheduled_date: string;
  scheduled_time: string;
  customer_notes?: string;
}) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([
      {
        ...bookingData,
        status: 'pending',
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
    .select(
      `
      *,
      customer:customers(id, first_name, last_name, email, phone),
      cleaner:cleaners(id, first_name, last_name, email)
      `
    )
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getCustomerBookings(customerId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      *,
      customer:customers(id, first_name, last_name, email, phone),
      cleaner:cleaners(id, first_name, last_name, email)
      `
    )
    .eq('customer_id', customerId)
    .order('scheduled_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getBookingsByStatus(status: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      *,
      customer:customers(id, first_name, last_name, email, phone),
      cleaner:cleaners(id, first_name, last_name, email)
      `
    )
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getBookingById(bookingId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      *,
      customer:customers(id, first_name, last_name, email, phone, full_address),
      cleaner:cleaners(id, first_name, last_name, email, phone)
      `
    )
    .eq('id', bookingId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function assignCleanerToBooking(
  bookingId: string,
  cleanerId: string
) {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      cleaner_id: cleanerId,
      status: 'assigned',
    })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// CLEANERS
// ============================================================================

export async function getCleaners(verification_status = 'verified') {
  const { data, error } = await supabase
    .from('cleaners')
    .select('*')
    .eq('verification_status', verification_status)
    .order('rating', { ascending: false });

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

export async function getAvailableCleaners(postcode: string, dayOfWeek: string) {
  const dayColumn = dayOfWeek.toLowerCase();

  const { data, error } = await supabase
    .from('cleaners')
    .select('*')
    .eq('postcode', postcode)
    .eq('verification_status', 'verified')
    .eq(dayColumn, true)
    .order('rating', { ascending: false });

  if (error) throw error;
  return data;
}

// ============================================================================
// CLEANER RATINGS
// ============================================================================

export async function addCleanerRating(
  bookingId: string,
  cleanerId: string,
  customerId: string,
  rating: number,
  review?: string
) {
  const { data, error } = await supabase
    .from('cleaner_ratings')
    .insert([
      {
        booking_id: bookingId,
        cleaner_id: cleanerId,
        customer_id: customerId,
        rating,
        review,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCleanerRatings(cleanerId: string) {
  const { data, error } = await supabase
    .from('cleaner_ratings')
    .select('*')
    .eq('cleaner_id', cleanerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// ============================================================================
// DASHBOARD STATS
// ============================================================================

export async function getDashboardStats() {
  try {
    const [bookingsData, cleanersData] = await Promise.all([
      getBookings(),
      getCleaners(),
    ]);

    const stats = {
      totalBookings: bookingsData.length,
      pendingBookings: bookingsData.filter((b: any) => b.status === 'pending')
        .length,
      confirmedBookings: bookingsData.filter((b: any) => b.status === 'confirmed')
        .length,
      assignedBookings: bookingsData.filter((b: any) => b.status === 'assigned')
        .length,
      inProgressBookings: bookingsData.filter((b: any) => b.status === 'in-progress')
        .length,
      completedBookings: bookingsData.filter((b: any) => b.status === 'completed')
        .length,
      totalCleaners: cleanersData.length,
      verifiedCleaners: cleanersData.filter((c: any) => c.verification_status === 'verified')
        .length,
      totalRevenue: bookingsData
        .filter((b: any) => b.status === 'completed')
        .reduce((sum: number, b: any) => sum + (b.total_price || 0), 0),
    };

    return stats;
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
}

// ============================================================================
// ADMIN USERS
// ============================================================================

export async function getAdminUsers() {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createAdminUser(email: string, role = 'admin') {
  const { data, error } = await supabase
    .from('admin_users')
    .insert([
      {
        email,
        role,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}
