import { supabase } from './supabase';

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;

interface DiscountCode {
  code: string;
  email: string;
  percentage: number;
  expiresAt: string;
  used: boolean;
  createdAt: string;
}

/**
 * Generate a unique discount code
 */
export function generateDiscountCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'TYDL';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Save discount code for email newsletter signup
 */
export async function saveDiscountCode(email: string, code: string, percentage: number = 10) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // Code valid for 30 days

  const discountCode: DiscountCode = {
    code,
    email,
    percentage,
    expiresAt: expiresAt.toISOString(),
    used: false,
    createdAt: new Date().toISOString(),
  };

  // Store in localStorage for MVP
  const existingCodes = JSON.parse(localStorage.getItem('discount_codes') || '[]');
  existingCodes.push(discountCode);
  localStorage.setItem('discount_codes', JSON.stringify(existingCodes));

  return discountCode;
}

/**
 * Validate and apply discount code at checkout
 */
export function validateDiscountCode(code: string): DiscountCode | null {
  const allCodes: DiscountCode[] = JSON.parse(localStorage.getItem('discount_codes') || '[]');
  const discountCode = allCodes.find(c => c.code === code && !c.used);

  if (!discountCode) return null;

  // Check if code is expired
  const expiresAt = new Date(discountCode.expiresAt);
  if (new Date() > expiresAt) return null;

  return discountCode;
}

/**
 * Mark discount code as used
 */
export function useDiscountCode(code: string) {
  const allCodes: DiscountCode[] = JSON.parse(localStorage.getItem('discount_codes') || '[]');
  const index = allCodes.findIndex(c => c.code === code);

  if (index !== -1) {
    allCodes[index].used = true;
    localStorage.setItem('discount_codes', JSON.stringify(allCodes));
  }
}

/**
 * Send discount code email via Resend
 */
