export type ServiceType =
  | 'regular-clean'
  | 'one-off-clean'
  | 'deep-clean'
  | 'end-of-tenancy';

export type PropertySize =
  | 'studio'
  | 'one-bed'
  | 'two-bed'
  | 'three-bed'
  | 'four-plus';

export type SuppliesOption = 'customer' | 'platform';

export type Frequency = 'once' | 'weekly' | 'biweekly' | 'monthly';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'assigned'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

export type AddOn =
  | 'oven'
  | 'fridge'
  | 'windows'
  | 'bedchange'
  | 'productspack'
  | 'fullkit';

export interface Booking {
  id: string;
  customerId: string;
  status: BookingStatus;
  serviceType: ServiceType;
  propertySize: PropertySize;
  supplies: SuppliesOption;
  frequency: Frequency;
  addOns: AddOn[];
  totalPrice: number;
  scheduledDate: string; // ISO 8601
  scheduledTime: string; // HH:mm
  assignedCleanerId?: string;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingFormData {
  serviceType?: ServiceType;
  postcode?: string;
  propertySize?: PropertySize;
  supplies?: SuppliesOption;
  frequency?: Frequency;
  addOns: AddOn[];
  scheduledDate?: string;
  scheduledTime?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}
