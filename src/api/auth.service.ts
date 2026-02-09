import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updatePassword,
  deleteUser,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, SignupData } from '@/features/auth/types';
import slugify from 'slugify';

const googleProvider = new GoogleAuthProvider();

// Sign up with email and password
export const signUp = async (data: SignupData): Promise<User> => {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // Create username from name
    const username = slugify(data.username || data.name, {
      lower: true,
      strict: true,
    });

    // Create user document in Firestore
    const userData: Omit<User, 'id'> = {
      name: data.name,
      username,
      email: data.email,
      phone: data.phone || '',
      photoURL: '',
      bio: '',
      role: 'user',
      createdAt: new Date(),
      isVerified: false,
      isBlocked: false,
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), {
      ...userData,
      createdAt: serverTimestamp(),
    });

    // Update Firebase Auth profile
    await updateProfile(userCredential.user, {
      displayName: data.name,
    });

    // Send email verification
    await sendEmailVerification(userCredential.user);

    return {
      id: userCredential.user.uid,
      ...userData,
    };
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw new Error(error.message || 'Failed to sign up');
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    const userData = userDoc.data();

    // Check if user is blocked
    if (userData.isBlocked) {
      await signOut(auth);
      throw new Error('Your account has been blocked. Please contact support.');
    }

    return {
      id: userDoc.id,
      ...userData,
      createdAt: userData.createdAt?.toDate() || new Date(),
    } as User;
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      // Check if blocked
      if (userData.isBlocked) {
        await signOut(auth);
        throw new Error('Your account has been blocked. Please contact support.');
      }

      return {
        id: userDoc.id,
        ...userData,
        createdAt: userData.createdAt?.toDate() || new Date(),
      } as User;
    }

    // Create new user if doesn't exist
    const username = slugify(user.displayName || user.email?.split('@')[0] || 'user', {
      lower: true,
      strict: true,
    });

    const userData: Omit<User, 'id'> = {
      name: user.displayName || 'User',
      username,
      email: user.email || '',
      phone: user.phoneNumber || '',
      photoURL: user.photoURL || '',
      bio: '',
      role: 'user',
      createdAt: new Date(),
      isVerified: user.emailVerified,
      isBlocked: false,
    };

    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      createdAt: serverTimestamp(),
    });

    return {
      id: user.uid,
      ...userData,
    };
  } catch (error: any) {
    console.error('Google sign in error:', error);
    throw new Error(error.message || 'Failed to sign in with Google');
  }
};

// Sign out
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

// Send email verification
export const sendVerificationEmail = async (): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user signed in');
    await sendEmailVerification(user);
  } catch (error: any) {
    console.error('Email verification error:', error);
    throw new Error(error.message || 'Failed to send verification email');
  }
};

// Update user profile
export const updateUserProfile = async (
  userId: string,
  data: Partial<User>
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: serverTimestamp(),
    });

    // Update Firebase Auth profile if name changed
    if (data.name && auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: data.name,
      });
    }
  } catch (error: any) {
    console.error('Update profile error:', error);
    throw new Error(error.message || 'Failed to update profile');
  }
};

// Change password
export const changePassword = async (
  newPassword: string
): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user signed in');
    await updatePassword(user, newPassword);
  } catch (error: any) {
    console.error('Change password error:', error);
    throw new Error(error.message || 'Failed to change password');
  }
};

// Delete account
export const deleteAccount = async (userId: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user signed in');

    // Delete user document from Firestore
    // Note: Pages and other data should be handled by Cloud Functions
    // or cascading deletes
    
    await deleteUser(user);
  } catch (error: any) {
    console.error('Delete account error:', error);
    throw new Error(error.message || 'Failed to delete account');
  }
};

// Get current user data
export const getCurrentUserData = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data();
    
    return {
      id: userDoc.id,
      ...userData,
      createdAt: userData.createdAt?.toDate() || new Date(),
    } as User;
  } catch (error: any) {
    console.error('Get user data error:', error);
    return null;
  }
};
