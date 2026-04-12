import { ServiceType, PropertySize, AddOn } from '../types/booking';

export const SERVICES: Record<ServiceType, { label: string; description: string }> = {
  'regular-clean': {
    label: 'Regular Clean',
    description: 'Weekly or biweekly cleaning for busy households',
  },
  'one-off-clean': {
    label: 'One-Off Clean',
    description: 'One-time deep clean for a specific occasion',
  },
  'deep-clean': {
    label: 'Deep Clean',
    description: 'Thorough cleaning of every corner and crevice',
  },
  'end-of-tenancy': {
    label: 'End of Tenancy Clean',
    description: 'Move-out cleaning to get your deposit back',
  },
};

export const PROPERTY_SIZES: Record<PropertySize, string> = {
  studio: 'Studio',
  'one-bed': '1 Bedroom',
  'two-bed': '2 Bedrooms',
  'three-bed': '3 Bedrooms',
  'four-plus': '4+ Bedrooms',
};

export const ADD_ONS: Record<AddOn, { label: string; basePrice: number }> = {
  oven: { label: 'Oven Clean', basePrice: 25 },
  fridge: { label: 'Fridge Clean', basePrice: 20 },
  windows: { label: 'Interior Windows', basePrice: 30 },
  bedchange: { label: 'Bed Change', basePrice: 15 },
  productspack: { label: 'Products Pack', basePrice: 10 },
  fullkit: { label: 'Full Kit', basePrice: 50 },
};

export const FREQUENCIES = {
  once: 'One-time booking',
  weekly: 'Weekly',
  biweekly: 'Every 2 weeks',
  monthly: 'Monthly',
};

export const BOOKING_STATUSES = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  assigned: 'Assigned',
  'in-progress': 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const BOOKING_STEPS = [
  { path: '/book/postcode', label: 'Postcode', step: 1 },
  { path: '/book/service', label: 'Service', step: 2 },
  { path: '/book/property', label: 'Property', step: 3 },
  { path: '/book/supplies', label: 'Supplies', step: 4 },
  { path: '/book/frequency', label: 'Frequency', step: 5 },
  { path: '/book/addons', label: 'Add-ons', step: 6 },
  { path: '/book/summary', label: 'Summary', step: 7 },
  { path: '/book/checkout', label: 'Checkout', step: 8 },
  { path: '/book/confirmation', label: 'Confirmation', step: 9 },
];
