export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  postcode: string;
  fullAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerSession {
  customerId: string;
  email: string;
  firstName: string;
}
