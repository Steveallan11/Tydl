import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import {
  signUpCleaner,
  signInCleaner,
  signOutCleaner,
  getCurrentCleaner,
} from '../lib/supabase';

interface CleanerAuthContextType {
  user: User | null;
  cleaner: any;
  isLoggedIn: boolean;
  isLoading: boolean;
  signup: (email: string, password: string, firstName: string, lastName: string, postcode: string, phone: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const CleanerAuthContext = createContext<CleanerAuthContextType | undefined>(undefined);

export function CleanerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cleaner, setCleaner] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if cleaner is logged in on mount
  useEffect(() => {
    const checkCleaner = async () => {
      try {
        const currentCleaner = await getCurrentCleaner();
        if (currentCleaner) {
          setUser(currentCleaner.user);
          setCleaner(currentCleaner.cleaner);
        }
      } catch (err) {
        console.error('Failed to get current cleaner:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkCleaner();
  }, []);

  const signup = async (email: string, password: string, firstName: string, lastName: string, postcode: string, phone: string) => {
    try {
      setError(null);
      const result = await signUpCleaner(email, password, firstName, lastName, phone, postcode);
      setUser(result.user);
      setCleaner(result.cleaner);
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await signInCleaner(email, password);
      setUser(result.user);
      setCleaner(result.cleaner);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOutCleaner();
      setUser(null);
      setCleaner(null);
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
      throw err;
    }
  };

  const clearError = () => setError(null);

  const value: CleanerAuthContextType = {
    user,
    cleaner,
    isLoggedIn: user !== null,
    isLoading,
    signup,
    login,
    logout,
    error,
    clearError,
  };

  return (
    <CleanerAuthContext.Provider value={value}>
      {children}
    </CleanerAuthContext.Provider>
  );
}

export function useCleanerAuth() {
  const context = useContext(CleanerAuthContext);
  if (!context) {
    throw new Error('useCleanerAuth must be used within CleanerAuthProvider');
  }
  return context;
}
