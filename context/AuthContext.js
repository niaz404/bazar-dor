'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const STORAGE_KEY = 'bazardor_auth_user';
const USERS_DB_KEY = 'bazardor_registered_users';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth from localStorage on client load
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Default demo user so testing is super easy if desired
        const defaultUser = {
          id: 'usr_demo123',
          name: 'রেজওয়ান আহমেদ',
          email: 'rezwan@bazardor.com',
          image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          createdAt: new Date().toISOString()
        };
        // We can keep it null by default or let user login
      }
    } catch (e) {
      console.error('Failed to load user session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save session helper
  const saveSession = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      // Also set cookie for SSR if needed
      document.cookie = `bazardor_token=active; path=/; max-age=86400`;
    } else {
      localStorage.removeItem(STORAGE_KEY);
      document.cookie = `bazardor_token=; path=/; max-age=0`;
    }
  };

  // Sign in with Email and Password
  const signIn = async ({ email, password }) => {
    setIsLoading(true);
    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (!email || !password) {
        throw new Error('অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড সঠিকভাবে দিন');
      }

      if (password.length < 6) {
        throw new Error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      }

      // Check registered users in localStorage
      let users = [];
      try {
        users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
      } catch (e) {}

      const foundUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      let authUser;
      if (foundUser) {
        authUser = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          image: foundUser.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          createdAt: foundUser.createdAt
        };
      } else {
        // Allow login with newly entered credentials for seamless testing
        const namePart = email.split('@')[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        authUser = {
          id: `usr_${Date.now()}`,
          name: formattedName,
          email: email,
          image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          createdAt: new Date().toISOString()
        };
      }

      saveSession(authUser);
      toast.success('সফলভাবে সাইন ইন হয়েছে! স্বাগতম।', { id: 'auth-success' });
      return { success: true, user: authUser };
    } catch (err) {
      toast.error(err.message || 'সাইন ইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।', { id: 'auth-error' });
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with Name, Email and Password
  const signUp = async ({ name, email, password }) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (!name || name.trim().length < 2) {
        throw new Error('অনুগ্রহ করে আপনার পুরো নাম সঠিকভাবে লিখুন');
      }
      if (!email || !email.includes('@')) {
        throw new Error('একটি সঠিক ইমেইল ঠিকানা দিন');
      }
      if (!password || password.length < 6) {
        throw new Error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      }

      // Check existing users
      let users = [];
      try {
        users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
      } catch (e) {}

      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        throw new Error('এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে');
      }

      const newUser = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password,
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

      toast.success('নিবন্ধন সফল হয়েছে! এখন সাইন ইন করুন।', { id: 'signup-success' });
      return { success: true, user: newUser };
    } catch (err) {
      toast.error(err.message || 'নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।', { id: 'signup-error' });
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Social Sign In (Google / GitHub)
  const signInWithSocial = async (provider) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const isGoogle = provider.toLowerCase() === 'google';
      const socialUser = {
        id: `usr_${provider}_${Date.now()}`,
        name: isGoogle ? 'রেজওয়ান আহমেদ' : 'ডেভেলপার ব্যবহারকারী',
        email: isGoogle ? 'rezwan.google@bazardor.com' : 'dev.github@bazardor.com',
        image: isGoogle
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
          : 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
        provider: provider,
        createdAt: new Date().toISOString()
      };

      saveSession(socialUser);
      toast.success(`${isGoogle ? 'গুগল' : 'গিটহাব'} দিয়ে সফলভাবে সাইন ইন হয়েছে!`, { id: 'social-success' });
      return { success: true, user: socialUser };
    } catch (err) {
      toast.error('সোশ্যাল লগইন ব্যর্থ হয়েছে।', { id: 'social-error' });
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Update user information (Challenge C3)
  const updateUser = async ({ name, image }) => {
    if (!user) {
      toast.error('আপনি লগইন অবস্থায় নেই');
      return { success: false, error: 'User not logged in' };
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updated = {
        ...user,
        name: name ? name.trim() : user.name,
        image: image || user.image
      };

      saveSession(updated);

      // Update in registered users db as well
      try {
        let users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
        users = users.map((u) => (u.id === user.id ? { ...u, name: updated.name, image: updated.image } : u));
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
      } catch (e) {}

      toast.success('ব্যবহারকারীর তথ্য সফলভাবে আপডেট করা হয়েছে!', { id: 'profile-update-success' });
      return { success: true, user: updated };
    } catch (err) {
      toast.error('তথ্য আপডেট করতে সমস্যা হয়েছে', { id: 'profile-update-error' });
      return { success: false, error: err.message };
    }
  };

  // Sign out
  const signOut = () => {
    saveSession(null);
    toast.success('সফলভাবে সাইন আউট হয়েছেন।', { id: 'signout-success' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signInWithSocial,
        updateUser,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
