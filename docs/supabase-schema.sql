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
