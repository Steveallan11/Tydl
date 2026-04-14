# Phase 5: Supabase Migration Plan

This document outlines the migration from mock/localStorage implementations to Supabase database integration.

## Overview

**Phase 4 (Current):** Complete UI with mock data and localStorage
**Phase 5 (Next):** Replace mock implementations with Supabase queries

## What Will Change

### 1. CustomerAuthContext (`src/context/CustomerAuthContext.tsx`)

**Current (Mock):**
```typescript
// Uses localStorage for customer auth
const mockSignUp = async (email, password, ...) => {
  // Save to localStorage
}
```

**After Phase 5 (Supabase):**
```typescript
// Use Supabase Auth + customers table
const signup = async (email, password, firstName, lastName, postcode, phone) => {
  // 1. Create auth user via Supabase Auth
  // 2. Create customer record in customers table
  // 3. Store session in Supabase
}
```

**Files to Update:**
- `src/context/CustomerAuthContext.tsx` - Replace mock functions with Supabase Auth + queries
- `src/lib/supabase.ts` - Update customer functions to use real Supabase API

---

### 2. CleanerAuthContext (`src/context/CleanerAuthContext.tsx`)

**Current (Mock):**
```typescript
// Uses localStorage for cleaner auth
const mockSignUp = async (email, password, ...) => {
  // Save to localStorage
}
```

**After Phase 5 (Supabase):**
```typescript
// Use Supabase Auth + cleaners table
const signup = async (email, password, firstName, lastName, phone, postcode) => {
  // 1. Create auth user via Supabase Auth
  // 2. Create cleaner record in cleaners table
  // 3. Set verification_status to 'pending'
}
```

**Files to Update:**
- `src/context/CleanerAuthContext.tsx` - Replace mock functions with Supabase queries
- `src/lib/supabase.ts` - Update cleaner functions

---

### 3. BookingContext (`src/context/BookingContext.tsx`)

**Current (Mock):**
```typescript
// Saves booking to localStorage
const submitBooking = async (formData) => {
  localStorage.setItem('booking:' + id, JSON.stringify(booking));
}
```

**After Phase 5 (Supabase):**
```typescript
// Save booking to database
const submitBooking = async (formData) => {
  // 1. Insert booking into bookings table
  // 2. Send email via Resend API (already working)
  // 3. Return booking ID and status
}
```

**Files to Update:**
- `src/context/BookingContext.tsx` - Replace localStorage with Supabase insert
- `src/lib/supabase.ts` - Add `createBooking()` function

---

### 4. AdminContext (`src/context/AdminContext.tsx`)

**Current (Mock):**
```typescript
// Loads from mock data
const getAllBookings = () => {
  return MOCK_BOOKINGS;
}
```

**After Phase 5 (Supabase):**
```typescript
// Load from database
const getAllBookings = async () => {
  // Query bookings table with joins to customers and cleaners
  // Apply filters by status
}
```

**Files to Update:**
- `src/context/AdminContext.tsx` - Replace mock data with Supabase queries
- `src/lib/supabase.ts` - Ensure admin functions are complete

---

### 5. Customer Pages Data

**Pages to Update:**
- `src/pages/customer/Dashboard.tsx` - Load actual bookings from Supabase
- `src/pages/customer/MyBookings.tsx` - Query bookings table
- `src/pages/customer/Account.tsx` - Load/update customer profile from database

**Changes:**
- Replace hardcoded mock bookings with real data from database
- Show actual customer information
- Real-time updates when data changes

---

### 6. Cleaner Pages Data

**Pages to Update:**
- `src/pages/cleaner/JobsPortal.tsx` - Load assigned jobs from database
- `src/pages/cleaner/Profile.tsx` - Load/update cleaner profile from database

**Changes:**
- Load jobs assigned to logged-in cleaner
- Load cleaner availability from database
- Update availability when cleaner saves changes
- Show actual job details instead of mocks

---

### 7. Admin Pages Data

**Pages to Update:**
- `src/pages/admin/Dashboard.tsx` - Load real bookings and stats
- `src/pages/admin/BookingBoard.tsx` - Load bookings, update status, assign cleaners

**Changes:**
- Show all bookings from database
- Real-time status updates
- Drag-to-assign cleaners
- Calculate real stats (pending, assigned, completed counts)

---

## Implementation Order

### Step 1: Auth Migration (Week 1)
1. Update `CustomerAuthContext` to use Supabase Auth
2. Test customer signup/login with real database
3. Update `CleanerAuthContext` to use Supabase Auth
4. Test cleaner signup/login

### Step 2: Customer Data Migration (Week 2)
1. Update `BookingContext` to save to database
2. Update customer pages to load real data
3. Test full booking flow: create → confirm → complete

### Step 3: Cleaner Data Migration (Week 2)
1. Update cleaner pages to load jobs from database
2. Update job status handlers to save to database
3. Test cleaner accepting, starting, completing jobs

### Step 4: Admin Data Migration (Week 3)
1. Update admin context to load from database
2. Update admin pages to show real data
3. Test assignment and status updates

