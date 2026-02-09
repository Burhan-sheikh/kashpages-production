import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  query,
  collection,
  where,
  getDocs,
  limit,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { User } from '@/features/auth/types';

// Get user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));

    if (!userDoc.exists()) {
      return null;
    }

    const data = userDoc.data();
    return {
      id: userDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as User;
  } catch (error: any) {
    console.error('Get user error:', error);
    return null;
  }
};

// Update user
export const updateUser = async (
  userId: string,
  data: Partial<User>
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    throw new Error(error.message || 'Failed to update user');
  }
};

// Upload avatar
export const uploadAvatar = async (
  userId: string,
  file: File
): Promise<string> => {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `avatars/${fileName}`);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Update user document with new photo URL
    await updateDoc(doc(db, 'users', userId), {
      photoURL: downloadURL,
      updatedAt: serverTimestamp(),
    });

    return downloadURL;
  } catch (error: any) {
    console.error('Upload avatar error:', error);
    throw new Error(error.message || 'Failed to upload avatar');
  }
};

// Check if username is available
export const checkUsernameAvailability = async (
  username: string
): Promise<boolean> => {
  try {
    const q = query(
      collection(db, 'users'),
      where('username', '==', username),
      limit(1)
    );

    const snapshot = await getDocs(q);
    return snapshot.empty;
  } catch (error: any) {
    console.error('Check username error:', error);
    return false;
  }
};

// Get user by username
export const getUserByUsername = async (
  username: string
): Promise<User | null> => {
  try {
    const q = query(
      collection(db, 'users'),
      where('username', '==', username),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const userDoc = snapshot.docs[0];
    const data = userDoc.data();

    return {
      id: userDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as User;
  } catch (error: any) {
    console.error('Get user by username error:', error);
    return null;
  }
};
