-- Northamptonshire Cleaning Marketplace - Supabase Database Schema
-- Run this script in Supabase SQL Editor to set up the MVP database

-- ============================================================================
-- CUSTOMERS TABLE
-- ============================================================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  postcode TEXT NOT NULL,
  full_address TEXT,
  account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'inactive')),
  last_booking_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index on email for faster lookups
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_postcode ON customers(postcode);

-- ============================================================================
-- CLEANERS TABLE
-- ============================================================================
CREATE TABLE cleaners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  postcode TEXT NOT NULL,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  jobs_completed INT DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 0,
  response_time_avg INT COMMENT 'Average response time in minutes',
  cancellation_rate NUMERIC(5, 2) DEFAULT 0 COMMENT 'Percentage',
  monday BOOLEAN DEFAULT true,
  tuesday BOOLEAN DEFAULT true,
  wednesday BOOLEAN DEFAULT true,
  thursday BOOLEAN DEFAULT true,
  friday BOOLEAN DEFAULT true,
  saturday BOOLEAN DEFAULT false,
  sunday BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes on cleaner lookups
CREATE INDEX idx_cleaners_email ON cleaners(email);
CREATE INDEX idx_cleaners_postcode ON cleaners(postcode);
CREATE INDEX idx_cleaners_verification ON cleaners(verification_status);

-- ============================================================================
-- BOOKINGS TABLE
-- ============================================================================
CREATE TABLE bookings (
  id TEXT PRIMARY KEY DEFAULT 'BK-' || to_char(NOW(), 'YYYYMMDDHH24MISS') || '-' || substr(gen_random_uuid()::text, 1, 8),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  cleaner_id UUID REFERENCES cleaners(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'assigned', 'in-progress', 'completed', 'cancelled')),
  service_type TEXT NOT NULL CHECK (service_type IN ('regular-clean', 'deep-clean', 'one-off', 'end-of-tenancy')),
  property_size TEXT NOT NULL CHECK (property_size IN ('studio', 'one-bed', 'two-bed', 'three-bed', 'four-plus')),
  supplies TEXT DEFAULT 'platform' CHECK (supplies IN ('customer', 'platform')),
  frequency TEXT DEFAULT 'once' CHECK (frequency IN ('once', 'weekly', 'biweekly', 'monthly')),
  add_ons TEXT[] DEFAULT '{}',
  total_price NUMERIC(10, 2) NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  customer_notes TEXT,
  scheduled_date_changed BOOLEAN DEFAULT false,
  reschedule_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for booking lookups
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_cleaner ON bookings(cleaner_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(scheduled_date);

-- ============================================================================
-- ADMIN_USERS TABLE
-- ============================================================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'support')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index on email
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- ============================================================================
-- BOOKING_HISTORY TABLE (for audit trail)
-- ============================================================================
CREATE TABLE booking_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for tracking booking changes
CREATE INDEX idx_booking_history_booking ON booking_history(booking_id);
CREATE INDEX idx_booking_history_date ON booking_history(changed_at);

