'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User, AuthContextType, AuthCredentials, SignupData } from '../types';
import * as authService from '@/api/auth.service';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch full user data from Firestore
        const userData = await authService.getCurrentUserData(firebaseUser.uid);
        setCurrentUser(userData);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (credentials: AuthCredentials) => {
    const user = await authService.signIn(credentials.email, credentials.password);
    setCurrentUser(user);
  };

  const signup = async (data: SignupData) => {
    const user = await authService.signUp(data);
    setCurrentUser(user);
  };

  const loginWithGoogle = async () => {
    const user = await authService.signInWithGoogle();
    setCurrentUser(user);
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!currentUser) throw new Error('No user logged in');
    await authService.updateUserProfile(currentUser.id, data);
    setCurrentUser({ ...currentUser, ...data });
  };

  const sendEmailVerification = async () => {
    await authService.sendVerificationEmail();
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
    resetPassword,
    updateProfile,
    sendEmailVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
