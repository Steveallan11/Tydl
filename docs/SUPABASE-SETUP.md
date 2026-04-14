# Supabase Setup Guide - Tydl MVP

This guide walks you through setting up the Supabase database for the Northamptonshire Cleaning Marketplace MVP.

## Prerequisites

- Supabase account (already created at https://dqwjunoszmzedleqnqmb.supabase.co)
- Supabase credentials:
  - Project URL: `https://dqwjunoszmzedleqnqmb.supabase.co`
  - Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxd2p1bm9zem16ZWRsZXFucW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMTEzNjMsImV4cCI6MjA5MTY4NzM2M30.cj-huqFrXULWoyCOHl5U62mWg9dHLA0XkD4Bg_Q8UYM`

## Step 1: Run Database Schema Script

1. Go to your Supabase project dashboard: https://dqwjunoszmzedleqnqmb.supabase.co
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `docs/supabase-schema.sql`
5. Paste into the SQL editor
6. Click **Run** or press `Ctrl+Enter`
7. Wait for all tables to be created successfully

**Expected Output:**
- ✅ `customers` table created
- ✅ `cleaners` table created
- ✅ `bookings` table created
- ✅ `admin_users` table created
- ✅ `booking_history` table created
- ✅ `cleaner_ratings` table created
- ✅ All indexes created
- ✅ All triggers and functions created

## Step 2: Load Sample Data (Optional)

To test with sample data, uncomment the sample data section at the bottom of `supabase-schema.sql` and run it again. This will create:

**Sample Customers:**
- john@example.com (John Smith)
- emma@example.com (Emma Rodriguez)

**Sample Cleaners:**
- sarah@example.com (Sarah Johnson - verified)
- marcus@example.com (Marcus Thompson - verified)
- emma.clean@example.com (Emma Rodriguez - pending)

**Sample Admin:**
- steveallan2018@gmail.com (role: admin)

## Step 3: Create Auth Users (Manual)

The schema creates the data tables, but you also need to set up authentication users in Supabase Auth:

### For Customers:
1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click **Invite**
3. Enter customer email (e.g., `john@example.com`)
4. A confirmation link will be sent
5. Repeat for each customer

### For Cleaners:
1. Same process as customers
2. Use cleaner emails (e.g., `sarah@example.com`)

### For Admins:
1. Go to **Authentication** → **Users**
2. Invite `steveallan2018@gmail.com` with admin role
3. After signup, manually set role in `admin_users` table

## Step 4: Set Environment Variables

Update your `.env.local` file with Supabase credentials:

```env
VITE_SUPABASE_URL=https://dqwjunoszmzedleqnqmb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxd2p1bm9zem16ZWRsZXFucW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMTEzNjMsImV4cCI6MjA5MTY4NzM2M30.cj-huqFrXULWoyCOHl5U62mWg9dHLA0XkD4Bg_Q8UYM
```

## Step 5: Add Environment Variables to Vercel

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   ```
   VITE_SUPABASE_URL=https://dqwjunoszmzedleqnqmb.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxd2p1bm9zem16ZWRsZXFucW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMTEzNjMsImV4cCI6MjA5MTY4NzM2M30.cj-huqFrXULWoyCOHl5U62mWg9dHLA0XkD4Bg_Q8UYM
   ```
4. Redeploy the application

## Step 6: Configure Row-Level Security (RLS) - Phase 2

For production, you'll need to set up RLS policies. For MVP, these can be enabled later:

**Policies to create:**
- Customers can only see their own bookings
- Cleaners can only see assigned jobs
- Admins can see all bookings and manage assignments

**RLS setup will be added in Phase 2 after initial MVP testing**

## Database Schema Overview

### Customers Table
- `id` (UUID) - Primary key
- `email` - Unique email address
- `first_name`, `last_name` - Customer name
- `phone` - Contact phone
- `postcode` - Service area
- `full_address` - Full delivery address
- `created_at`, `updated_at` - Timestamps

### Cleaners Table
- `id` (UUID) - Primary key
- `email` - Unique email address
- `first_name`, `last_name` - Cleaner name
- `phone` - Contact phone
- `postcode` - Service area
- `verification_status` - 'pending', 'verified', or 'rejected'
- `jobs_completed` - Count of completed jobs
- `rating` - Average rating (0-5)
- `monday-sunday` - Availability per day
- `created_at`, `updated_at` - Timestamps

### Bookings Table
- `id` (TEXT) - Booking ID (e.g., BK-202604151400...)
- `customer_id` (UUID) - Reference to customer
- `cleaner_id` (UUID) - Reference to assigned cleaner
- `status` - Booking status (pending, confirmed, assigned, in-progress, completed, cancelled)
- `service_type` - Type of cleaning service
- `property_size` - Property size (studio to four-plus)
- `supplies` - 'customer' or 'platform' provided
- `frequency` - Booking frequency
- `add_ons` - Array of add-on services
- `total_price` - Total booking price
- `scheduled_date`, `scheduled_time` - When the clean is scheduled
- `customer_notes` - Any special notes
- `created_at`, `updated_at` - Timestamps

### Admin Users Table
- `id` (UUID) - Primary key
- `email` - Unique admin email
- `role` - 'admin' or 'support'
- `created_at`, `updated_at` - Timestamps

### Booking History Table
- Audit trail of all booking status changes
- Records old_status → new_status transitions

### Cleaner Ratings Table
- Customer feedback and ratings per booking
- Automatically updates cleaner's average rating

## Verifying the Setup

1. Go to **Table Editor** in Supabase
2. You should see all 6 tables:
   - ✅ customers
   - ✅ cleaners
   - ✅ bookings
   - ✅ admin_users
   - ✅ booking_history
   - ✅ cleaner_ratings

3. Run a test query in **SQL Editor**:
```sql
SELECT COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public';
```

Should return `6` (or more if you have other tables).

## Next Steps

1. **Phase 2: Migrate mock implementations to Supabase**
   - Update `BookingContext` to use Supabase queries
   - Update `CustomerAuthContext` to use Supabase Auth
   - Update `CleanerAuthContext` to use Supabase Auth
   - Update `AdminContext` to use Supabase queries

2. **Phase 3: Set up RLS policies**
   - Implement row-level security for data access
   - Ensure users can only see their own data

3. **Phase 4: Testing**
   - Test end-to-end flows with real database
   - Verify booking creation, assignment, completion

## Troubleshooting

**Issue: Tables not created**
- Check for SQL errors in the editor
- Ensure you have the right permissions
- Try creating tables one at a time

**Issue: Anon key not working**
- Verify the key in `.env.local` matches Supabase
- Check Supabase API settings
- Re-generate API key if needed

**Issue: RLS errors**
- RLS is not enabled by default for MVP
- Will be configured in Phase 2

## References

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase SQL Guide](https://supabase.com/docs/guides/sql)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
