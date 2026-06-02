'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('pjc_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // For now, simple local auth - will connect to Supabase
      const users = JSON.parse(localStorage.getItem('pjc_users') || '[]');
      const found = users.find((u: any) => u.email === email && u.password === password);
      
      if (found) {
        const userData: User = { id: found.id, name: found.name, email: found.email, phone: found.phone };
        setUser(userData);
        localStorage.setItem('pjc_user', JSON.stringify(userData));
        return true;
      }
      
      // Demo account
      if (email === 'demo@prasadjeans.com' && password === 'demo123') {
        const demoUser: User = { id: 'demo-001', name: 'Demo User', email: 'demo@prasadjeans.com', phone: '9876543210' };
        setUser(demoUser);
        localStorage.setItem('pjc_user', JSON.stringify(demoUser));
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('pjc_users') || '[]');
      const exists = users.find((u: any) => u.email === email);
      
      if (exists) return false;
      
      const newUser = { id: `user-${Date.now()}`, name, email, phone, password };
      users.push(newUser);
      localStorage.setItem('pjc_users', JSON.stringify(users));
      
      const userData: User = { id: newUser.id, name, email, phone };
      setUser(userData);
      localStorage.setItem('pjc_user', JSON.stringify(userData));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pjc_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
