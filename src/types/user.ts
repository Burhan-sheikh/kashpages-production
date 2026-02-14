import { BaseDocument, Status, Plan, Timestamp } from './common';

export type UserRole = 'guest' | 'user' | 'admin';

export interface User extends BaseDocument {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  role: UserRole;
  status: Status;
  plan: Plan;
  emailVerified: boolean;
  lastLoginAt?: Timestamp;
  metadata: {
    onboardingCompleted: boolean;
    totalPages: number;
    totalPublishedPages: number;
  };
}

export interface UserProfile extends Omit<User, 'uid'> {
  bio?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  businessInfo?: {
    businessName?: string;
    category?: string;
    address?: string;
    phone?: string;
  };
}

export interface UserSettings {
  userId: string;
  notifications: {
    email: boolean;
    pageApproval: boolean;
    systemUpdates: boolean;
  };
  privacy: {
    showProfile: boolean;
    indexPages: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}
