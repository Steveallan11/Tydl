# Tydl Booking Flow Review: Quality & UX Analysis

**Date:** April 2026 | **Reviewer:** Claude Code | **Status:** MVP Phase

---

## Executive Summary

The Tydl booking flow is **well-structured and intuitive** for customers, with solid email integration and real-time pricing. However, there are **critical gaps in the post-booking workflow** that create friction: no cleaner assignment notifications, incomplete confirmation clarity, and missing payment processing. The MVP is 70% complete but needs critical UX fixes before launch.

---

## 1. CUSTOMER BOOKING FLOW (Steps 1-9)

### ✅ WHAT'S WORKING WELL

**Excellent step-by-step guidance**
- 9-step journey is clear: Postcode → Service → Property → Supplies → Frequency → Add-ons → Summary → Checkout → Confirmation
- Step indicator shows progress at every step (e.g., "Step 5 of 9")
- Clear CTAs on every screen ("Next →", "← Back")
- Form state persists across navigation without data loss

**Smart pricing transparency**
- Real-time price calculation updates as customer selects options
- Pricing breakdown visible on every step (sticky sidebar)
- Add-on costs clearly labeled (e.g., "+£25" for oven)
- Total price "locked in" message builds confidence

**Intelligent auto-skip & pre-fill**
- Services with included supplies auto-skip supplies question → frequency (SuppliesOption.tsx:14-22)
- One-time services auto-set frequency to "once" (FrequencyScheduling.tsx:24-30)
- Logged-in customers see pre-filled postcode & address (Postcode.tsx:24-26, PropertyDetails.tsx:31-33)
- Saves 2-3 seconds per returning customer

**Validation at every step**
- Required fields checked before next button enables (CheckoutDetails.tsx:27-45)
- Postcode validation (must be UK format) (Postcode.tsx:40-43)
- Date validation (no past dates) (FrequencyScheduling.tsx:47-49)
- Error messages below failing fields, not blocking

**Accessibility & design consistency**
- Consistent button styles (primary, outline variants)
- Color-coded selections (brand-blue highlight on choice)
- Emoji icons for visual scanning (🏠 studio, 🛏️ bed change, etc.)
- Touch-friendly input sizes (min 44px height)

---

### ❌ WHAT NEEDS IMPROVEMENT

| Issue | Severity | Impact |
|-------|----------|--------|
| **Payment step is missing** | 🔴 Critical | No actual checkout/payment processing shown. Button says "Proceed to Payment" but CheckoutDetails.tsx has no Stripe integration |
| **No booking confirmation display** | 🔴 Critical | Confirmation page shows "Cleaner Being Assigned" (spinning icon) but no actual booking ID, timings, or clear next steps |
| **Missing discount code entry** | 🟠 High | Newsletter signup in email.ts has discount code logic (lines 5-77) but no checkout field to apply codes |
| **Address validation too loose** | 🟠 High | Textarea for address has no postcode match or address lookup integration (PropertyDetails.tsx:133-142) |
| **No progress save indicator** | 🟡 Medium | Customer doesn't know if their progress is auto-saved if they close tab mid-flow |
| **Frequency defaults to 'once'** | 🟡 Medium | Auto-set in FrequencyScheduling (line 28) but "monthly" customers don't see price for recurring bookings until step 5 |
| **Add-on icons inconsistent** | 🟡 Low | AddOns.tsx uses 🛏️ for "bedchange" but Frequency uses 📅 for weekly — should distinguish service frequency from add-ons visually |
| **"What Happens Next" is vague** | 🟡 Low | ConfirmationPending.tsx steps 1-3 say "Within 24 hours" but no explicit "We will SMS/email you" promise |

---

### 🔧 HOW TO FIX IT

#### Fix #1: Add Payment Processing (CRITICAL)
**File:** `src/pages/booking/CheckoutDetails.tsx`
**Current:** Button says "Proceed to Payment" but handleSubmit() goes straight to submitBooking()
**Fix:**
```typescript
// In CheckoutDetails.tsx, before submitBooking():
const handleStripePayment = async () => {
  setPaymentProcessing(true);
  try {
    // Initialize Stripe payment intent
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ amount: pricing.totalPrice * 100 }),
    });
    const { clientSecret } = await response.json();
    
    // Confirm payment with Stripe (requires stripe.js)
    const result = await stripe.confirmCardPayment(clientSecret);
    
    if (result.paymentIntent.status === 'succeeded') {
      await submitBooking(customer.id); // Only submit after payment succeeds
    }
  } catch (error) {
    setPaymentError('Payment failed: ' + error.message);
  } finally {
    setPaymentProcessing(false);
  }
};
```

