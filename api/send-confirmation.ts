import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingConfirmationRequest {
  bookingId: string;
  email: string;
  firstName: string;
  lastName: string;
  serviceType: string;
  scheduledDate: string;
  scheduledTime: string;
  totalPrice: number;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      bookingId,
      email,
      firstName,
      lastName,
      serviceType,
      scheduledDate,
      scheduledTime,
      totalPrice,
    } = request.body as BookingConfirmationRequest;

    // Validate required fields
    if (!bookingId || !email || !firstName || !lastName) {
      return response.status(400).json({ error: 'Missing required fields' });
    }

    // Format the service type for display
    const serviceLabels: Record<string, string> = {
      'regular-clean': 'Regular Clean',
      'one-off-clean': 'One-Off Clean',
      'deep-clean': 'Deep Clean',
      'end-of-tenancy': 'End of Tenancy Clean',
    };
    const serviceLabel = serviceLabels[serviceType] || serviceType;

    // Format date for display
    const bookingDate = new Date(scheduledDate).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Send email using Resend
    const result = await resend.emails.send({
      from: 'Tydl <noreply@tydl.com>',
      to: email,
      subject: `Booking Confirmed #${bookingId}`,
      html: generateConfirmationEmailHtml({
        bookingId,
        firstName,
        lastName,
        serviceLabel,
        bookingDate,
        scheduledTime,
        totalPrice,
      }),
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return response.status(500).json({ error: 'Failed to send email' });
    }

    return response.status(200).json({
      success: true,
      messageId: result.data?.id,
    });
  } catch (error) {
    console.error('API error:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
}

function generateConfirmationEmailHtml(params: {
  bookingId: string;
  firstName: string;
  lastName: string;
  serviceLabel: string;
  bookingDate: string;
  scheduledTime: string;
  totalPrice: number;
}): string {
  const { bookingId, firstName, lastName, serviceLabel, bookingDate, scheduledTime, totalPrice } = params;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      color: #374151;
      background: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      color: white;
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .content {
      padding: 32px 24px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .booking-details {
      background: #f3f4f6;
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: 600;
      color: #6b7280;
    }
    .detail-value {
      font-weight: 600;
      color: #1f2937;
    }
    .price-section {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-left: 4px solid #2563eb;
      padding: 20px;
      margin: 24px 0;
      border-radius: 8px;
    }
    .price-label {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 8px;
    }
    .price-value {
      font-size: 32px;
      font-weight: bold;
      color: #1d4ed8;
      font-family: 'Courier New', monospace;
    }
    .next-steps {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      padding: 20px;
      margin: 24px 0;
      border-radius: 8px;
    }
    .next-steps h3 {
      margin: 0 0 12px 0;
      color: #92400e;
      font-size: 16px;
    }
    .next-steps ul {
      margin: 0;
      padding-left: 20px;
      color: #78350f;
    }
    .next-steps li {
      margin: 8px 0;
    }
    .guarantee {
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
      text-align: center;
    }
    .guarantee-icon {
      font-size: 32px;
      margin-bottom: 12px;
    }
    .guarantee-text {
      font-weight: 600;
      color: #92400e;
      margin: 0;
    }
    .footer {
      background: #f3f4f6;
      padding: 24px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
    }
    .cta-button {
      display: inline-block;
      background: #2563eb;
      color: white;
      padding: 12px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin: 24px 0;
    }
    .cta-button:hover {
      background: #1d4ed8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Booking Confirmed</h1>
    </div>

    <div class="content">
      <p class="greeting">Hi ${firstName},</p>

      <p>Your booking is confirmed! We're assigning your cleaner now and will contact you within 24 hours with their details.</p>

      <div class="booking-details">
        <div class="detail-row">
          <span class="detail-label">Booking ID</span>
          <span class="detail-value">${bookingId}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Service</span>
          <span class="detail-value">${serviceLabel}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Scheduled Date</span>
          <span class="detail-value">${bookingDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Preferred Time</span>
          <span class="detail-value">${scheduledTime}</span>
        </div>
      </div>

      <div class="price-section">
        <div class="price-label">Your Total Price</div>
        <div class="price-value">£${Math.round(totalPrice)}</div>
        <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">Price locked in. No hidden fees.</p>
      </div>

      <div class="next-steps">
        <h3>What Happens Next?</h3>
        <ul>
          <li><strong>Within 24 hours:</strong> We'll email you with your cleaner's name, photo, and phone number</li>
          <li><strong>Before your clean:</strong> Your cleaner will text to confirm they're on the way</li>
          <li><strong>After your clean:</strong> Rate your cleaner and rebook in one click</li>
        </ul>
      </div>

      <div class="guarantee">
        <div class="guarantee-icon">🛡️</div>
        <p class="guarantee-text">Not happy? We'll redo it free or refund you. No questions asked.</p>
      </div>

      <center>
        <a href="https://tydl.com/customer/dashboard" class="cta-button">View Your Booking</a>
      </center>

      <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
        Questions? Email us at <a href="mailto:hello@tydl.com" style="color: #2563eb; text-decoration: none;">hello@tydl.com</a> or call <a href="tel:01604123456" style="color: #2563eb; text-decoration: none;">01604 123 456</a>
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0;">© 2026 Tydl. All rights reserved.</p>
      <p style="margin: 8px 0 0 0; font-size: 12px;">Northamptonshire's trusted cleaning marketplace</p>
    </div>
  </div>
</body>
</html>
  `;
}
