import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'support';
}

interface AuthContextType {
  user: AdminUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Test credentials for MVP
const TEST_ADMINS = [
  { id: 'admin-001', email: 'admin@tydl.com', password: 'tydl2026', role: 'admin' as const },
  { id: 'admin-002', email: 'support@tydl.com', password: 'support123', role: 'support' as const },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('admin:user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to restore user session:', error);
        localStorage.removeItem('admin:user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check credentials against test admins
    const adminUser = TEST_ADMINS.find(
      admin => admin.email === email && admin.password === password
    );

    if (adminUser) {
      const userData: AdminUser = {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
      };
      setUser(userData);
      localStorage.setItem('admin:user', JSON.stringify(userData));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin:user');
  };

  const value: AuthContextType = {
    user,
    isLoggedIn: user !== null,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
