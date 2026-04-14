import { ServiceType, PropertySize, AddOn, Frequency } from '../types/booking';
import { ADD_ONS } from './constants';

/**
 * Base prices for each service type and property size
 * These are the core prices that everything else builds on
 */
const BASE_PRICES: Record<ServiceType, Record<PropertySize, number>> = {
  'regular-clean': {
    studio: 60,
    'one-bed': 75,
    'two-bed': 90,
    'three-bed': 105,
    'four-plus': 120,
  },
  'one-off-clean': {
    studio: 70,
    'one-bed': 85,
    'two-bed': 100,
    'three-bed': 120,
    'four-plus': 140,
  },
  'deep-clean': {
    studio: 90,
    'one-bed': 110,
    'two-bed': 130,
    'three-bed': 160,
    'four-plus': 190,
  },
  'end-of-tenancy': {
    studio: 100,
    'one-bed': 130,
    'two-bed': 160,
    'three-bed': 200,
    'four-plus': 240,
  },
};

/**
 * Frequency multipliers
 * These apply to the total price based on booking frequency
 */
const FREQUENCY_MULTIPLIERS: Record<Frequency, number> = {
  once: 1.0, // No multiplier
  weekly: 1.0, // No discount for weekly
  biweekly: 1.0, // No discount for biweekly
  monthly: 1.0, // No discount for monthly
};

export interface PricingBreakdown {
  basePrice: number;
  addOnsTotal: number;
  subtotal: number;
  frequencyMultiplier: number;
  totalPrice: number;
  details: {
    baseService: string;
    addOns: Array<{ name: string; price: number }>;
  };
}

/**
 * Calculate the base price for a service
 */
export function calculateBasePrice(
  serviceType: ServiceType | undefined,
  propertySize: PropertySize | undefined
): number {
  if (!serviceType || !propertySize) return 0;
  return BASE_PRICES[serviceType][propertySize] || 0;
}

/**
 * Calculate total add-ons cost
 */
export function calculateAddOnsTotal(addOns: AddOn[]): number {
  return addOns.reduce((total, addOn) => {
    const price = ADD_ONS[addOn]?.basePrice || 0;
    return total + price;
  }, 0);
}

/**
 * Get frequency multiplier
 */
export function getFrequencyMultiplier(frequency: Frequency | undefined): number {
  if (!frequency) return 1.0;
  return FREQUENCY_MULTIPLIERS[frequency] || 1.0;
}

/**
 * Calculate full pricing breakdown
 * This is the main function used throughout the booking flow
 */
export function calculatePricing(
  serviceType: ServiceType | undefined,
  propertySize: PropertySize | undefined,
  addOns: AddOn[] = [],
  frequency: Frequency | undefined = 'once'
): PricingBreakdown {
  const basePrice = calculateBasePrice(serviceType, propertySize);
  const addOnsTotal = calculateAddOnsTotal(addOns);
  const subtotal = basePrice + addOnsTotal;
  const frequencyMultiplier = getFrequencyMultiplier(frequency);
  const totalPrice = Math.round(subtotal * frequencyMultiplier * 100) / 100;

  // Build details for display
  const addOnsDetails = addOns.map((addOn) => ({
    name: ADD_ONS[addOn]?.label || addOn,
    price: ADD_ONS[addOn]?.basePrice || 0,
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
    addOnsTotal,
    subtotal,
    frequencyMultiplier,
    totalPrice,
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