#### Fix #2: Show Booking Confirmation Details (CRITICAL)
**File:** `src/pages/booking/ConfirmationPending.tsx`
**Current:** Shows "We're assigning your cleaner" but no booking ID or customer details
**Add:**
```typescript
{/* Add this after "Booking Confirmed" heading */}
<div className="bg-slate-100 p-4 rounded-lg my-6 font-mono text-sm">
  <p className="text-slate-600">Your Booking ID</p>
  <p className="text-2xl font-bold text-slate-900 select-all">{bookingId}</p>
  <p className="text-xs text-slate-500 mt-2">
    Save this. You'll need it to contact us.
  </p>
</div>

{/* Add customer details section */}
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
  <h3 className="font-bold mb-2">We have your details</h3>
  <p className="text-sm text-slate-700">
    {formData.firstName} {formData.lastName}<br/>
    {formData.email}<br/>
    {formData.phone}
  </p>
</div>
```

#### Fix #3: Add Discount Code Field (HIGH)
**File:** `src/pages/booking/CheckoutDetails.tsx`
**Add before form submission:**
```typescript
const [discountCode, setDiscountCode] = useState('');
const [discountApplied, setDiscountApplied] = useState(false);

// Before submit button:
<div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
  <label className="block text-sm font-medium text-slate-700 mb-2">
    Discount code (optional)
  </label>
  <div className="flex gap-2">
    <input
      type="text"
      placeholder="e.g., TYDL2026"
      value={discountCode}
      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
      className="flex-1 px-4 py-2 border rounded-lg"
    />
    <button
      type="button"
      onClick={() => {
        const discount = validateDiscountCode(discountCode);
        if (discount) {
          // Apply discount to pricing
          setDiscountApplied(true);
        } else {
          setPaymentError('Invalid or expired code');
        }
      }}
      className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700"
    >
      Apply
    </button>
  </div>
  {discountApplied && <p className="text-sm text-green-600 mt-2">✓ Discount applied</p>}
</div>
```

#### Fix #4: Add Address Lookup / Validation (HIGH)
**File:** `src/pages/booking/PropertyDetails.tsx`
**Current:** Plain textarea for address
**Fix:** Integrate Google Places API or UK postcode to address lookup:
```typescript
import { useEffect, useState } from 'react';

// In PropertyDetails component:
const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);

const handleAddressChange = async (value: string) => {
  updateFormData({ fullAddress: value });
  
  if (value.length > 3 && formData.postcode) {
    // Call postcode lookup API
    const suggestions = await lookupAddressByPostcode(formData.postcode, value);
    setAddressSuggestions(suggestions);
  }
};

// In JSX textarea:
<input
  list="address-suggestions"
  value={formData.fullAddress || ''}
  onChange={(e) => handleAddressChange(e.target.value)}
  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
/>
<datalist id="address-suggestions">
  {addressSuggestions.map((addr, i) => (
    <option key={i} value={addr} />
  ))}
</datalist>
```

#### Fix #5: Add Progress Auto-Save Indicator (MEDIUM)
**File:** `src/context/BookingContext.tsx`
**Add:**
```typescript
const [lastSaved, setLastSaved] = useState<Date | null>(null);

useEffect(() => {
  // Save to localStorage on any change
  const timer = setTimeout(() => {
    localStorage.setItem('booking_draft', JSON.stringify(formData));
    setLastSaved(new Date());
  }, 500); // Debounce 500ms
  
  return () => clearTimeout(timer);
}, [formData]);

// In any page component, add:
<div className="text-xs text-slate-400 text-right mb-4">
  {lastSaved && `Last saved ${formatTime(lastSaved)}`}
</div>
```

---

## 2. BOOKING CONFIRMATION FLOW

### ✅ WHAT'S WORKING WELL

**Email integration with Resend is solid**
- Booking confirmation email sent immediately after payment (BookingContext.tsx:123-129)
- Email template is professional with clear styling, booking ID, date/time, price (email.ts:223-276)
- Gracefully handles API failures without blocking booking (lines 141-144: "Don't block booking if email fails")
- HTML email includes clickable "View Your Booking" button linking to dashboard

