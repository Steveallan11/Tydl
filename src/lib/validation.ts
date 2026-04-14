/**
 * Validation utilities for booking form
 */

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate postcode (simple UK postcode validation)
 */
export function validatePostcode(postcode: string): boolean {
  if (!postcode || postcode.trim().length === 0) return false;
  // Simple UK postcode pattern - allows common formats
  const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i;
  return postcodeRegex.test(postcode.trim());
}

/**
 * Validate email
 */
export function validateEmail(email: string): boolean {
  if (!email || email.trim().length === 0) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate phone number (simple validation)
 */
export function validatePhone(phone: string): boolean {
  if (!phone || phone.trim().length === 0) return false;
  // Accept common UK phone formats
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone.trim());
}

/**
 * Validate name (at least 2 characters)
 */
export function validateName(name: string): boolean {
  if (!name || name.trim().length < 2) return false;
  return true;
}

/**
 * Validate date (must be today or in the future)
 */
export function validateDate(dateString: string): boolean {
  if (!dateString) return false;
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
}

/**
 * Validate time (format HH:mm)
 */
export function validateTime(timeString: string): boolean {
  if (!timeString) return false;
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
}

/**
 * Validate required field
 */
export function validateRequired(value: string | undefined | null): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string' && value.trim().length === 0) return false;
  return true;
}

/**
 * Get validation error message for a field
 */
export function getFieldError(field: string, value: any): string | null {
  switch (field) {
    case 'postcode':
      if (!validateRequired(value)) return 'Postcode is required';
      if (!validatePostcode(value)) return 'Please enter a valid UK postcode';
      return null;

    case 'email':
      if (!validateRequired(value)) return 'Email is required';
      if (!validateEmail(value)) return 'Please enter a valid email address';
      return null;

    case 'phone':
      if (!validateRequired(value)) return 'Phone number is required';
      if (!validatePhone(value)) return 'Please enter a valid phone number';
      return null;

    case 'firstName':
      if (!validateRequired(value)) return 'First name is required';
      if (!validateName(value)) return 'First name must be at least 2 characters';
      return null;

    case 'lastName':
      if (!validateRequired(value)) return 'Last name is required';
      if (!validateName(value)) return 'Last name must be at least 2 characters';
      return null;

    case 'scheduledDate':
      if (!validateRequired(value)) return 'Date is required';
      if (!validateDate(value)) return 'Please select today or a future date';
      return null;

    case 'scheduledTime':
      if (!validateRequired(value)) return 'Time is required';
      if (!validateTime(value)) return 'Please select a valid time';
      return null;

    default:
      return null;
  }
}

/**
 * Validate entire booking form at a specific step
 */
export function validateBookingStep(
  step: number,
  data: Record<string, any>
): ValidationError[] {
  const errors: ValidationError[] = [];

  switch (step) {
    case 1: // Postcode
      if (!data.postcode) {
        errors.push({ field: 'postcode', message: 'Postcode is required' });
      } else if (!validatePostcode(data.postcode)) {
        errors.push({ field: 'postcode', message: 'Please enter a valid UK postcode' });
      }
      break;

    case 2: // Service
      if (!data.serviceType) {
        errors.push({ field: 'serviceType', message: 'Please select a service' });
      }
      break;

    case 3: // Property
      if (!data.propertySize) {
        errors.push({ field: 'propertySize', message: 'Please select property size' });
      }
      if (!data.fullAddress) {
        errors.push({ field: 'fullAddress', message: 'Address is required' });
      }
      break;

    case 4: // Supplies
      if (!data.supplies) {
        errors.push({ field: 'supplies', message: 'Please select supplies option' });
      }
      break;

    case 5: // Frequency & Scheduling
      if (!data.frequency) {
        errors.push({ field: 'frequency', message: 'Please select a frequency' });
      }
      if (!data.scheduledDate) {
        errors.push({ field: 'scheduledDate', message: 'Date is required' });
      } else if (!validateDate(data.scheduledDate)) {
        errors.push({ field: 'scheduledDate', message: 'Please select today or a future date' });
      }
      if (!data.scheduledTime) {
        errors.push({ field: 'scheduledTime', message: 'Time is required' });
      } else if (!validateTime(data.scheduledTime)) {
        errors.push({ field: 'scheduledTime', message: 'Please select a valid time' });
      }
      break;

    case 6: // Add-ons (optional)
      break;

    case 7: // Summary (optional review step)
      break;

    case 8: // Checkout
      if (!data.firstName) {
        errors.push({ field: 'firstName', message: 'First name is required' });
      } else if (!validateName(data.firstName)) {
        errors.push({ field: 'firstName', message: 'First name must be at least 2 characters' });
      }
      if (!data.lastName) {
        errors.push({ field: 'lastName', message: 'Last name is required' });
      } else if (!validateName(data.lastName)) {
        errors.push({ field: 'lastName', message: 'Last name must be at least 2 characters' });
      }
      if (!data.email) {
        errors.push({ field: 'email', message: 'Email is required' });
      } else if (!validateEmail(data.email)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
      }
      if (!data.phone) {
        errors.push({ field: 'phone', message: 'Phone number is required' });
      } else if (!validatePhone(data.phone)) {
        errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
      }
      break;
  }

  return errors;
}
