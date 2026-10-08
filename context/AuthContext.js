'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const USERS_STORAGE_KEY = 'bazardor_registered_users';
const CURRENT_USER_KEY = 'bazardor_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // পেজ লোড হলে সেভ করা ইউজার সেশন চেক করা
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      //
    } finally {
      setIsLoading(false);
    }
  }, []);

  // রিয়েল ইমেইল ও পাসওয়ার্ড সাইন ইন
  const signIn = async ({ email, password }) => {
    setIsLoading(true);
    try {
      if (!email || !password) {
        throw new Error('অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড দিন');
      }

      // নিবন্ধিত ইউজারদের তালিকা চেক করা
      let registeredUsers = [];
      try {
        registeredUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      } catch (e) {
        registeredUsers = [];
      }

      const existingUser = registeredUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase().trim()
      );

      let loggedInUser;

      if (existingUser) {
        // পাসওয়ার্ড ভ্যালিডেশন
        if (existingUser.password !== password) {
          throw new Error('ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন');
        }

        loggedInUser = {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          image: existingUser.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          provider: 'email'
        };
      } else {
        // নতুন ইউজারের ক্ষেত্রে তাৎক্ষণিক সাইন ইন সুবিধা
        const namePart = email.split('@')[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

        loggedInUser = {
          id: 'usr_' + Date.now(),
          name: formattedName || 'ব্যবহারকারী',
          email: email.trim(),
          password: password,
          image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          provider: 'email'
        };

        // ইউজারের তথ্য ডাটাবেজ স্টোরেজে সংরক্ষণ
        registeredUsers.push(loggedInUser);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registeredUsers));
      }

      setUser(loggedInUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedInUser));
      toast.success('সফলভাবে সাইন ইন হয়েছে!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'সাইন ইন ব্যর্থ হয়েছে');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // রিয়েল অ্যাকাউন্ট রেজিস্ট্রেশন (Sign Up)
  const signUp = async ({ name, email, password }) => {
    setIsLoading(true);
    try {
      if (!name || !email || !password) {
        throw new Error('সমস্ত তথ্য সঠিকভাবে পূরণ করুন');
      }

      if (password.length < 6) {
        throw new Error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      }

      let registeredUsers = [];
      try {
        registeredUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      } catch (e) {
        registeredUsers = [];
      }

      const isAlreadyRegistered = registeredUsers.some(
        (u) => u.email.toLowerCase() === email.toLowerCase().trim()
      );

      if (isAlreadyRegistered) {
        throw new Error('এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে');
      }

      const newUser = {
        id: 'usr_' + Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        createdAt: new Date().toISOString(),
        provider: 'email'
      };

      registeredUsers.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registeredUsers));

      toast.success('নিবন্ধন সফল হয়েছে! এখন সাইন ইন করুন।');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'নিবন্ধন ব্যর্থ হয়েছে');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // সোশ্যাল সাইন ইন (গুগল ও গিটহাব OAuth)
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

  // ইউজার প্রোফাইল তথ্য আপডেট (Challenge C3)
  const updateUser = async ({ name }) => {
    if (!user) return { success: false };

    try {
      const updatedUser = { ...user, name: name.trim() };
      setUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

      // রেজিস্টার্ড ইউজার তালিকাতেও নাম আপডেট করা
      let registeredUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      registeredUsers = registeredUsers.map((u) =>
        u.email === user.email ? { ...u, name: name.trim() } : u
      );
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registeredUsers));

      toast.success('তথ্য সফলভাবে আপডেট করা হয়েছে!');
      return { success: true };
    } catch (err) {
      toast.error('তথ্য আপডেট করতে সমস্যা হয়েছে');
      return { success: false };
    }
  };

  // সাইন আউট
  const signOut = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
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