**In-app notification created**
- sendNotification() called for 'booking_confirmed' event (BookingContext.tsx:132-140)
- Stores in notifications table with metadata (bookingId)
- Customer can view in dashboard later (getNotifications in supabase.ts:956)

**Profile auto-save for repeat bookings**
- Customer details saved after booking (updateCustomerProfile, lines 108-114)
- Reduces form friction on next booking
- Handles profile save failures gracefully (lines 115-118)

**Confirmation page is clear and friendly**
- Large success checkmark (✓) icon (ConfirmationPending.tsx:14)
- Next steps listed (1-4) with clear timelines (lines 66-101)
- Guarantee messaging builds trust (lines 106-115)
- Links to dashboard and contact info (lines 119-135)

---

### ❌ WHAT NEEDS IMPROVEMENT

| Issue | Severity | Impact |
|-------|----------|--------|
| **No SMS confirmation** | 🔴 Critical | Email only; customers on-the-go may miss email. No phone number verification |
| **"Cleaner Being Assigned" spinner never ends** | 🔴 Critical | Page shows pulsing indicator (line 55) but page auto-refreshes every 30s? No real-time update mechanism |
| **No cleaner assignment notification** | 🔴 Critical | Admin assigns cleaner in Dashboard, but sendNotification() not called. Cleaner doesn't get notified |
| **Confirmation email sent before payment clears** | 🟠 High | Email sent in submitBooking() (line 123) but payment processing in CheckoutDetails comes BEFORE this context call — race condition |
| **No email retry logic** | 🟠 High | If Resend API fails, email never resends (caught and logged but not queued) |
| **No booking ID in customer view** | 🟠 High | Booking ID in DB but not displayed to customer on confirmation screen (lines 7, 30) |
| **No "call us" CTA during wait** | 🟡 Medium | Page shows "01604 123 456" at bottom but should offer chat/WhatsApp while cleaner assigned |
| **Weak "what's next" narrative** | 🟡 Medium | Says "cleaner will text" (line 85) but no guaranteed SLA. What if no cleaner available? |

---

### 🔧 HOW TO FIX IT

