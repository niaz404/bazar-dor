'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bazardor_user');
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      //
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = async ({ email, password }) => {
    setIsLoading(true);
    try {
      if (!email || !password) {
        throw new Error('অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড দিন');
      }

      const namePart = email.split('@')[0];
      const userName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

      const loggedInUser = {
        id: 'usr_' + Date.now(),
        name: userName || 'ব্যবহারকারী',
        email: email,
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      };

      setUser(loggedInUser);
      localStorage.setItem('bazardor_user', JSON.stringify(loggedInUser));
      toast.success('সফলভাবে সাইন ইন হয়েছে!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'সাইন ইন ব্যর্থ হয়েছে');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async ({ name, email, password }) => {
    setIsLoading(true);
    try {
      if (!name || !email || !password) {
        throw new Error('সমস্ত তথ্য সঠিকভাবে পূরণ করুন');
      }

      const newUser = {
        id: 'usr_' + Date.now(),
        name: name.trim(),
        email: email.trim(),
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      };

      setUser(newUser);
      localStorage.setItem('bazardor_user', JSON.stringify(newUser));
      toast.success('নিবন্ধন সফল হয়েছে!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'নিবন্ধন ব্যর্থ হয়েছে');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithSocial = async (provider, redirectPath = '/') => {
    const prov = provider.toLowerCase();
    if (prov === 'google') {
      window.location.href = `/api/auth/google?redirect=${encodeURIComponent(redirectPath)}`;
      return { success: true };
    } else if (prov === 'github') {
      window.location.href = `/api/auth/github?redirect=${encodeURIComponent(redirectPath)}`;
      return { success: true };
    }
    return { success: false };
  };

  const updateUser = async ({ name }) => {
    if (!user) return { success: false };

    const updatedUser = { ...user, name: name.trim() };
    setUser(updatedUser);
    localStorage.setItem('bazardor_user', JSON.stringify(updatedUser));
    toast.success('নাম সফলভাবে আপডেট করা হয়েছে!');
    return { success: true };
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('bazardor_user');
    toast.success('সাইন আউট সম্পন্ন হয়েছে');
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
  return useContext(AuthContext);
}
