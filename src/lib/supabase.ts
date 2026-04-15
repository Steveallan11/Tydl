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
  try {
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

    if (error) {
      console.error('[getBookings] Supabase error:', error);
      throw error;
    }
    console.log('[getBookings] Retrieved', data?.length || 0, 'bookings');
    return data || [];
  } catch (error: any) {
    console.error('[getBookings] Error fetching bookings:', error);
    throw error;
  }
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
  try {
    const { data, error } = await supabase
      .from('cleaners')
      .select('*')
      .eq('verification_status', verification_status)
      .order('rating', { ascending: false });

    // If permission denied (406), return empty array instead of throwing
    if (error) {
      // Check for permission denied errors (406 or PGRST116)
      if (error.code === '406' || error.message?.includes('406') || error.message?.includes('permission')) {
        console.warn('[getCleaners] Permission denied - user may not be admin');
        return [];
      }
      throw error;
    }
    return data || [];
  } catch (error: any) {
    console.error('Error getting cleaners:', error);
    // Return empty array on error instead of throwing to prevent page crash
    return [];
  }
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

export async function createCleanerAdmin(cleanerData: {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  postcode: string;
}) {
  const { data, error } = await supabase
    .from('cleaners')
    .insert([
      {
        ...cleanerData,
        verification_status: 'pending',
      },
    ])
    .select()
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

// ============================================================================
// CLEANER BANK DETAILS & PAYOUT SETTINGS
// ============================================================================

export async function saveCleanerBankDetails(cleanerId: string, bankDetails: {
  account_holder_name: string;
  sort_code: string;
  account_number: string;
}) {
  const { data, error } = await supabase
    .from('cleaner_bank_details')
    .upsert(
      {
        cleaner_id: cleanerId,
        ...bankDetails,
      },
      { onConflict: 'cleaner_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCleanerBankDetails(cleanerId: string) {
  const { data, error } = await supabase
    .from('cleaner_bank_details')
    .select('*')
    .eq('cleaner_id', cleanerId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
  return data || null;
}

export async function saveCleanerPayoutSettings(cleanerId: string, settings: {
  compensation_type: string;
  flat_rate_per_job?: number;
  hourly_rate?: number;
  percentage_of_revenue?: number;
  payout_frequency: string;
  minimum_payout?: number;
}) {
  const { data, error } = await supabase
    .from('cleaner_payout_settings')
    .upsert(
      {
        cleaner_id: cleanerId,
        ...settings,
      },
      { onConflict: 'cleaner_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCleanerPayoutSettings(cleanerId: string) {
  const { data, error } = await supabase
    .from('cleaner_payout_settings')
    .select('*')
    .eq('cleaner_id', cleanerId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

// ============================================================================
// JOB FINANCIALS
// ============================================================================

export async function createJobFinancials(bookingId: string, financials: {
  customer_payment: number;
  cleaner_payout: number;
  platform_fee: number;
  net_profit: number;
  payment_method?: string;
}) {
  const { data, error } = await supabase
    .from('job_financials')
    .insert([
      {
        booking_id: bookingId,
        ...financials,
        payment_status: 'pending',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getJobFinancials(bookingId: string) {
  const { data, error } = await supabase
    .from('job_financials')
    .select('*')
    .eq('booking_id', bookingId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function updateJobFinancialStatus(bookingId: string, paymentStatus: string) {
  const { data, error } = await supabase
    .from('job_financials')
    .update({ payment_status: paymentStatus })
    .eq('booking_id', bookingId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAllJobFinancials() {
  const { data, error } = await supabase
    .from('job_financials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// ============================================================================
// TIME ENTRIES
// ============================================================================

export async function createTimeEntry(bookingId: string, cleanerId: string, scheduledDuration: number) {
  const { data, error } = await supabase
    .from('time_entries')
    .insert([
      {
        booking_id: bookingId,
        cleaner_id: cleanerId,
        scheduled_duration: scheduledDuration,
        status: 'scheduled',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTimeEntry(timeEntryId: string, updates: {
  actual_start_time?: string;
  actual_end_time?: string;
  actual_duration?: number;
  break_duration?: number;
  notes?: string;
  status?: string;
}) {
  const { data, error } = await supabase
    .from('time_entries')
    .update(updates)
    .eq('id', timeEntryId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getTimeEntry(bookingId: string) {
  const { data, error } = await supabase
    .from('time_entries')
    .select('*')
    .eq('booking_id', bookingId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

// ============================================================================
// CLEANER PAYOUTS
// ============================================================================

export async function createCleanerPayout(
  cleanerId: string,
  payoutData: {
    payout_period_start: string;
    payout_period_end: string;
    total_amount: number;
    num_jobs: number;
  }
) {
  const { data, error } = await supabase
    .from('cleaner_payouts')
    .insert([
      {
        cleaner_id: cleanerId,
        ...payoutData,
        status: 'pending',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCleanerPayoutStatus(payoutId: string, status: string) {
  const { data, error } = await supabase
    .from('cleaner_payouts')
    .update({ status })
    .eq('id', payoutId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCleanerPayouts(cleanerId: string, limit = 50) {
  const { data, error } = await supabase
    .from('cleaner_payouts')
    .select('*')
    .eq('cleaner_id', cleanerId)
    .order('payout_period_start', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getPayoutsByStatus(status: string) {
  const { data, error } = await supabase
    .from('cleaner_payouts')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function addPayoutItem(payoutId: string, payoutItem: {
  booking_id: string;
  job_financials_id: string;
  amount: number;
}) {
  const { data, error } = await supabase
    .from('payout_items')
    .insert([
      {
        payout_id: payoutId,
        ...payoutItem,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPayoutItems(payoutId: string) {
  const { data, error } = await supabase
    .from('payout_items')
    .select(`
      *,
      job_financials:job_financials_id(customer_payment, cleaner_payout, platform_fee),
      booking:booking_id(id, service_type, scheduled_date, customer_id)
    `)
    .eq('payout_id', payoutId);

  if (error) throw error;
  return data;
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export async function sendNotification(
  recipientId: string,
  recipientType: 'customer' | 'cleaner' | 'admin',
  notificationType: string,
  title: string,
  message: string,
  metadata?: Record<string, any>,
  channel: 'in-app' | 'email' | 'sms' = 'in-app'
) {
  const { data, error } = await supabase
    .from('notifications')
    .insert([
      {
        recipient_id: recipientId,
        recipient_type: recipientType,
        notification_type: notificationType,
        title,
        message,
        metadata,
        channel,
        status: 'sent',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getNotifications(userId: string, userType: string, limit = 50) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('recipient_id', userId)
    .eq('recipient_type', userType)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function markNotificationAsRead(notificationId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ status: 'read', read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getNotificationPreferences(userId: string, userType: string) {
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .eq('user_type', userType)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function updateNotificationPreferences(
  userId: string,
  userType: string,
  preferences: {
    email_notifications?: boolean;
    sms_notifications?: boolean;
    in_app_notifications?: boolean;
    booking_updates?: boolean;
    payment_updates?: boolean;
    marketing_emails?: boolean;
  }
) {
  const { data, error } = await supabase
    .from('notification_preferences')
    .upsert(
      {
        user_id: userId,
        user_type: userType,
        ...preferences,
      },
      { onConflict: 'user_id,user_type' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// ADMIN ACTIVITY LOG
// ============================================================================

export async function logAdminActivity(
  adminId: string,
  action: string,
  entityType: 'booking' | 'cleaner' | 'payout' | 'customer',
  entityId: string,
  oldValues?: Record<string, any>,
  newValues?: Record<string, any>
) {
  const { data, error } = await supabase
    .from('admin_activity_log')
    .insert([
      {
        admin_id: adminId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        old_values: oldValues,
        new_values: newValues,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}