### Step 5: Testing & Polish (Week 4)
1. End-to-end testing with real database
2. Fix any data sync issues
3. Optimize queries with indexes
4. Set up RLS policies for production

---

## Supabase Functions to Implement

All these functions go in `src/lib/supabase.ts`:

### Customer Functions
```typescript
// Authentication
signUpCustomer(email, password, firstName, lastName, postcode, phone)
signInCustomer(email, password)
signOutCustomer()
getCurrentCustomer()
updateCustomerProfile(customerId, data)

// Bookings
getCustomerBookings(customerId)
getBookingById(bookingId)
```

### Cleaner Functions
```typescript
// Authentication
signUpCleaner(email, password, firstName, lastName, phone, postcode)
signInCleaner(email, password)
signOutCleaner()
getCurrentCleaner()
updateCleanerProfile(cleanerId, data)

// Jobs
getCleanerJobs(cleanerId)
updateJobStatus(jobId, newStatus)
getJobById(jobId)
```

### Admin Functions
```typescript
// Authentication
signInAdmin(email, password)
getCurrentAdmin()

// Bookings
getAllBookings()
getBookingsByStatus(status)
getBookingsForDate(date)
assignCleanerToBooking(bookingId, cleanerId)
updateBookingStatus(bookingId, newStatus)

// Stats
getDashboardStats()
getCleanerStats(cleanerId)
```

### Shared Functions
```typescript
// General
createBooking(data)
getCleaners()
getCleanerById(cleanerId)
getAvailableCleaners(date, postcode)
```

---

## Database Queries Needed

### Get all pending bookings
```sql
SELECT b.*, c.first_name, c.email
FROM bookings b
JOIN customers c ON b.customer_id = c.id
WHERE b.status = 'pending'
ORDER BY b.created_at DESC
```

### Get cleaner's assigned jobs
```sql
SELECT b.*, c.first_name, c.email
FROM bookings b
JOIN customers c ON b.customer_id = c.id
WHERE b.cleaner_id = $1 AND b.status IN ('confirmed', 'assigned', 'in-progress')
ORDER BY b.scheduled_date ASC
```

### Get available cleaners for assignment
```sql
SELECT *
FROM cleaners
WHERE verification_status = 'verified'
  AND postcode = $1
  AND TO_CHAR(NOW(), 'Day') = $2
  AND jobs_completed < 50
ORDER BY rating DESC
```

---

## Error Handling

Each context should handle:
- **Auth errors**: Invalid credentials, user already exists
- **Database errors**: Connection issues, constraint violations
- **Network errors**: Timeout, offline mode
- **Validation errors**: Invalid data format

Example:
```typescript
try {
  const user = await supabase.auth.signUp({...})
  // Handle success
} catch (error) {
  if (error.code === 'user_already_exists') {
    setError('Email already registered')
  } else {
    setError('Sign up failed. Please try again.')
  }
}
```

---

## Testing Strategy

### Unit Tests
- Test each supabase function with mock data
- Verify error handling

### Integration Tests
- Test signup → login → booking → job assignment flow
- Test admin operations (view bookings, assign cleaners)
- Test cleaner operations (accept job, mark complete)

### Manual Testing
- Test in browser with real Supabase database
- Verify data persists across page reloads
- Test with multiple browsers/devices
- Test error scenarios (network down, invalid data)

---

## Rollback Plan

If issues occur during migration:
1. Keep mock implementations in separate branch
2. Use feature flags to toggle between mock and real data
3. Test new code in staging before production

Example feature flag:
```typescript
const USE_SUPABASE = process.env.VITE_USE_SUPABASE === 'true'

if (USE_SUPABASE) {
  // Use Supabase
} else {
  // Use mock data
}
```

---

## RLS (Row-Level Security) Setup

After Phase 5, set up RLS policies:

### Customers
```sql
CREATE POLICY customer_read
ON customers
FOR SELECT
USING (auth.uid() = id)
```

### Cleaners
```sql
CREATE POLICY cleaner_read
ON cleaners
FOR SELECT
USING (auth.uid() = id)
```

### Bookings
```sql
-- Customers see own bookings
CREATE POLICY customer_bookings
ON bookings
FOR SELECT
USING (
  (auth.role() = 'authenticated' AND customer_id = auth.uid())
  OR auth.role() = 'admin'
)

-- Cleaners see assigned jobs
CREATE POLICY cleaner_jobs
ON bookings
FOR SELECT
USING (
  (auth.role() = 'authenticated' AND cleaner_id = auth.uid())
  OR auth.role() = 'admin'
)
```

---

## Timeline Estimate

- **Phase 5a: Auth** - 1 week
- **Phase 5b: Customer Data** - 1 week
- **Phase 5c: Cleaner Data** - 1 week
- **Phase 5d: Admin Data** - 1 week
- **Phase 5e: Testing** - 1 week

**Total: 5 weeks for full Supabase integration**

---

## Success Criteria

✅ All auth flows work with Supabase
✅ Bookings persist in database
✅ Cleaner job assignments work
✅ Admin can manage bookings
✅ Data syncs across browser sessions
✅ No TypeScript errors in build
✅ All CRUD operations work
✅ Error handling is user-friendly
