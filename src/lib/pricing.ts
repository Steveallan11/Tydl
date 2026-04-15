import { ServiceType, PropertySize, AddOn, Frequency } from '../types/booking';
import { ADD_ONS } from './constants';

/**
 * Customer-facing prices by service type, property size, and frequency
 * Based on Tydl pricing spreadsheet
 */
const CUSTOMER_PRICES: Record<ServiceType, Record<PropertySize, Record<Frequency, number>>> = {
  'regular-clean': {
    studio: { once: 49, weekly: 49, biweekly: 50, monthly: 55 },
    'one-bed': { once: 65, weekly: 65, biweekly: 66, monthly: 70 },
    'two-bed': { once: 75, weekly: 75, biweekly: 76, monthly: 80 },
    'three-bed': { once: 90, weekly: 90, biweekly: 92, monthly: 98 },
    'four-plus': { once: 109, weekly: 109, biweekly: 110, monthly: 115 },
  },
  'one-off-clean': {
    studio: { once: 59, weekly: 59, biweekly: 59, monthly: 59 },
    'one-bed': { once: 75, weekly: 75, biweekly: 75, monthly: 75 },
    'two-bed': { once: 89, weekly: 89, biweekly: 89, monthly: 89 },
    'three-bed': { once: 104, weekly: 104, biweekly: 104, monthly: 104 },
    'four-plus': { once: 119, weekly: 119, biweekly: 119, monthly: 119 },
  },
  'deep-clean': {
    studio: { once: 115, weekly: 115, biweekly: 115, monthly: 115 },
    'one-bed': { once: 145, weekly: 145, biweekly: 145, monthly: 145 },
    'two-bed': { once: 175, weekly: 175, biweekly: 175, monthly: 175 },
    'three-bed': { once: 220, weekly: 220, biweekly: 220, monthly: 220 },
    'four-plus': { once: 269, weekly: 269, biweekly: 269, monthly: 269 },
  },
  'end-of-tenancy': {
    studio: { once: 175, weekly: 175, biweekly: 175, monthly: 175 },
    'one-bed': { once: 240, weekly: 240, biweekly: 240, monthly: 240 },
    'two-bed': { once: 310, weekly: 310, biweekly: 310, monthly: 310 },
    'three-bed': { once: 385, weekly: 385, biweekly: 385, monthly: 385 },
    'four-plus': { once: 465, weekly: 465, biweekly: 465, monthly: 465 },
  },
};

/**
 * Cleaner hourly rates by service type
 */
const CLEANER_HOURLY_RATES: Record<ServiceType, number> = {
  'regular-clean': 16, // £16/hour (or £16.50 for monthly)
  'one-off-clean': 17, // £17/hour
  'deep-clean': 18, // £18/hour with condition uplifts
  'end-of-tenancy': 18, // £18/hour with condition flags
};

/**
 * Expected duration (in hours) for each service by property size
 */
const SERVICE_DURATION: Record<ServiceType, Record<PropertySize, number>> = {
  'regular-clean': {
    studio: 2.5,
    'one-bed': 3,
    'two-bed': 3.5,
    'three-bed': 4.5,
    'four-plus': 5.5,
  },
  'one-off-clean': {
    studio: 2.75,
    'one-bed': 3.25,
    'two-bed': 3.75,
    'three-bed': 4.75,
    'four-plus': 5.75,
  },
  'deep-clean': {
    studio: 4.5,
    'one-bed': 5.5,
    'two-bed': 6.5,
    'three-bed': 8.5,
    'four-plus': 10.5,
  },
  'end-of-tenancy': {
    studio: 6,
    'one-bed': 8,
    'two-bed': 10,
    'three-bed': 14,
    'four-plus': 18,
  },
};

/**
 * Add-on pricing and cleaner payouts
 */
const ADD_ON_RATES: Record<string, { customerPrice: number; cleanerPayout: number; duration: number }> = {
  oven: { customerPrice: 25, cleanerPayout: 18, duration: 0.75 }, // 45 min
  fridge: { customerPrice: 12, cleanerPayout: 8, duration: 0.33 }, // 20 min
  'interior-windows': { customerPrice: 25, cleanerPayout: 18, duration: 0.75 },
  'bed-change': { customerPrice: 6, cleanerPayout: 6, duration: 0.25 },
  'products-pack': { customerPrice: 5, cleanerPayout: 0, duration: 0 },
  'full-kit': { customerPrice: 18, cleanerPayout: 0, duration: 0 },
};

export interface JobFinancial {
  customerPrice: number;
  cleanerPayout: number;
  platformFee: number;
  margin: number;
  expectedDuration: number;
}