-- ============================================================================
-- CLEANER_RATINGS TABLE (for customer feedback)
-- ============================================================================
CREATE TABLE cleaner_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  cleaner_id UUID NOT NULL REFERENCES cleaners(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for ratings
CREATE INDEX idx_cleaner_ratings_cleaner ON cleaner_ratings(cleaner_id);
CREATE INDEX idx_cleaner_ratings_booking ON cleaner_ratings(booking_id);

-- ============================================================================
-- FUNCTION: Update customer updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_customers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_customers_updated_at();

-- ============================================================================
-- FUNCTION: Update cleaners updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_cleaners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cleaners_updated_at
BEFORE UPDATE ON cleaners
FOR EACH ROW
EXECUTE FUNCTION update_cleaners_updated_at();

-- ============================================================================
-- FUNCTION: Update bookings updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_bookings_updated_at();

-- ============================================================================
-- FUNCTION: Update admin_users updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_admin_users_updated_at
BEFORE UPDATE ON admin_users
FOR EACH ROW
EXECUTE FUNCTION update_admin_users_updated_at();

-- ============================================================================
-- FUNCTION: Record booking status changes in history
-- ============================================================================
CREATE OR REPLACE FUNCTION record_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    INSERT INTO booking_history (booking_id, old_status, new_status)
    VALUES (NEW.id, OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_booking_status_change
AFTER UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION record_booking_status_change();

-- ============================================================================
-- FUNCTION: Update cleaner rating when new rating added
-- ============================================================================
CREATE OR REPLACE FUNCTION update_cleaner_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE cleaners
  SET rating = (
    SELECT AVG(rating)::NUMERIC(3, 2)
    FROM cleaner_ratings
    WHERE cleaner_id = NEW.cleaner_id
  )
  WHERE id = NEW.cleaner_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_cleaner_rating
AFTER INSERT ON cleaner_ratings
FOR EACH ROW
EXECUTE FUNCTION update_cleaner_rating();

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================
-- Uncomment to load sample data for MVP testing

-- INSERT INTO customers (email, first_name, last_name, phone, postcode, full_address)
-- VALUES
--   ('john@example.com', 'John', 'Smith', '07700123456', 'NN1', '42 High Street, Northampton'),
--   ('emma@example.com', 'Emma', 'Rodriguez', '07700654321', 'NN1', '87 Market Road, Northampton');

-- INSERT INTO cleaners (email, first_name, last_name, phone, postcode, verification_status)
-- VALUES
--   ('sarah@example.com', 'Sarah', 'Johnson', '07700111222', 'NN1', 'verified'),
--   ('marcus@example.com', 'Marcus', 'Thompson', '07700333444', 'NN1', 'verified'),
--   ('emma.clean@example.com', 'Emma', 'Rodriguez', '07700555666', 'NN1', 'pending');

-- INSERT INTO admin_users (email, role)
-- VALUES
--   ('steveallan2018@gmail.com', 'admin');

-- ============================================================================
-- CLEANER_BANK_DETAILS TABLE (Encrypted bank account information)
-- ============================================================================
CREATE TABLE cleaner_bank_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cleaner_id UUID NOT NULL UNIQUE REFERENCES cleaners(id) ON DELETE CASCADE,
  account_holder_name TEXT NOT NULL,
  sort_code TEXT NOT NULL,
  account_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index on cleaner_id
CREATE INDEX idx_cleaner_bank_details_cleaner ON cleaner_bank_details(cleaner_id);

-- ============================================================================
-- CLEANER_PAYOUT_SETTINGS TABLE (Payout preferences and rates)
-- ============================================================================
CREATE TABLE cleaner_payout_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cleaner_id UUID NOT NULL UNIQUE REFERENCES cleaners(id) ON DELETE CASCADE,
  compensation_type TEXT DEFAULT 'flat_rate' CHECK (compensation_type IN ('flat_rate', 'hourly', 'percentage')),
  flat_rate_per_job NUMERIC(10, 2),
  hourly_rate NUMERIC(10, 2),
  percentage_of_revenue NUMERIC(5, 2),
  payout_frequency TEXT DEFAULT 'weekly' CHECK (payout_frequency IN ('weekly', 'biweekly', 'monthly')),
  minimum_payout NUMERIC(10, 2) DEFAULT 50,
  last_payout_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index on cleaner_id
CREATE INDEX idx_cleaner_payout_settings_cleaner ON cleaner_payout_settings(cleaner_id);

-- ============================================================================
-- JOB_FINANCIALS TABLE (Detailed financial breakdown per job)
-- ============================================================================
CREATE TABLE job_financials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  customer_payment NUMERIC(10, 2) NOT NULL,
  cleaner_payout NUMERIC(10, 2) NOT NULL,
  platform_fee NUMERIC(10, 2) NOT NULL,
  net_profit NUMERIC(10, 2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('card', 'bank_transfer', 'cash')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'captured', 'failed', 'refunded')),
  stripe_payment_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_job_financials_booking ON job_financials(booking_id);
CREATE INDEX idx_job_financials_payment_status ON job_financials(payment_status);

-- ============================================================================
-- TIME_ENTRIES TABLE (Track scheduled vs actual time)
-- ============================================================================
CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  cleaner_id UUID NOT NULL REFERENCES cleaners(id) ON DELETE CASCADE,
  scheduled_duration INT NOT NULL COMMENT 'Minutes',
  actual_start_time TIMESTAMP WITH TIME ZONE,
  actual_end_time TIMESTAMP WITH TIME ZONE,
  actual_duration INT COMMENT 'Minutes',
  break_duration INT DEFAULT 0 COMMENT 'Minutes',
  notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_time_entries_booking ON time_entries(booking_id);
CREATE INDEX idx_time_entries_cleaner ON time_entries(cleaner_id);
CREATE INDEX idx_time_entries_status ON time_entries(status);

-- ============================================================================
-- CLEANER_PAYOUTS TABLE (Payout batches)
-- ============================================================================
CREATE TABLE cleaner_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cleaner_id UUID NOT NULL REFERENCES cleaners(id) ON DELETE CASCADE,
  payout_period_start DATE NOT NULL,
  payout_period_end DATE NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  num_jobs INT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'processed', 'completed', 'failed')),
  processed_date TIMESTAMP WITH TIME ZONE,
  reference_number TEXT UNIQUE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_cleaner_payouts_cleaner ON cleaner_payouts(cleaner_id);
