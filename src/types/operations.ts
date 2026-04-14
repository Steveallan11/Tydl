export type CleanerVerificationStatus =
  | 'pending'
  | 'verified'
  | 'rejected';

export interface Cleaner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postcode: string; // service area
  verificationStatus: CleanerVerificationStatus;
  jobsCompleted: number;
  rating: number; // 0-5 average
  availability: DayAvailability;
  currentJobId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DayAvailability {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'support';
  createdAt: string;
}
