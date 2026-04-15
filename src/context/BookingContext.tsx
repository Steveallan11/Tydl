import React, { createContext, useContext, useState } from 'react';
import { BookingFormData } from '../types/booking';
import { calculatePricing, PricingBreakdown } from '../lib/pricing';
import { createBooking, updateCustomerProfile, sendNotification } from '../lib/supabase';
import { sendBookingConfirmationEmail } from '../lib/email';

interface BookingContextType {
  // Form data
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
  resetFormData: () => void;

  // Pricing
  pricing: PricingBreakdown;

  // Navigation
  currentStep: number;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Booking submission
  isSubmitting: boolean;
  submitBooking: (customerId: string) => Promise<void>;
  bookingId?: string;
}

const defaultFormData: BookingFormData = {
  addOns: [],
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<BookingFormData>(defaultFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string>();

  // Calculate pricing whenever form data changes
  const pricing = calculatePricing(
    formData.serviceType,
    formData.propertySize,
    formData.addOns,
    formData.frequency
  );

  const updateFormData = (data: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetFormData = () => {
    setFormData(defaultFormData);
    setCurrentStep(1);
    setBookingId(undefined);
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 9) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => {
    if (currentStep < 9) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitBooking = async (customerId: string) => {
    setIsSubmitting(true);
    try {
      // Use the customer ID passed from the auth context
      if (!customerId) {
        throw new Error('No customer logged in');
      }

      // Validate required fields
      if (!formData.serviceType) {
        throw new Error('Service type is required');
      }
      if (!formData.propertySize) {
        throw new Error('Property size is required');
      }
      if (!formData.scheduledDate) {
        throw new Error('Scheduled date is required');
      }
      if (!formData.scheduledTime) {
        throw new Error('Scheduled time is required');
      }

      // Use values as-is (database expects hyphenated format like 'two-bed', 'one-off-clean', etc)
      const serviceType = formData.serviceType;
      const propertySize = formData.propertySize;
      const frequency = formData.frequency || 'once';

      console.log('[submitBooking] Booking values:', {
        serviceType,
        propertySize,
        frequency,
        supplies: formData.supplies,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
      });

      // Create booking in database
      const booking = await createBooking({
        customer_id: customerId,
        service_type: serviceType,
        property_size: propertySize,
        supplies: formData.supplies || 'platform',
        frequency: frequency,
        add_ons: formData.addOns || [],
        total_price: pricing.totalPrice,
        scheduled_date: formData.scheduledDate!,
        scheduled_time: formData.scheduledTime!,
        customer_notes: formData.customerNotes,
      });

      console.log('[submitBooking] Booking created successfully:', booking.id);

      setBookingId(booking.id);

      // Save customer details to profile for future bookings
      try {
        await updateCustomerProfile(customerId, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          postcode: formData.postcode,
          full_address: formData.fullAddress,
        });
      } catch (profileError) {
        console.error('Failed to update customer profile:', profileError);
        // Don't block booking if profile update fails
      }

      // Send confirmation email
      if (formData.email && formData.firstName && formData.lastName) {
        try {
          console.log('[submitBooking] Sending confirmation email to:', formData.email);
          await sendBookingConfirmationEmail(formData.email, formData.firstName, {
            bookingId: booking.id,
            serviceType: formData.serviceType || 'cleaning',
            scheduledDate: formData.scheduledDate || new Date().toISOString(),
            scheduledTime: formData.scheduledTime || '09:00',
            totalPrice: pricing.totalPrice,
          });
          console.log('[submitBooking] Confirmation email sent successfully');

          // Also send in-app notification
          console.log('[submitBooking] Sending in-app notification...');
          await sendNotification(
            customerId,
            'customer',
            'booking_confirmed',
            'Booking Confirmed!',
            `Your ${formData.serviceType} booking for ${formData.scheduledDate} has been confirmed.`,
            { bookingId: booking.id },
            'in-app'
          );
          console.log('[submitBooking] In-app notification sent');
        } catch (emailError: any) {
          console.error('[submitBooking] Error sending confirmation:', {
            message: emailError.message,
            code: emailError.code,
          });
          // Don't block booking if email fails
        }
      }

      // Move to confirmation step
      setCurrentStep(9);
    } finally {
      setIsSubmitting(false);
    }
  };

  const value: BookingContextType = {
    formData,
    updateFormData,
    resetFormData,
    pricing,
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    isSubmitting,
    submitBooking,
    bookingId,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
}
