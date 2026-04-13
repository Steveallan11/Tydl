import React, { createContext, useContext, useState } from 'react';
import { BookingFormData } from '../types/booking';
import { calculatePricing, PricingBreakdown } from '../lib/pricing';

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
  submitBooking: () => Promise<void>;
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

  const submitBooking = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate booking ID
      const newBookingId = `BK-${Date.now()}`;
      setBookingId(newBookingId);

      // Save to localStorage
      const booking = {
        id: newBookingId,
        ...formData,
        totalPrice: pricing.totalPrice,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(`booking:${newBookingId}`, JSON.stringify(booking));

      // Also save to user's bookings list
      const userBookings = JSON.parse(localStorage.getItem('user:bookings') || '[]');
      userBookings.push(newBookingId);
      localStorage.setItem('user:bookings', JSON.stringify(userBookings));

      // Send confirmation email
      if (formData.email && formData.firstName && formData.lastName) {
        try {
          await fetch('/api/send-confirmation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              bookingId: newBookingId,
              email: formData.email,
              firstName: formData.firstName,
              lastName: formData.lastName,
              serviceType: formData.serviceType,
              scheduledDate: formData.scheduledDate,
              scheduledTime: formData.scheduledTime,
              totalPrice: pricing.totalPrice,
            }),
          });
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
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
