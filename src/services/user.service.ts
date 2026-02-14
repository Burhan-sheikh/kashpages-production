// User Service - Firebase operations for user management
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { User, UserProfile, UserSettings } from '@/types';

export class UserService {
  /**
   * Create a new user document in Firestore
   */
  static async createUser(uid: string, data: Partial<User>): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    
    const userData: Omit<User, 'id'> = {
      uid,
      email: data.email!,
      displayName: data.displayName || '',
      photoURL: data.photoURL || null,
      phoneNumber: data.phoneNumber || null,
      role: 'user',
      status: 'active',
      plan: 'free',
      emailVerified: false,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      metadata: {
        onboardingCompleted: false,
        totalPages: 0,
        totalPublishedPages: 0,
      },
    };

    await setDoc(userRef, userData);
  }

  /**
   * Get user by ID
   */
  static async getUserById(uid: string): Promise<User | null> {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    return { id: userSnap.id, ...userSnap.data() } as User;
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    const usersRef = collection(db, COLLECTIONS.USERS);
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    uid: string,
    data: Partial<UserProfile>
  ): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Update user plan
   */
  static async updatePlan(uid: string, plan: User['plan']): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await updateDoc(userRef, {
      plan,
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Update user status (admin only)
   */
  static async updateStatus(
    uid: string,
    status: User['status']
  ): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await updateDoc(userRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Get user settings
   */
  static async getSettings(uid: string): Promise<UserSettings | null> {
    const settingsRef = doc(db, COLLECTIONS.USER_SETTINGS, uid);
    const settingsSnap = await getDoc(settingsRef);

    if (!settingsSnap.exists()) {
      return null;
    }

    return settingsSnap.data() as UserSettings;
  }

  /**
   * Update user settings
   */
  static async updateSettings(
    uid: string,
    settings: Partial<UserSettings>
  ): Promise<void> {
    const settingsRef = doc(db, COLLECTIONS.USER_SETTINGS, uid);
    await setDoc(settingsRef, settings, { merge: true });
  }

  /**
   * Increment page count
   */
  static async incrementPageCount(
    uid: string,
    published: boolean = false
  ): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const user = await this.getUserById(uid);
    
    if (!user) throw new Error('User not found');

    await updateDoc(userRef, {
      'metadata.totalPages': user.metadata.totalPages + 1,
      'metadata.totalPublishedPages': published
        ? user.metadata.totalPublishedPages + 1
        : user.metadata.totalPublishedPages,
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Complete onboarding
   */
  static async completeOnboarding(uid: string): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await updateDoc(userRef, {
      'metadata.onboardingCompleted': true,
      updatedAt: serverTimestamp(),
    });
  }
}
