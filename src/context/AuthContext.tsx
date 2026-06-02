'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from profiles table
  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error.message);
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        avatar_url: data.avatar_url,
      };
    } catch (err) {
      console.error('Profile fetch failed:', err);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Fallback to localStorage for development without Supabase
      const savedUser = localStorage.getItem('pjc_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {}
      }
      setIsLoading(false);
      return;
    }

    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (currentSession?.user) {
          setSession(currentSession);
          const profile = await fetchProfile(currentSession.user.id);
          setUser(profile);
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);

        if (event === 'SIGNED_IN' && newSession?.user) {
          const profile = await fetchProfile(newSession.user.id);
          setUser(profile);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
        } else if (event === 'TOKEN_REFRESHED' && newSession?.user) {
          // Session refreshed, keep user data
          if (!user) {
            const profile = await fetchProfile(newSession.user.id);
            setUser(profile);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // LOGIN with email & password
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      // Fallback for dev without Supabase
      const users = JSON.parse(localStorage.getItem('pjc_users') || '[]');
      const found = users.find((u: any) => u.email === email && u.password === password);
      
      if (found || (email === 'demo@prasadjeans.com' && password === 'demo123')) {
        const userData = found || { id: 'demo-001', name: 'Demo User', email: 'demo@prasadjeans.com', phone: '9876543210' };
        const profile: UserProfile = { id: userData.id, name: userData.name, email: userData.email, phone: userData.phone, avatar_url: null };
        setUser(profile);
        localStorage.setItem('pjc_user', JSON.stringify(profile));
        return { success: true };
      }
      return { success: false, error: 'Invalid email or password' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login')) {
          return { success: false, error: 'Invalid email or password. Please check and try again.' };
        }
        if (error.message.includes('Email not confirmed')) {
          return { success: false, error: 'Please verify your email before logging in.' };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile = await fetchProfile(data.user.id);
        setUser(profile);
        return { success: true };
      }

      return { success: false, error: 'Something went wrong. Please try again.' };
    } catch (err: any) {
      return { success: false, error: 'Network error. Please check your connection.' };
    }
  };

  // REGISTER new user
  const register = async (name: string, email: string, phone: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      // Fallback for dev
      const users = JSON.parse(localStorage.getItem('pjc_users') || '[]');
      if (users.find((u: any) => u.email === email)) {
        return { success: false, error: 'Email already registered' };
      }
      const newUser = { id: `user-${Date.now()}`, name, email, phone, password };
      users.push(newUser);
      localStorage.setItem('pjc_users', JSON.stringify(users));
      const profile: UserProfile = { id: newUser.id, name, email, phone, avatar_url: null };
      setUser(profile);
      localStorage.setItem('pjc_user', JSON.stringify(profile));
      return { success: true };
    }

    try {
      // Validate inputs
      if (!name.trim() || name.trim().length < 2) {
        return { success: false, error: 'Name must be at least 2 characters' };
      }
      if (!email.trim() || !email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address' };
      }
      if (password.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters' };
      }
      if (phone && !/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
        return { success: false, error: 'Please enter a valid 10-digit phone number' };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name.trim(),
            phone: phone.trim(),
          },
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          return { success: false, error: 'This email is already registered. Please login instead.' };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        // If email confirmation is disabled in Supabase, user is immediately logged in
        if (data.session) {
          const profile = await fetchProfile(data.user.id);
          setUser(profile);
          return { success: true };
        }
        // If email confirmation required
        return { success: true, error: 'Please check your email to verify your account.' };
      }

      return { success: false, error: 'Registration failed. Please try again.' };
    } catch (err: any) {
      return { success: false, error: 'Network error. Please check your connection.' };
    }
  };

  // LOGOUT
  const logout = async () => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      localStorage.removeItem('pjc_user');
      return;
    }

    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (err) {
      console.error('Logout error:', err);
      // Force clear even if API fails
      setUser(null);
      setSession(null);
    }
  };

  // UPDATE PROFILE
  const updateProfile = async (data: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not logged in' };

    if (!isSupabaseConfigured()) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('pjc_user', JSON.stringify(updated));
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          phone: data.phone,
          avatar_url: data.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) return { success: false, error: error.message };

      setUser(prev => prev ? { ...prev, ...data } : prev);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Failed to update profile' };
    }
  };

  // RESET PASSWORD
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      return { success: true, error: 'Password reset not available in demo mode' };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to send reset email' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
