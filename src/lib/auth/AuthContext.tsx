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
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { UserRole, UserDocument, COLLECTIONS } from '@/lib/firebase/collections';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  userDoc: UserDocument | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
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
  const [userDoc, setUserDoc] = useState<UserDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user document from Firestore
  const fetchUserDoc = async (uid: string) => {
    try {
      const userDocRef = doc(db, COLLECTIONS.USERS, uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        setUserDoc(userDocSnap.data() as UserDocument);
        
        // Update last login
        await updateDoc(userDocRef, {
          lastLoginAt: serverTimestamp(),
        });
      } else {
        // Create user document if it doesn't exist
        const newUserDoc: UserDocument = {
          uid,
          email: user?.email || '',
          displayName: user?.displayName || null,
          photoURL: user?.photoURL || null,
          role: UserRole.USER,
          phone: null,
          businessName: null,
          isEmailVerified: user?.emailVerified || false,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLoginAt: new Date(),
          isActive: true,
          settings: {
            notifications: true,
            emailUpdates: true,
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
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      await updateProfile(userCredential.user, { displayName });
      
      // Create user document
      const newUserDoc: UserDocument = {
        uid: userCredential.user.uid,
        email,
        displayName,
        photoURL: null,
        role: UserRole.USER,
        phone: null,
        businessName: null,
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
        isActive: true,
        settings: {
          notifications: true,
          emailUpdates: true,
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