CREATE INDEX idx_cleaner_payouts_status ON cleaner_payouts(status);
CREATE INDEX idx_cleaner_payouts_period ON cleaner_payouts(payout_period_start, payout_period_end);

-- ============================================================================
-- PAYOUT_ITEMS TABLE (Individual jobs in a payout batch)
-- ============================================================================
CREATE TABLE payout_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payout_id UUID NOT NULL REFERENCES cleaner_payouts(id) ON DELETE CASCADE,
  booking_id TEXT NOT NULL REFERENCES bookings(id),
  job_financials_id UUID NOT NULL REFERENCES job_financials(id),
  amount NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_payout_items_payout ON payout_items(payout_id);
CREATE INDEX idx_payout_items_booking ON payout_items(booking_id);

-- ============================================================================
-- NOTIFICATIONS TABLE (Track all notifications)
-- ============================================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL,
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('customer', 'cleaner', 'admin')),
  notification_type TEXT NOT NULL CHECK (notification_type IN ('booking_confirmed', 'job_assigned', 'job_in_progress', 'job_completed', 'payment_processed', 'payout_approved', 'new_booking')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  channel TEXT DEFAULT 'in-app' CHECK (channel IN ('in-app', 'email', 'sms')),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, recipient_type);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- ============================================================================
-- NOTIFICATION_PREFERENCES TABLE (User notification settings)
-- ============================================================================
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('customer', 'cleaner', 'admin')),
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  in_app_notifications BOOLEAN DEFAULT true,
  booking_updates BOOLEAN DEFAULT true,
  payment_updates BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, user_type)
);

-- Add indexes
CREATE INDEX idx_notification_preferences_user ON notification_preferences(user_id, user_type);

-- ============================================================================
-- ADMIN_ACTIVITY_LOG TABLE (Audit trail)
-- ============================================================================
CREATE TABLE admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admin_users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('booking', 'cleaner', 'payout', 'customer')),
  entity_id TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_admin_activity_log_admin ON admin_activity_log(admin_id);
CREATE INDEX idx_admin_activity_log_entity ON admin_activity_log(entity_type, entity_id);
CREATE INDEX idx_admin_activity_log_created ON admin_activity_log(created_at);

-- ============================================================================
-- UPDATE TRIGGERS FOR NEW TABLES
-- ============================================================================

CREATE OR REPLACE FUNCTION update_cleaner_bank_details_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cleaner_bank_details_updated_at
BEFORE UPDATE ON cleaner_bank_details
FOR EACH ROW
EXECUTE FUNCTION update_cleaner_bank_details_updated_at();

CREATE OR REPLACE FUNCTION update_cleaner_payout_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cleaner_payout_settings_updated_at
BEFORE UPDATE ON cleaner_payout_settings
FOR EACH ROW
EXECUTE FUNCTION update_cleaner_payout_settings_updated_at();

CREATE OR REPLACE FUNCTION update_job_financials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_job_financials_updated_at
BEFORE UPDATE ON job_financials
FOR EACH ROW
EXECUTE FUNCTION update_job_financials_updated_at();

CREATE OR REPLACE FUNCTION update_time_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_time_entries_updated_at
BEFORE UPDATE ON time_entries
FOR EACH ROW
EXECUTE FUNCTION update_time_entries_updated_at();

CREATE OR REPLACE FUNCTION update_cleaner_payouts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cleaner_payouts_updated_at
BEFORE UPDATE ON cleaner_payouts
FOR EACH ROW
EXECUTE FUNCTION update_cleaner_payouts_updated_at();

CREATE OR REPLACE FUNCTION update_notification_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notification_preferences_updated_at
BEFORE UPDATE ON notification_preferences
FOR EACH ROW
EXECUTE FUNCTION update_notification_preferences_updated_at();