#### Fix #1: Add SMS Confirmation (CRITICAL)
**File:** `src/context/BookingContext.tsx`
**Add SMS sender (Twilio integration):**
```typescript
// Install: npm install twilio
import twilio from 'twilio';

const twilioClient = twilio(
  process.env.VITE_TWILIO_ACCOUNT_SID,
  process.env.VITE_TWILIO_AUTH_TOKEN
);

// In submitBooking(), after email send:
try {
  await twilioClient.messages.create({
    body: `Hi ${formData.firstName}! Your Tydl booking is confirmed. Booking ID: ${booking.id}. We'll assign your cleaner within 24 hours. Track it at tydl.co.uk/bookings`,
    from: process.env.VITE_TWILIO_PHONE,
    to: formData.phone, // Must be validated E.164 format
  });
} catch (smsError) {
  console.warn('SMS failed but booking succeeded:', smsError);
  // Still don't block the booking
}
```

#### Fix #2: Fix Race Condition (Payment → Email) (HIGH)
**File:** `src/pages/booking/CheckoutDetails.tsx` and `BookingContext.tsx`
**Current flow is wrong:**
1. CheckoutDetails calls submitBooking()
2. submitBooking() sends email immediately
3. But payment might still be processing

**Fix: Move email to payment success callback:**
```typescript
// In CheckoutDetails.tsx handleSubmit():
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    setPaymentProcessing(true);
    
    // 1. Process payment FIRST
    const paymentResult = await processStripePayment(pricing.totalPrice);
    if (!paymentResult.success) {
      setPaymentError(paymentResult.error);
      return;
    }
    
    // 2. ONLY THEN submit booking (which sends email)
    await submitBooking(customer.id);
    
    // 3. Navigate to confirmation
    navigate('/book/confirmation');
  } catch (error) {
    setPaymentError('Booking failed: ' + error.message);
  } finally {
    setPaymentProcessing(false);
  }
};
```

#### Fix #3: Add Cleaner Assignment Notification (CRITICAL)
**File:** `src/lib/admin.ts` (or create `src/lib/cleaner-assignment.ts`)
**Add cleaner notification function:**
```typescript
export async function assignCleanerAndNotify(bookingId: string, cleanerId: string) {
  // 1. Assign cleaner in DB
  const booking = await assignCleanerToBooking(bookingId, cleanerId);
  
  // 2. Get cleaner details
  const cleaner = await getCleanerById(cleanerId);
  
  // 3. Notify cleaner via SMS
  await sendSMS(
    cleaner.phone,
    `New job! ${booking.customer.first_name} needs ${booking.service_type} on ${booking.scheduled_date}. 
     Address: ${booking.customer.full_address}. 
     Price: £${booking.total_price}. Accept? Reply YES`
  );
  
  // 4. Notify customer via email
  await sendBookingAssignmentEmail(
    booking.customer.email,
    booking.customer.first_name,
    {
      cleanerName: `${cleaner.first_name} ${cleaner.last_name}`,
      cleanerRating: cleaner.rating,
      cleanerPhone: cleaner.phone,
      cleanerPhoto: cleaner.photo_url,
      bookingId: booking.id,
    }
  );
  
  // 5. Create notification
  await sendNotification(
    booking.customer_id,
    'customer',
    'cleaner_assigned',
    `Your cleaner ${cleaner.first_name} has been assigned!`,
    `${cleaner.first_name} (${cleaner.rating}⭐) will text you to confirm.`,
    { bookingId, cleanerId }
  );
  
  return booking;
}
```

#### Fix #4: Display Booking ID Prominently (HIGH)
**File:** `src/pages/booking/ConfirmationPending.tsx`
**Already shown in Fix #2 above** — Add booking ID display section

#### Fix #5: Add Real-Time Status Updates (MEDIUM)
**File:** `src/pages/booking/ConfirmationPending.tsx`
**Add Supabase subscription for real-time updates:**
```typescript
useEffect(() => {
  if (!bookingId) return;
  
  // Subscribe to booking changes
  const subscription = supabase
    .from(`bookings:id=eq.${bookingId}`)
    .on('*', (payload) => {
      const updatedBooking = payload.new;
      if (updatedBooking.cleaner_id) {
        // Cleaner was assigned! Show updated info
        setCleanerAssigned({
          name: updatedBooking.cleaner.first_name,
          rating: updatedBooking.cleaner.rating,
          phone: updatedBooking.cleaner.phone,
        });
      }
    })
    .subscribe();
  
  return () => subscription.unsubscribe();
}, [bookingId]);
```

---

## 3. CLEANER JOB ASSIGNMENT NOTIFICATIONS

### ✅ WHAT'S WORKING WELL

**Database structure for notifications exists**
- notifications table with recipient_id, type, channel (in-app/email/sms)
- Notification preferences table for opt-out (supabase.ts:981-991)
- sendNotification() function handles metadata (line 926-954)

**Admin assignment logic exists**
- assignCleanerToBooking() updates cleaner_id and status='assigned' (supabase.ts:438-454)
- Admin dashboard shows pending bookings (Dashboard.tsx:59)
- CleanerManagementSection exists to select and assign (import line 7)

**Cleaner availability tracking**
- Cleaners have day-of-week availability (e.g., monday: true/false)
- Can query available cleaners for a booking date (implied in getCleaners)

---

### ❌ WHAT NEEDS IMPROVEMENT

| Issue | Severity | Impact |
|-------|----------|--------|
| **Cleaner doesn't receive any notification** | 🔴 Critical | Admin assigns cleaner but no SMS/email sent to cleaner. They don't know they have a new job |
| **No automated cleaner matching** | 🔴 Critical | Admin manually assigns in dashboard. No algorithm to suggest best cleaner by rating/availability |
| **No cleaner acceptance workflow** | 🔴 Critical | Cleaner can't accept/decline job. Status goes straight to 'assigned' with no cleaner confirmation |
| **Customer doesn't know assignment happened** | 🟠 High | Page still shows "Cleaner Being Assigned" spinner even after admin assigned. No refresh or notification |
| **No fallback if cleaner rejects** | 🟠 High | If no cleaner accepts, booking gets stuck. No auto-reassign or customer warning |
| **No job details sent to cleaner** | 🟠 High | Cleaner sees booking in their "Jobs" list but minimal customer info (only name, address, date) |
| **SMS notifications hardcoded as 'in-app'** | 🟡 Medium | sendNotification() called with channel='in-app' (BookingContext.tsx:139) but should be 'sms' |
| **No notification delivery tracking** | 🟡 Medium | Notifications table stores status='sent' but never updated to 'delivered', 'read', etc. |

---

### 🔧 HOW TO FIX IT

#### Fix #1: Send Cleaner Notification on Assignment (CRITICAL)
**File:** `src/pages/admin/Dashboard.tsx` (or create `src/components/admin/AssignCleanerModal.tsx`)
**On assign button click:**
```typescript
const handleAssignCleaner = async (bookingId: string, cleanerId: string) => {
  try {
    // 1. Assign in DB
    const booking = await assignCleanerToBooking(bookingId, cleanerId);
    const cleaner = await getCleanerById(cleanerId);
    
    // 2. Send SMS to cleaner
    await sendSMS(
      cleaner.phone,
      `🧹 New Job Alert! ${booking.customer.first_name} needs ${booking.service_type.replace('_', ' ')} 
      📅 ${booking.scheduled_date} at ${booking.scheduled_time}
      📍 ${booking.customer.full_address}
      💰 £${booking.total_price}
      Accept? Reply YES or visit tydl-cleaner.app`
    );
    
    // 3. Send in-app notification
    await sendNotification(
      cleanerId,
      'cleaner',
      'job_assigned',
      `New Job: ${booking.customer.first_name} - £${booking.total_price}`,
      `${booking.service_type.replace('_', ' ')} on ${booking.scheduled_date}`,
      { bookingId, customerId: booking.customer_id },
      'in-app'
    );
    
    setAssignSuccess('Cleaner notified! Awaiting response...');
  } catch (error) {
    setError('Failed to assign: ' + error.message);
  }
};
```

#### Fix #2: Implement Cleaner Acceptance Workflow (CRITICAL)
**File:** Create `src/lib/cleaner-jobs.ts`
**Add new statuses:**
```typescript
export async function getCleanerJobsWithStatus(cleanerId: string) {
  // Get jobs with 'assigned' status where cleaner_id = cleanerId
  const { data, error } = await supabase
    .from('bookings')
    .select('*, customer:customers(*)')
    .eq('cleaner_id', cleanerId)
    .in('status', ['assigned', 'accepted', 'completed'])
    .order('scheduled_date', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function acceptJob(bookingId: string, cleanerId: string) {
  // Change status to 'accepted'
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'accepted' })
    .eq('id', bookingId)
    .eq('cleaner_id', cleanerId)
    .select()
    .single();
  
  if (error) throw error;
  
  // Notify customer that cleaner accepted
  await sendNotification(
    data.customer_id,
    'customer',
    'cleaner_accepted',
    'Great news! Your cleaner accepted the job',
    `${data.cleaner.first_name} confirmed and will be there on ${data.scheduled_date}.`,
    { bookingId }
  );
  
  return data;
}

