'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const CURRENT_USER_KEY = 'bazardor_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // পেজ লোড হলে সেভ করা সেশন লোড করা
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

  // সাইন ইন
  const signIn = async ({ email, password }) => {
    setIsLoading(true);
    try {
      if (!email || !password) {
        throw new Error('অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড দিন');
      }

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'লগইন ব্যর্থ হয়েছে');
      }

      let loggedInUser = data.user;

      if (!loggedInUser) {
        const namePart = email.split('@')[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        loggedInUser = {
          id: 'usr_' + Date.now(),
          name: formattedName || 'ব্যবহারকারী',
          email: email.trim(),
          image: null,
          provider: 'email'
        };
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

  // সাইন আপ (কাস্টম ইমেজ সাপোর্ট সহ)
  const signUp = async ({ name, email, password, image = null }) => {
    setIsLoading(true);
    try {
      if (!name || !email || !password) {
        throw new Error('সমস্ত তথ্য সঠিকভাবে পূরণ করুন');
      }

      if (password.length < 6) {
        throw new Error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      }

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, image: image || null })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'নিবন্ধন ব্যর্থ হয়েছে');
      }

      toast.success('নিবন্ধন সফল হয়েছে! এখন সাইন ইন করুন।');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'নিবন্ধন ব্যর্থ হয়েছে');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // সোশ্যাল সাইন ইন (গুগল ও গিটহাব)
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

  // ইউজার প্রোফাইল তথ্য আপডেট
  const updateUser = async ({ name, image }) => {
    if (!user) return { success: false };

    try {
      await fetch('/api/auth/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, name, image })
      });

      const updatedUser = {
        ...user,
        name: name.trim(),
        image: image !== undefined ? image : user.image
      };

      setUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

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
