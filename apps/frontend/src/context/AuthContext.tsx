'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Hostel {
  id: string;
  name: string;
  slug: string;
  plan: string;
}

interface AuthContextType {
  user: User | null;
  hostel: Hostel | null;
  token: string | null;
  login: (token: string, user: User, hostel: Hostel) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load auth data from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedHostel = localStorage.getItem('hostel');

    if (storedToken && storedUser && storedHostel) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setHostel(JSON.parse(storedHostel));
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        localStorage.clear();
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User, newHostel: Hostel) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('hostel', JSON.stringify(newHostel));
    
    setToken(newToken);
    setUser(newUser);
    setHostel(newHostel);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setHostel(null);
    router.push('/auth/login');
  };

  const isAuthenticated = !!token && !!user && !!hostel;

  return (
    <AuthContext.Provider
      value={{
        user,
        hostel,
        token,
        login,
        logout,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