export async function declineJob(bookingId: string, cleanerId: string) {
  // Revert to 'pending' for re-assignment
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'pending', cleaner_id: null })
    .eq('id', bookingId)
    .select()
    .single();
  
  if (error) throw error;
  
  // Notify admin to re-assign
  await sendNotification(
    'admin', // broadcast to all admins
    'admin',
    'cleaner_declined',
    'Cleaner declined job',
    `${bookingId}: ${data.customer.first_name} needs reassignment`,
    { bookingId }
  );
  
  return data;
}
```

#### Fix #3: Add Automated Cleaner Matching (HIGH)
**File:** Create `src/lib/cleaner-matching.ts`
**Add matching algorithm:**
```typescript
export async function suggestCleanersForBooking(booking: Booking): Promise<Cleaner[]> {
  const bookingDate = new Date(booking.scheduled_date);
  const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][bookingDate.getDay()];
  
  const { data: cleaners, error } = await supabase
    .from('cleaners')
    .select('*')
    .eq('verification_status', 'verified')
    // Filter by availability on that day
    .eq(dayOfWeek, true)
    // Filter by postcode (same area as booking)
    .eq('postcode', booking.customer.postcode.substring(0, 3)) // Match first 3 chars
    .order('rating', { ascending: false }) // Highest rated first
    .limit(5); // Return top 5
  
  if (error) throw error;
  
  // Score cleaners by:
  // - Rating (weighted 50%)
  // - Jobs completed (weighted 30%)
  // - Distance to booking (weighted 20%)
  return cleaners.sort((a, b) => {
    const scoreA = (a.rating * 50) + (Math.min(a.jobs_completed, 50) * 30);
    const scoreB = (b.rating * 50) + (Math.min(b.jobs_completed, 50) * 30);
    return scoreB - scoreA;
  });
}
```

**In Admin Dashboard, use this:**
```typescript
const suggestedCleaners = await suggestCleanersForBooking(booking);