export async function sendDiscountCodeEmail(email: string, discountCode: string, percentage: number = 10) {
  try {
    if (!RESEND_API_KEY) {
      console.warn('Resend API key not configured, skipping email');
      return true; // For MVP, allow to continue without email
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@tydl.co.uk',
        to: email,
        subject: `Your ${percentage}% Discount Code for Tydl Cleaning 🎉`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
                .container { max-width: 600px; margin: 0 auto; }
                .header { background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%); color: white; padding: 40px; text-align: center; }
                .content { padding: 40px; background: #f5f5f5; }
                .code-box { background: white; padding: 30px; margin: 20px 0; border-radius: 8px; text-align: center; border: 2px dashed #4f46e5; }
                .code { font-size: 28px; font-weight: bold; color: #4f46e5; font-family: monospace; letter-spacing: 2px; }
                .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
                .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Welcome to Tydl! 🎉</h1>
                  <p>Your ${percentage}% discount code is ready</p>
                </div>
                <div class="content">
                  <p>Hi there,</p>
                  <p>Thanks for signing up! Here's your exclusive ${percentage}% discount code for your first clean.</p>

                  <div class="code-box">
                    <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your Discount Code</p>
                    <div class="code">${discountCode}</div>
                  </div>

                  <p><strong>How to use:</strong></p>
                  <ol>
                    <li>Visit <a href="https://tydl.co.uk/book">tydl.co.uk/book</a></li>
                    <li>Complete your booking</li>
                    <li>Enter the code at checkout</li>
                    <li>Enjoy your ${percentage}% discount! 💚</li>
                  </ol>

                  <p style="color: #666; font-size: 12px;">Valid for 30 days from today. One-time use only.</p>

                  <a href="https://tydl.co.uk/book" class="button">Book Your Clean Now</a>
                </div>
                <div class="footer">
                  <p>© 2026 Tydl Cleaning. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return true;
  } catch (error) {
    console.error('Error sending discount code email:', error);
    return false; // For MVP, don't block if email fails
  }
}

/**
 * Send email to customer when cleaner has been assigned
 */
export async function sendCustomerCleanerAssignedEmail(
  email: string,
  customerName: string,
  cleanerDetails: {
    cleanerName: string;
    cleanerRating: number;
    cleanerPhone: string;
    bookingId: string;
    scheduledDate: string;
    scheduledTime: string;
  }
) {
  try {
    if (!RESEND_API_KEY) {
      console.warn('Resend API key not configured, skipping email');
      return true;
    }

    const dateObj = new Date(cleanerDetails.scheduledDate);
    const formattedDate = dateObj.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@tydl.co.uk',
        to: email,
        subject: `Meet Your Cleaner - ${cleanerDetails.cleanerName} ✨`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
                .container { max-width: 600px; margin: 0 auto; }
                .header { background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%); color: white; padding: 40px; text-align: center; }
                .content { padding: 40px; background: #f5f5f5; }
                .cleaner-card { background: white; padding: 30px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #10b981; }
                .cleaner-info { display: flex; gap: 20px; margin: 15px 0; }
                .info-item { flex: 1; }
                .info-label { color: #666; font-size: 12px; text-transform: uppercase; }
                .info-value { color: #333; font-weight: bold; font-size: 16px; margin-top: 5px; }
                .rating { color: #f59e0b; font-size: 18px; }
                .next-steps { background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
                .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Great News! ✨</h1>
                  <p>Your cleaner has been assigned</p>
                </div>
                <div class="content">
                  <p>Hi ${customerName},</p>
                  <p>Excellent news! We've matched you with <strong>${cleanerDetails.cleanerName}</strong> for your cleaning on <strong>${formattedDate}</strong>.</p>

                  <div class="cleaner-card">
                    <h2 style="margin: 0 0 15px 0; color: #333;">${cleanerDetails.cleanerName}</h2>
                    <div class="cleaner-info">
                      <div class="info-item">
                        <div class="info-label">Rating</div>
                        <div class="info-value"><span class="rating">⭐ ${cleanerDetails.cleanerRating.toFixed(1)}/5</span></div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Phone</div>
                        <div class="info-value"><a href="tel:${cleanerDetails.cleanerPhone}" style="color: #4f46e5; text-decoration: none;">${cleanerDetails.cleanerPhone}</a></div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Booking ID</div>
                        <div class="info-value" style="font-family: monospace; font-size: 14px;">${cleanerDetails.bookingId}</div>
                      </div>
                    </div>
                  </div>

                  <div class="next-steps">
                    <h3 style="margin: 0 0 10px 0;">What happens next?</h3>
                    <ol style="margin: 0; padding-left: 20px;">
                      <li>${cleanerDetails.cleanerName} will text you on your phone number to confirm arrival</li>
                      <li>They'll arrive within a 30-minute window on the agreed time</li>
                      <li>We'll stay in touch with you during the clean</li>
                      <li>Rate your cleaner after they're done</li>
                    </ol>
                  </div>

                  <p style="color: #666; font-size: 14px;">
                    <strong>Need to reach them?</strong> Use the phone number above or reply to this email for support.
                  </p>

                  <a href="https://tydl.co.uk/customer/bookings" class="button">View Booking Details</a>
                </div>
                <div class="footer">
                  <p>© 2026 Tydl Cleaning. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return true;
  } catch (error) {
    console.error('Error sending cleaner assigned email to customer:', error);
    return false;
  }
}

/**
 * Send job notification email to cleaner
 */
export async function sendCleanerJobNotificationEmail(
  email: string,
  cleanerName: string,
  jobDetails: {
    bookingId: string;
    customerName: string;
    customerPhone: string;
    address: string;
    scheduledDate: string;
    scheduledTime: string;
    serviceType: string;
    totalPrice: number;
    estimatedDuration: number;
  }
) {
  try {
    if (!RESEND_API_KEY) {
      console.warn('Resend API key not configured, skipping email');
      return true;
    }

    const dateObj = new Date(jobDetails.scheduledDate);
    const formattedDate = dateObj.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'jobs@tydl.co.uk',
        to: email,
        subject: `New Job Alert - ${jobDetails.customerName} on ${formattedDate}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
                .container { max-width: 600px; margin: 0 auto; }
                .header { background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%); color: white; padding: 40px; text-align: center; }
                .content { padding: 40px; background: #f5f5f5; }
                .job-card { background: white; padding: 30px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #4f46e5; }
                .job-detail { margin: 15px 0; display: flex; justify-content: space-between; }
                .detail-label { color: #666; font-size: 12px; text-transform: uppercase; }
                .detail-value { color: #333; font-weight: bold; }
                .customer-info { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
                .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
                .price-highlight { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0; font-size: 18px; font-weight: bold; text-align: center; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🧹 New Job!</h1>
                  <p>Check the details below</p>
                </div>
                <div class="content">
                  <p>Hi ${cleanerName},</p>
                  <p>You have a new cleaning job assigned. Please review the details and confirm you can make it.</p>

                  <div class="job-card">
                    <h2 style="margin: 0 0 20px 0; color: #333;">Job Details</h2>

                    <div class="job-detail">
                      <div>
                        <div class="detail-label">Booking ID</div>
                        <div class="detail-value" style="font-family: monospace;">${jobDetails.bookingId}</div>
                      </div>
                      <div>
                        <div class="detail-label">Service</div>
                        <div class="detail-value">${jobDetails.serviceType}</div>
                      </div>
                    </div>

                    <div class="job-detail">
                      <div>
                        <div class="detail-label">Date</div>
                        <div class="detail-value">${formattedDate}</div>
                      </div>
                      <div>
                        <div class="detail-label">Time</div>
                        <div class="detail-value">${jobDetails.scheduledTime}</div>
                      </div>
                    </div>

                    <div class="job-detail">
                      <div>
                        <div class="detail-label">Duration (est.)</div>
                        <div class="detail-value">${jobDetails.estimatedDuration.toFixed(1)} hours</div>
                      </div>
                    </div>

                    <div class="price-highlight">
                      Earn: £${jobDetails.totalPrice.toFixed(2)}
                    </div>
                  </div>

                  <div class="customer-info">
                    <h3 style="margin: 0 0 15px 0; color: #333;">Customer</h3>
                    <p style="margin: 0;"><strong>${jobDetails.customerName}</strong></p>
                    <p style="margin: 5px 0 0 0; color: #666;">
                      <a href="tel:${jobDetails.customerPhone}" style="color: #4f46e5; text-decoration: none;">📞 ${jobDetails.customerPhone}</a>
                    </p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;">
                    <p style="margin: 0; color: #333;">
                      📍 <strong>${jobDetails.address}</strong>
                    </p>
                  </div>

                  <p style="color: #333; font-weight: bold;">
                    ✅ Please confirm you can accept this job by replying to this email or logging into the Cleaner Portal.
                  </p>

                  <a href="https://tydl-cleaner.app/jobs/${jobDetails.bookingId}/accept" class="button">Accept Job</a>

                  <p style="color: #666; font-size: 12px; margin-top: 20px;">
                    <strong>Can't make it?</strong> Let us know ASAP so we can reassign to another cleaner.
                  </p>
                </div>
                <div class="footer">
                  <p>© 2026 Tydl Cleaning. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return true;
  } catch (error) {
    console.error('Error sending job notification email to cleaner:', error);
    return false;
  }
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmationEmail(
  email: string,
  customerName: string,
  bookingDetails: {
    bookingId: string;
    serviceType: string;
    scheduledDate: string;
    scheduledTime: string;
    totalPrice: number;
    cleanerName?: string;
    cleanerRating?: number;
  }
) {
  try {
    if (!RESEND_API_KEY) {
      console.warn('Resend API key not configured, skipping email');
      return true;
    }

    const dateObj = new Date(bookingDetails.scheduledDate);
    const formattedDate = dateObj.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@tydl.co.uk',
        to: email,
        subject: `Your Booking Confirmation - Tydl Cleaning ✓`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
                .container { max-width: 600px; margin: 0 auto; }
                .header { background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%); color: white; padding: 40px; text-align: center; }
                .content { padding: 40px; background: #f5f5f5; }
                .booking-box { background: white; padding: 30px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #4f46e5; }
                .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
                .detail-item { background: #f9f9f9; padding: 15px; border-radius: 6px; }
                .detail-label { color: #666; font-size: 12px; text-transform: uppercase; }
                .detail-value { color: #333; font-weight: bold; font-size: 16px; margin-top: 5px; }
                .status { display: inline-block; background: #dcfce7; color: #166534; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 12px; }
                .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
                .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Booking Confirmed! ✓</h1>
                  <p>Your cleaning is all set</p>
                </div>
                <div class="content">
                  <p>Hi ${customerName},</p>
                  <p>Great news! Your booking has been confirmed. We're assigning your cleaner now and will send you their details within 24 hours.</p>

                  <div class="booking-box">
                    <div style="margin-bottom: 20px;">
                      <span class="status">BOOKING CONFIRMED</span>
                      <p style="margin-top: 10px; color: #666; font-size: 12px;">Booking ID: ${bookingDetails.bookingId}</p>
                    </div>

                    <div class="details">
                      <div class="detail-item">
                        <div class="detail-label">Date</div>
                        <div class="detail-value">${formattedDate}</div>
                      </div>
                      <div class="detail-item">
                        <div class="detail-label">Time</div>
                        <div class="detail-value">${bookingDetails.scheduledTime}</div>
                      </div>
                      <div class="detail-item">
                        <div class="detail-label">Service</div>
                        <div class="detail-value" style="text-transform: capitalize;">${bookingDetails.serviceType.replace('-', ' ')}</div>
                      </div>
                      <div class="detail-item">
                        <div class="detail-label">Total Price</div>
                        <div class="detail-value">£${bookingDetails.totalPrice.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>

                  <h3 style="margin-top: 30px;">Next Steps:</h3>
                  <ol>
                    <li>We're reviewing available cleaners for your area</li>
                    <li>You'll receive an email with your cleaner's details within 24 hours</li>
                    <li>Get to know your cleaner and confirm the appointment</li>
                    <li>Relax - they'll handle the rest!</li>
                  </ol>

                  <p style="color: #666; font-size: 12px; margin-top: 20px;">
                    <strong>Questions?</strong> Reply to this email or visit your <a href="https://tydl.co.uk/customer/bookings">booking dashboard</a>
                  </p>

                  <a href="https://tydl.co.uk/customer/bookings" class="button">View Your Booking</a>
                </div>
                <div class="footer">
                  <p>© 2026 Tydl Cleaning. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return true;
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return false;
  }
}
