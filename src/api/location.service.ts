import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Location } from '@/features/discovery/types';
import slugify from 'slugify';

// Get all locations
export const getLocations = async (): Promise<Location[]> => {
  try {
    const q = query(
      collection(db, 'locations'),
      orderBy('pageCount', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Location[];
  } catch (error: any) {
    console.error('Get locations error:', error);
    return [];
  }
};

// Get location by slug
export const getLocationBySlug = async (
  slug: string
): Promise<Location | null> => {
  try {
    const q = query(
      collection(db, 'locations'),
      where('slug', '==', slug)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const locationDoc = snapshot.docs[0];
    return {
      id: locationDoc.id,
      ...locationDoc.data(),
    } as Location;
  } catch (error: any) {
    console.error('Get location by slug error:', error);
    return null;
  }
};

// Create location (admin only)
export const createLocation = async (
  name: string,
  district: string,
  type: 'city' | 'district' | 'area'
): Promise<string> => {
  try {
    const slug = slugify(name, { lower: true, strict: true });

    const locationData = {
      name,
      slug,
      district,
      type,
      pageCount: 0,
      isFeatured: false,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'locations'), locationData);
    return docRef.id;
  } catch (error: any) {
    console.error('Create location error:', error);
    throw new Error(error.message || 'Failed to create location');
  }
};

// Update location (admin only)
export const updateLocation = async (
  locationId: string,
  data: Partial<Location>
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'locations', locationId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    console.error('Update location error:', error);
    throw new Error(error.message || 'Failed to update location');
  }
};

// Delete location (admin only)
export const deleteLocation = async (locationId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'locations', locationId));
  } catch (error: any) {
    console.error('Delete location error:', error);
    throw new Error(error.message || 'Failed to delete location');
  }
};

// Get featured locations
export const getFeaturedLocations = async (): Promise<Location[]> => {
  try {
    const q = query(
      collection(db, 'locations'),
      where('isFeatured', '==', true),
      orderBy('pageCount', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Location[];
  } catch (error: any) {
    console.error('Get featured locations error:', error);
    return [];
  }
};