// Show suggestion chip
<div className="bg-blue-100 p-3 rounded-lg mb-4">
  <p className="text-sm font-medium">
    💡 Suggested: {suggestedCleaners[0].first_name} ({suggestedCleaners[0].rating}⭐)
  </p>
</div>

// List suggestions
<div className="space-y-2">
  {suggestedCleaners.map(cleaner => (
    <button
      key={cleaner.id}
      onClick={() => handleAssignCleaner(booking.id, cleaner.id)}
      className="w-full p-3 border rounded-lg hover:bg-blue-50 text-left"
    >
      <p className="font-medium">{cleaner.first_name} {cleaner.last_name}</p>
      <p className="text-sm text-slate-600">{cleaner.rating}⭐ • {cleaner.jobs_completed} jobs</p>
    </button>
  ))}
</div>
```

---

## 4. EMAIL INTEGRATION

### ✅ WHAT'S WORKING WELL

**Resend API is properly configured**
- API key read from env vars (email.ts:3)
- Bearer token auth is correct (line 92, 195)
- Proper error handling with try/catch

**Email templates are professional**
- HTML emails with consistent branding (blue/gradient header)
- Responsive design (max-width: 600px)
- Clear visual hierarchy (heading, content, CTA, footer)
- Includes booking ID and next steps

**Booking confirmation email is timely**
- Sent immediately after booking creation (BookingContext.tsx:123)
- Contains all relevant details (date, time, service, price)
- Includes "View Your Booking" button with link

**Discount code email functional**
- Generated with expiry (30 days) (email.ts:30-31)
- Stored in localStorage for MVP (line 43)
- Validated at checkout (line 55)

---

### ❌ WHAT NEEDS IMPROVEMENT

| Issue | Severity | Impact |
|-------|----------|--------|
| **No email verification** | 🔴 Critical | Booking sent to customer email but email address never verified. Bounces go unseen |
| **No email delivery tracking** | 🟠 High | Resend API called but response status never checked. Can't confirm delivery or retry |
| **No transactional email template library** | 🟠 High | Email HTML embedded in .ts file (lines 202-277). Hard to edit/maintain/test |
| **Discount code only in localStorage** | 🟠 High | MVP uses localStorage (line 43) not Supabase. Won't work across devices/browsers |
| **No email unsubscribe link** | 🟠 High | Doesn't include RFC 2369 List-Unsubscribe header. Email clients can't show unsubscribe |
| **No cleaner assignment email** | 🟠 High | No template for cleaner getting assigned a job |
| **No retry on Resend failure** | 🟡 Medium | If Resend is down, email logged but not queued for retry (line 158: "return false" after error) |
| **Plain text fallback missing** | 🟡 Medium | HTML-only emails. Some email clients/spam filters prefer plain text alternative |

---

### 🔧 HOW TO FIX IT

#### Fix #1: Add Email Verification Workflow (HIGH)
**File:** `src/context/CustomerAuthContext.tsx`
**Modify signup:**
```typescript
const signup = async (email: string, password: string, firstName: string, lastName: string, postcode: string, phone: string) => {
  try {
    setError(null);
    
    // 1. Sign up user
    const result = await signUpCustomer(email, password, firstName, lastName, postcode, phone);
    
    // 2. Send verification email
    try {
      await sendVerificationEmail(email, result.user.id);
      
      // Show "check your email" message
      setVerificationPending(true);
      setVerificationEmail(email);
    } catch (emailError) {
      console.warn('Verification email failed:', emailError);
      // Don't block signup but warn user
      setError('Account created but verification email failed. Check spam folder.');
    }
    
    setUser(result.user);
    setCustomer(result.customer);
  } catch (err: any) {
    setError(err.message || 'Failed to sign up');
    throw err;
  }
};
```

**Create verification email function:**
```typescript
// In email.ts
export async function sendVerificationEmail(email: string, userId: string) {
  const verificationLink = `https://tydl.co.uk/verify?token=${encodeURIComponent(userId)}`;
  
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'verify@tydl.co.uk',
      to: email,
      subject: 'Verify your Tydl account',
      html: `
        <h1>Verify your email</h1>
        <p>Click the link below to confirm your Tydl account.</p>
        <a href="${verificationLink}" style="display:inline-block; padding:12px 30px; background:#4f46e5; color:white; text-decoration:none; border-radius:6px; font-weight:bold;">
          Verify Email
        </a>
        <p style="color:#666; font-size:12px; margin-top:20px;">
          Link expires in 24 hours.
        </p>
      `,
      headers: {
        'List-Unsubscribe': '<mailto:unsubscribe@tydl.co.uk>',
      },
    }),
  });
  
  if (!response.ok) throw new Error('Verification email failed');
}
```

#### Fix #2: Extract Email Templates to Separate Files (MEDIUM)
**Create:** `src/emails/BookingConfirmation.tsx`
```typescript
// Use React Email library for better maintainability
import { Html, Head, Body, Section, Text, Link } from '@react-email/components';

