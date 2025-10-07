import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/utils/api';

// User type definition
export interface User {
  id: number;
  email: string;
  username: string | null;
  full_name: string | null;
  phone: string | null;
  locale: string;
  avatar_url: string | null;
  bio: string | null;
  is_active: boolean;
  is_email_verified: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

// Context type
interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUserProfile: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
}

// Create context
const UserContext = createContext<UserContextType | null>(null);

// Provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile from API
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiRequest('/api/auth/me');
      
      if (data && data.user) {
        setUser(data.user);
        // Update localStorage with complete user data
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
      
      // If token is invalid, clear everything
      if (err instanceof Error && err.message.includes('401')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Update user data
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUser(null);
    setError(null);
  };

  // Load user data on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Failed to parse stored user data:', err);
        handleLogout();
      }
    }
    
    setLoading(false);
  }, []);

  const value: UserContextType = {
    user,
    loading,
    error,
    fetchUserProfile,
    updateUser,
    logout: handleLogout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Hook to use user context
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserContext;
