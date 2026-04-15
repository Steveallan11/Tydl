// Payment and financial types

export type CompensationType = 'flat_rate' | 'hourly' | 'percentage';
export type PayoutFrequency = 'weekly' | 'biweekly' | 'monthly';
export type PaymentMethod = 'card' | 'bank_transfer' | 'cash';
export type PaymentStatus = 'pending' | 'captured' | 'failed' | 'refunded';
export type PayoutStatus = 'pending' | 'approved' | 'processed' | 'completed' | 'failed';
export type TimeEntryStatus = 'scheduled' | 'in-progress' | 'completed';

export interface CleanerBankDetails {
  id: string;
  cleaner_id: string;
  account_holder_name: string;
  sort_code: string;
  account_number: string;
  created_at: string;
  updated_at: string;
}

export interface CleanerPayoutSettings {
  id: string;
  cleaner_id: string;
  compensation_type: CompensationType;
  flat_rate_per_job?: number;
  hourly_rate?: number;
  percentage_of_revenue?: number;
  payout_frequency: PayoutFrequency;
  minimum_payout: number;
  last_payout_date?: string;
  created_at: string;
  updated_at: string;
}

export interface JobFinancials {
  id: string;
  booking_id: string;
  customer_payment: number;
  cleaner_payout: number;
  platform_fee: number;
  net_profit: number;
  payment_method?: PaymentMethod;
  payment_status: PaymentStatus;
  stripe_payment_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TimeEntry {
  id: string;
  booking_id: string;
  cleaner_id: string;
  scheduled_duration: number; // minutes
  actual_start_time?: string;
  actual_end_time?: string;
  actual_duration?: number; // minutes
  break_duration: number; // minutes
  notes?: string;
  status: TimeEntryStatus;
  created_at: string;
  updated_at: string;
}

export interface CleanerPayout {
  id: string;
  cleaner_id: string;
  payout_period_start: string;
  payout_period_end: string;
  total_amount: number;
  num_jobs: number;
  status: PayoutStatus;
  processed_date?: string;
  reference_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PayoutItem {
  id: string;
  payout_id: string;
  booking_id: string;
  job_financials_id: string;
  amount: number;
  created_at: string;
}

export type NotificationType =
  | 'booking_confirmed'
  | 'job_assigned'
  | 'job_in_progress'
  | 'job_completed'
  | 'payment_processed'
  | 'payout_approved'
  | 'new_booking';

export type NotificationChannel = 'in-app' | 'email' | 'sms';
export type NotificationStatus = 'sent' | 'delivered' | 'read' | 'failed';

export interface Notification {
  id: string;
  recipient_id: string;
  recipient_type: 'customer' | 'cleaner' | 'admin';
  notification_type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  channel: NotificationChannel;
  status: NotificationStatus;
  sent_at: string;
  read_at?: string;
  created_at: string;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  user_type: 'customer' | 'cleaner' | 'admin';
  email_notifications: boolean;
  sms_notifications: boolean;
  in_app_notifications: boolean;
  booking_updates: boolean;
  payment_updates: boolean;
  marketing_emails: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminActivityLog {
  id: string;
  admin_id: string;
  action: string;
  entity_type: 'booking' | 'cleaner' | 'payout' | 'customer';
  entity_id: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

// Financial summary for dashboard
export interface FinancialSummary {
  total_revenue: number;
  total_payouts: number;
  net_profit: number;
  pending_amount: number;
  payment_methods: {
    card: number;
    bank_transfer: number;
    cash: number;
  };
}

// Payout calculation result
export interface PayoutCalculation {
  cleaner_id: string;
  period_start: string;
  period_end: string;
  jobs: Array<{
    booking_id: string;
    job_amount: number;
  }>;
  total_amount: number;
  compensation_type: CompensationType;
}