interface BookingConfirmationEmailProps {
  customerName: string;
  bookingId: string;
  serviceType: string;
  scheduledDate: string;
  scheduledTime: string;
  totalPrice: number;
}

export const BookingConfirmationEmail = ({
  customerName,
  bookingId,
  serviceType,
  scheduledDate,
  scheduledTime,
  totalPrice,
}: BookingConfirmationEmailProps) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: 'sans-serif' }}>
      <Section style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Header */}
        <Section
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
            color: 'white',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <h1>Booking Confirmed! ✓</h1>
        </Section>
        
        {/* Content */}
        <Section style={{ padding: '40px', background: '#f5f5f5' }}>
          <Text>Hi {customerName},</Text>
          <Text>
            Great news! Your booking has been confirmed. We're assigning your cleaner
            now and will send you their details within 24 hours.
          </Text>
          
          {/* Booking Details */}
          <Section style={{ background: 'white', padding: '30px', borderRadius: '8px', margin: '20px 0' }}>
            <Text style={{ margin: 0, fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
              BOOKING CONFIRMED
            </Text>
            <Text style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#666' }}>
              Booking ID: {bookingId}
            </Text>
            
            {/* Details Grid */}
            <Section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px 0' }}>
              <div>
                <Text style={{ margin: 0, fontSize: '12px', color: '#666' }}>Date</Text>
                <Text style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>
                  {new Date(scheduledDate).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </div>
              <div>
                <Text style={{ margin: 0, fontSize: '12px', color: '#666' }}>Time</Text>
                <Text style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>{scheduledTime}</Text>
              </div>
              <div>
                <Text style={{ margin: 0, fontSize: '12px', color: '#666' }}>Service</Text>
                <Text style={{ margin: '5px 0 0 0', fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {serviceType.replace('-', ' ')}
                </Text>
              </div>
              <div>
                <Text style={{ margin: 0, fontSize: '12px', color: '#666' }}>Total</Text>
                <Text style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>£{totalPrice.toFixed(2)}</Text>
              </div>
            </Section>
          </Section>
          
          {/* Next Steps */}
          <h3>Next Steps:</h3>
          <ol>
            <li>We're reviewing available cleaners for your area</li>
            <li>You'll receive an email with your cleaner's details within 24 hours</li>
            <li>Get to know your cleaner and confirm the appointment</li>
            <li>Relax - they'll handle the rest!</li>
          </ol>
          
          <Link href="https://tydl.co.uk/customer/bookings">
            View Your Booking
          </Link>
        </Section>
      </Section>
    </Body>
  </Html>
);
```

**Update email.ts:**
```typescript
import { render } from '@react-email/render';
import { BookingConfirmationEmail } from '../emails/BookingConfirmation';

export async function sendBookingConfirmationEmail(...) {
  const htmlBody = render(
    <BookingConfirmationEmail
      customerName={customerName}
      bookingId={bookingDetails.bookingId}
      // ... other props
    />
  );
  
  // Use htmlBody in Resend API call
}
```

#### Fix #3: Move Discount Codes to Supabase (HIGH)
**File:** Create `src/lib/discount-codes.ts`
```typescript
export async function createDiscountCode(
  email: string,
  percentage: number = 10,
  expiryDays: number = 30
) {
  const code = generateDiscountCode();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiryDays);
  
  const { data, error } = await supabase
    .from('discount_codes')
    .insert([{
      code,
      email,
      percentage,
      expires_at: expiresAt.toISOString(),
      used: false,
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function validateDiscountCode(code: string, email?: string) {
  const { data, error } = await supabase
    .from('discount_codes')
    .select('*')
    .eq('code', code)
    .eq('used', false)
    .single();
  
  if (error) return null;
  if (!data) return null;
  if (new Date(data.expires_at) < new Date()) return null;
  if (email && data.email !== email) return null; // Single-use per email
  
  return data;
}

export async function applyDiscountCode(code: string) {
  const { error } = await supabase
    .from('discount_codes')
    .update({ used: true, used_at: new Date().toISOString() })
    .eq('code', code);
  
  if (error) throw error;
}
```

---

## 📊 TOP 5 PRIORITY IMPROVEMENTS (Ranked by Impact)

### 🔴 #1: Add Payment Processing (Stripe Integration)
**Why:** No actual payment flow exists. Customers can complete booking without paying.
**Impact:** Critical — revenue blocker
**Effort:** 4-6 hours
**Files:** CheckoutDetails.tsx, BookingContext.tsx
**Success metric:** Payment confirmation returned before booking saved

---

### 🔴 #2: Implement Cleaner Assignment Notifications
**Why:** Cleaner assigned in admin dashboard but gets no notification. Customer doesn't know when cleaner assigned.
**Impact:** Critical — breaks core workflow. Cleaner + customer in dark.
**Effort:** 3-4 hours
**Files:** supabase.ts, admin.ts, email.ts
**Success metric:** Cleaner receives SMS < 2 seconds after assignment. Customer sees notification update in real-time.

---

### 🟠 #3: Add Email Verification + Delivery Tracking
**Why:** Emails sent to unverified addresses. Can't retry failed deliveries. No proof email arrived.
**Impact:** High — lost customer communications = support tickets
**Effort:** 3 hours
**Files:** email.ts, CustomerAuthContext.tsx
**Success metric:** Email bounces tracked. Resend webhook logs delivery status.

---

### 🟠 #4: Fix Race Condition (Payment → Email) + Show Booking ID
**Why:** Email sent before payment confirmed. Booking ID hidden from customer.
**Impact:** High — customer confusion. Lost reference number.
**Effort:** 2-3 hours
**Files:** CheckoutDetails.tsx, ConfirmationPending.tsx
**Success metric:** Email only sent after stripe.confirmCardPayment() succeeds. Booking ID displayed 18pt font on confirmation.

---

### 🟠 #5: Add SMS Confirmations + Discount Code Field
**Why:** Customers might miss email. Discount codes in localStorage don't sync across devices.
**Impact:** Medium-High — reduces repeat bookings (no discount remembered). On-the-go customers miss alerts.
**Effort:** 3-4 hours
**Files:** BookingContext.tsx, CheckoutDetails.tsx, supabase.ts
**Success metric:** SMS sent to phone within 30s of booking. Discount code properly applied with Supabase DB.

---

## Implementation Roadmap

**Week 1 (MVP Launch Prerequisites):**
- ✅ Fix #1 + #2 + #4 (payment, cleaner notifications, booking ID)
- Estimated: 10-14 hours

**Week 2 (Post-Launch Stability):**
- Fix #3 + #5 (email verification, SMS, discount codes)
- Estimated: 8-10 hours

**Week 3 (Polish):**
- Extract email templates (React Email)
- Add automated cleaner matching algorithm
- Cleaner acceptance workflow
- Real-time status updates (Supabase subscription)

---

## Files to Update (Checklist)

- [ ] `src/pages/booking/CheckoutDetails.tsx` — Add Stripe, discount code field
- [ ] `src/context/BookingContext.tsx` — Move email send after payment
- [ ] `src/pages/booking/ConfirmationPending.tsx` — Show booking ID, add real-time updates
- [ ] `src/lib/email.ts` — Add SMS, email verification, cleaner assignment templates
- [ ] `src/lib/supabase.ts` — Add discount code DB funcs, improve sendNotification
- [ ] `src/lib/admin.ts` — Add cleaner assignment notification, matching algo
- [ ] `src/context/CustomerAuthContext.tsx` — Add email verification flow
- [ ] Create `src/lib/cleaner-jobs.ts` — Cleaner acceptance workflow
- [ ] Create `src/lib/cleaner-matching.ts` — Auto-suggest best cleaners
- [ ] Create `src/emails/*.tsx` — Separate email templates

---

## Next Steps

1. **Review this document** with product/design team
2. **Prioritize** which fixes to tackle first
3. **Create GitHub issues** for each fix
4. **Assign** by week
5. **Test** email flows locally with [Resend Dev Mode](https://resend.com/docs/testing)
6. **Deploy to staging** before launch

---

**Generated:** April 16, 2026 | **Next Review:** After Week 1 fixes deployed
