import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/v1/https';

const db = admin.firestore();

/**
 * Check if user is admin
 */
const isAdmin = async (userId: string): Promise<boolean> => {
  const userDoc = await db.collection('users').doc(userId).get();
  return userDoc.data()?.role === 'admin';
};

/**
 * Approve page for publishing
 */
export const approvePagePublish = async (
  data: { pageId: string },
  context: CallableContext
) => {
  if (!context.auth) {
    throw new Error('Unauthenticated');
  }
  
  const isUserAdmin = await isAdmin(context.auth.uid);
  if (!isUserAdmin) {
    throw new Error('Unauthorized: Admin only');
  }
  
  const { pageId } = data;
  
  const pageDoc = await db.collection('pages').doc(pageId).get();
  if (!pageDoc.exists) {
    throw new Error('Page not found');
  }
  
  // Update page status
  await pageDoc.ref.update({
    status: 'published',
    publishedAt: admin.firestore.FieldValue.serverTimestamp(),
    moderatedBy: context.auth.uid,
    moderatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  // Create notification for page owner
  const page = pageDoc.data();
  await db.collection('notifications').add({
    userId: page?.ownerId,
    type: 'page_approved',
    message: `Your page "${page?.title}" has been approved and published.`,
    pageId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    read: false,
  });
  
  console.log(`Page ${pageId} approved by admin ${context.auth.uid}`);
  
  return { success: true };
};

/**
 * Reject page publish request
 */
export const rejectPagePublish = async (
  data: { pageId: string; reason: string },
  context: CallableContext
) => {
  if (!context.auth) {
    throw new Error('Unauthenticated');
  }
  
  const isUserAdmin = await isAdmin(context.auth.uid);
  if (!isUserAdmin) {
    throw new Error('Unauthorized: Admin only');
  }
  
  const { pageId, reason } = data;
  
  const pageDoc = await db.collection('pages').doc(pageId).get();
  if (!pageDoc.exists) {
    throw new Error('Page not found');
  }
  
  // Update page status
  await pageDoc.ref.update({
    status: 'rejected',
    rejectionReason: reason,
    moderatedBy: context.auth.uid,
    moderatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  // Create notification
  const page = pageDoc.data();
  await db.collection('notifications').add({
    userId: page?.ownerId,
    type: 'page_rejected',
    message: `Your page "${page?.title}" was rejected. Reason: ${reason}`,
    pageId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    read: false,
  });
  
  console.log(`Page ${pageId} rejected by admin ${context.auth.uid}`);
  
  return { success: true };
};

/**
 * Flag inappropriate content
 */
export const flagContent = async (
  data: { pageId: string; reason: string; reportedBy?: string },
  context: CallableContext
) => {
  const { pageId, reason, reportedBy } = data;
  
  const pageDoc = await db.collection('pages').doc(pageId).get();
  if (!pageDoc.exists) {
    throw new Error('Page not found');
  }
  
  // Create flag record
  await db.collection('contentFlags').add({
    pageId,
    reason,
    reportedBy: reportedBy || context.auth?.uid || 'anonymous',
    status: 'pending',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  // If multiple flags, auto-unpublish
  const flags = await db
    .collection('contentFlags')
    .where('pageId', '==', pageId)
    .where('status', '==', 'pending')
    .get();
  
  if (flags.size >= 3) {
    await pageDoc.ref.update({
      status: 'suspended',
      suspendedReason: 'Multiple content flags',
      suspendedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  
  return { success: true };
};
