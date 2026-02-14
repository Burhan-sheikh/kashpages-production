import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/v1/https';

const db = admin.firestore();

/**
 * Create user document when new user signs up
 */
export const onUserCreate = async (user: admin.auth.UserRecord) => {
  const userData = {
    uid: user.uid,
    email: user.email || '',
    name: user.displayName || '',
    role: 'user',
    status: 'active',
    subscription: {
      plan: 'free',
      status: 'active',
      currentPeriodEnd: null,
    },
    profile: {
      avatar: user.photoURL || null,
      phone: user.phoneNumber || null,
    },
    usage: {
      pagesCreated: 0,
      pagesLimit: 1,
      storageUsed: 0,
      storageLimit: 1073741824, // 1GB
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await db.collection('users').doc(user.uid).set(userData);
  
  console.log(`Created user document for ${user.uid}`);
};

/**
 * Cleanup user data when account is deleted
 */
export const onUserDelete = async (user: admin.auth.UserRecord) => {
  const userId = user.uid;
  
  // Delete user document
  await db.collection('users').doc(userId).delete();
  
  // Delete user's pages
  const pages = await db.collection('pages').where('ownerId', '==', userId).get();
  const batch = db.batch();
  pages.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  
  // Delete user's revisions
  const revisions = await db.collection('revisions').where('userId', '==', userId).get();
  const revisionBatch = db.batch();
  revisions.docs.forEach((doc) => {
    revisionBatch.delete(doc.ref);
  });
  await revisionBatch.commit();
  
  console.log(`Deleted all data for user ${userId}`);
};

/**
 * Upgrade user subscription plan
 */
export const upgradeUserPlan = async (
  data: {
    planId: 'free' | 'starter' | 'business';
    orderId: string;
  },
  context: CallableContext
) => {
  // Verify authentication
  if (!context.auth) {
    throw new Error('Unauthenticated');
  }
  
  const userId = context.auth.uid;
  const { planId, orderId } = data;
  
  // Verify order exists and is paid
  const orderDoc = await db.collection('orders').doc(orderId).get();
  if (!orderDoc.exists) {
    throw new Error('Order not found');
  }
  
  const order = orderDoc.data();
  if (order?.status !== 'completed') {
    throw new Error('Order not completed');
  }
  
  if (order?.userId !== userId) {
    throw new Error('Unauthorized');
  }
  
  // Plan limits
  const planLimits = {
    free: {
      pagesLimit: 1,
      storageLimit: 1073741824, // 1GB
    },
    starter: {
      pagesLimit: 10,
      storageLimit: 10737418240, // 10GB
    },
    business: {
      pagesLimit: -1, // unlimited
      storageLimit: 107374182400, // 100GB
    },
  };
  
  const limits = planLimits[planId];
  
  // Calculate period end (1 month from now)
  const periodEnd = new Date();
  periodEnd.setMonth(periodEnd.getMonth() + 1);
  
  // Update user subscription
  await db.collection('users').doc(userId).update({
    'subscription.plan': planId,
    'subscription.status': 'active',
    'subscription.currentPeriodEnd': periodEnd,
    'usage.pagesLimit': limits.pagesLimit,
    'usage.storageLimit': limits.storageLimit,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  console.log(`Upgraded user ${userId} to ${planId} plan`);
  
  return { success: true, plan: planId };
};