export interface PricingBreakdown {
  basePrice: number;
  addOnsTotal: number;
  subtotal: number;
  totalPrice: number;
  cleanerPayout: number;
  platformFee: number;
  margin: number;
  expectedDuration: number;
  details: {
    baseService: string;
    addOns: Array<{ name: string; customerPrice: number; cleanerPayout: number }>;
  };
}

/**
 * Calculate customer price
 */
export function calculateCustomerPrice(
  serviceType: ServiceType | undefined,
  propertySize: PropertySize | undefined,
  frequency: Frequency | undefined = 'once'
): number {
  if (!serviceType || !propertySize) return 0;
  return CUSTOMER_PRICES[serviceType][propertySize][frequency] || 0;
}

/**
 * Calculate cleaner payout for a job (hourly × duration)
 * Can include condition uplifts for deep-clean and end-of-tenancy
 */
export function calculateCleanerPayout(
  serviceType: ServiceType | undefined,
  propertySize: PropertySize | undefined,
  conditionUplift: number = 1.0 // 1.0 = normal, 1.15 = heavy, 1.30 = severe
): number {
  if (!serviceType || !propertySize) return 0;

  const hourlyRate = CLEANER_HOURLY_RATES[serviceType];
  const duration = SERVICE_DURATION[serviceType][propertySize];

  return Math.round(hourlyRate * duration * conditionUplift * 100) / 100;
}

/**
 * Calculate total add-ons cost and cleaner payout for add-ons
 */
export function calculateAddOnsTotals(addOns: AddOn[]): { customer: number; cleaner: number; duration: number } {
  return addOns.reduce(
    (totals, addOn) => {
      const rate = ADD_ON_RATES[addOn];
      if (!rate) return totals;

      return {
        customer: totals.customer + rate.customerPrice,
        cleaner: totals.cleaner + rate.cleanerPayout,
        duration: totals.duration + rate.duration,
      };
    },
    { customer: 0, cleaner: 0, duration: 0 }
  );
}

/**
 * Calculate full pricing breakdown including cleaner payout
 */
export function calculatePricing(
  serviceType: ServiceType | undefined,
  propertySize: PropertySize | undefined,
  addOns: AddOn[] = [],
  frequency: Frequency | undefined = 'once',
  conditionUplift: number = 1.0 // For deep-clean condition tracking
): PricingBreakdown {
  const basePrice = calculateCustomerPrice(serviceType, propertySize, frequency);
  const addOnsTotals = calculateAddOnsTotals(addOns);
  const subtotal = basePrice + addOnsTotals.customer;

  // Calculate cleaner payout
  const baseCleanerPayout = calculateCleanerPayout(serviceType, propertySize, conditionUplift);
  const cleanerPayout = Math.round((baseCleanerPayout + addOnsTotals.cleaner) * 100) / 100;

  // Platform margin
  const platformFee = subtotal - cleanerPayout;
  const margin = subtotal > 0 ? Math.round((platformFee / subtotal) * 100) : 0;

  // Expected duration (for job scheduling)
  const baseDuration = (serviceType && propertySize && SERVICE_DURATION[serviceType][propertySize]) || 0;
  const expectedDuration = baseDuration + addOnsTotals.duration;

  // Build details for display
  const addOnsDetails = addOns.map((addOn) => ({
    name: ADD_ONS[addOn]?.label || addOn,
    customerPrice: ADD_ON_RATES[addOn]?.customerPrice || 0,
    cleanerPayout: ADD_ON_RATES[addOn]?.cleanerPayout || 0,
  }));

  let baseServiceLabel = '';
  if (serviceType) {
    const serviceLabels: Record<ServiceType, string> = {
      'regular-clean': 'Regular Clean',
      'one-off-clean': 'One-Off Clean',
      'deep-clean': 'Deep Clean',
      'end-of-tenancy': 'End of Tenancy Clean',
    };
    baseServiceLabel = serviceLabels[serviceType];
  }

  return {
    basePrice,
    addOnsTotal: addOnsTotals.customer,
    subtotal,
    totalPrice: subtotal,
    cleanerPayout,
    platformFee,
    margin,
    expectedDuration,
    details: {
      baseService: baseServiceLabel,
      addOns: addOnsDetails,
    },
  };
}

/**
 * Format price as GBP currency string
 */
export function formatPrice(price: number): string {
  return `£${price.toFixed(2)}`;
}

/**
 * Format price for display (short version)
 */
export function formatPriceShort(price: number): string {
  return `£${Math.round(price)}`;
}
