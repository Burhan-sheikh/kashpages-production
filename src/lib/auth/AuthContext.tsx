'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { COLLECTIONS, UserRole } from '@/lib/firebase/collections';
import { UserProfile } from '@/types/platform';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  userDoc: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, username: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
  isUser: boolean;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Generate unique username
  const generateUsername = (displayName: string, uid: string): string => {
    const baseUsername = displayName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 15);
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `${baseUsername}${randomSuffix}`;
  };

  // Fetch user document from Firestore
  const fetchUserDoc = async (uid: string) => {
    try {
      const userDocRef = doc(db, COLLECTIONS.USERS, uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        setUserDoc(userDocSnap.data() as UserProfile);
        
        // Update last login
        await updateDoc(userDocRef, {
          lastLoginAt: serverTimestamp(),
        });
      } else {
        // Create user document if it doesn't exist (for Google OAuth)
        const username = generateUsername(user?.displayName || 'user', uid);
        
        const newUserDoc: UserProfile = {
          uid,
          username,
          email: user?.email || '',
          displayName: user?.displayName || '',
          phone: null,
          photoURL: user?.photoURL || null,
          bio: null,
          role: UserRole.USER,
          isVerified: false,
          isBlocked: false,
          isEmailVerified: user?.emailVerified || false,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          lastLoginAt: Timestamp.now(),
          settings: {
            notifications: true,
            emailUpdates: true,
            publicProfile: true,
          },
          stats: {
            totalPages: 0,
            publishedPages: 0,
            totalViews: 0,
          },
        };
        
        await setDoc(userDocRef, newUserDoc);
        setUserDoc(newUserDoc);
      }
    } catch (error) {
      console.error('Error fetching user document:', error);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        await fetchUserDoc(user.uid);
      } else {
        setUserDoc(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName: string, username: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      await updateProfile(userCredential.user, { displayName });
      
      // Create user document
      const newUserDoc: UserProfile = {
        uid: userCredential.user.uid,
        username,
        email,
        displayName,
        phone: null,
        photoURL: null,
        bio: null,
        role: UserRole.USER,
        isVerified: false,
        isBlocked: false,
        isEmailVerified: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastLoginAt: Timestamp.now(),
        settings: {
          notifications: true,
          emailUpdates: true,
          publicProfile: true,
        },
        stats: {
          totalPages: 0,
          publishedPages: 0,
          totalViews: 0,
        },
      };
      
      await setDoc(doc(db, COLLECTIONS.USERS, userCredential.user.uid), newUserDoc);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/');
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Role checks
  const isAdmin = userDoc?.role === UserRole.ADMIN;
  const isUser = userDoc?.role === UserRole.USER;
  const isGuest = !user;

  const value = {
    user,
    userDoc,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    isAdmin,
    isUser,
    isGuest,
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
