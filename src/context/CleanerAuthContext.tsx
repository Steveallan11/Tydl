import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';

interface CleanerAuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  signup: (email: string, password: string, firstName: string, lastName: string, postcode: string, phone: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const CleanerAuthContext = createContext<CleanerAuthContextType | undefined>(undefined);

// Mock cleaner auth for MVP (replace with Supabase later)
const mockSignUp = async (email: string, password: string, firstName: string, lastName: string, postcode: string, phone: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Store in localStorage for MVP
  const cleaner = {
    id: `cleaner-${Date.now()}`,
    email,
    firstName,
    lastName,
    postcode,
    phone,
    verificationStatus: 'pending',
    jobsCompleted: 0,
    rating: 0,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(`cleaner:${cleaner.id}`, JSON.stringify(cleaner));
  localStorage.setItem('cleaner:current_id', cleaner.id);
};

const mockLogin = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // For MVP, just create a session
  localStorage.setItem('cleaner:session_email', email);
};

const mockLogout = async () => {
  localStorage.removeItem('cleaner:current_id');
  localStorage.removeItem('cleaner:session_email');
};

const mockGetCurrentCleaner = async () => {
  const cleanerId = localStorage.getItem('cleaner:current_id');
  if (!cleanerId) return null;

  const data = localStorage.getItem(`cleaner:${cleanerId}`);
  return data ? JSON.parse(data) : null;
};

export function CleanerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if cleaner is logged in on mount
  useEffect(() => {
    const checkCleaner = async () => {
      try {
        const cleaner = await mockGetCurrentCleaner();
        // We use a mock user object for now
        if (cleaner) {
          setUser({
            id: cleaner.id,
            email: cleaner.email,
            app_metadata: {},
            user_metadata: { firstName: cleaner.firstName, lastName: cleaner.lastName },
            aud: '',
            confirmation_sent_at: null,
            confirmed_at: null,
            email_confirmed_at: null,
            phone_confirmed_at: null,
            created_at: cleaner.createdAt,
            updated_at: cleaner.createdAt,
          } as any);
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
      await mockSignUp(email, password, firstName, lastName, postcode, phone);
      setUser({
        id: `cleaner-${Date.now()}`,
        email,
        app_metadata: {},
        user_metadata: { firstName, lastName },
        aud: '',
        confirmation_sent_at: null,
        confirmed_at: null,
        email_confirmed_at: null,
        phone_confirmed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any);
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await mockLogin(email, password);
      setUser({
        id: `cleaner-${Date.now()}`,
        email,
        app_metadata: {},
        user_metadata: {},
        aud: '',
        confirmation_sent_at: null,
        confirmed_at: null,
        email_confirmed_at: null,
        phone_confirmed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await mockLogout();
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
      throw err;
    }
  };

  const clearError = () => setError(null);

  const value: CleanerAuthContextType = {
    user,
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
