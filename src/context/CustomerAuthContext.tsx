import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import {
  signUpCustomer,
  signInCustomer,
  signOutCustomer,
  getCurrentCustomer,
} from '../lib/supabase';

interface CustomerAuthContextType {
  user: User | null;
  customer: any;
  isLoggedIn: boolean;
  isLoading: boolean;
  signup: (email: string, password: string, firstName: string, lastName: string, postcode: string, phone: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentCustomer();
        if (currentUser) {
          setUser(currentUser.user);
          setCustomer(currentUser.customer);
        }
      } catch (err) {
        console.error('Failed to get current user:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const signup = async (email: string, password: string, firstName: string, lastName: string, postcode: string, phone: string) => {
    try {
      setError(null);
      const result = await signUpCustomer(email, password, firstName, lastName, postcode, phone);
      setUser(result.user);
      setCustomer(result.customer);
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await signInCustomer(email, password);
      setUser(result.user);
      setCustomer(result.customer);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOutCustomer();
      setUser(null);
      setCustomer(null);
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
      throw err;
    }
  };

  const clearError = () => setError(null);

  const value: CustomerAuthContextType = {
    user,
    customer,
    isLoggedIn: user !== null,
    isLoading,
    signup,
    login,
    logout,
    error,
    clearError,
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  }
  return context;
}
