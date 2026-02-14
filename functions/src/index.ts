/**
 * Kashpages Firebase Cloud Functions
 * 
 * Server-side operations for:
 * - User management
 * - Payment processing
 * - Content moderation
 * - Domain verification
 * - AI proxy
 * - Analytics
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

// Import function modules
import { onUserCreate, onUserDelete, upgradeUserPlan } from './user-management';
import { 
  createPaymentOrder,
  verifyPayment,
  handleWebhook 
} from './payment-handlers';
import { 
  approvePagePublish,
  rejectPagePublish,
  flagContent 
} from './content-moderation';
import { 
  verifyDomain,
  provisionSSL,
  checkDomainHealth 
} from './domain-management';
import { aiChatProxy } from './ai-proxy';
import { generateAnalytics } from './analytics';

// ============================================================================
// USER MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Triggered when new user signs up
 * Creates user document in Firestore
 */
export const onUserCreated = functions.auth.user().onCreate(onUserCreate);

/**
 * Triggered when user is deleted
 * Cleanup user data
 */
export const onUserDeleted = functions.auth.user().onDelete(onUserDelete);

/**
 * Upgrade user subscription plan
 * Called after successful payment
 */
export const upgradeSubscription = functions.https.onCall(upgradeUserPlan);

// ============================================================================
// PAYMENT FUNCTIONS
// ============================================================================

/**
 * Create payment order
 * Returns order details for payment gateway
 */
export const createOrder = functions.https.onCall(createPaymentOrder);

/**
 * Verify payment signature
 * Called after payment completion
 */
export const verifyPaymentSignature = functions.https.onCall(verifyPayment);

/**
 * Handle payment gateway webhooks
 * For Cashfree and Razorpay
 */
export const paymentWebhook = functions.https.onRequest(handleWebhook);

// ============================================================================
// CONTENT MODERATION FUNCTIONS
// ============================================================================

/**
 * Approve page for publishing
 * Admin only
 */
export const approvePage = functions.https.onCall(approvePagePublish);

/**
 * Reject page publish request
 * Admin only
 */
export const rejectPage = functions.https.onCall(rejectPagePublish);

/**
 * Flag inappropriate content
 * Triggered by automated scanning or user reports
 */
export const flagPageContent = functions.https.onCall(flagContent);

// ============================================================================
// DOMAIN MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Verify custom domain DNS configuration
 */
export const verifyCustomDomain = functions.https.onCall(verifyDomain);

/**
 * Provision SSL certificate for custom domain
 */
export const provisionSSLCertificate = functions.https.onCall(provisionSSL);

/**
 * Background job: Check domain health
 * Runs daily
 */
export const checkDomainsHealth = functions.pubsub
  .schedule('every 24 hours')
  .onRun(checkDomainHealth);

// ============================================================================
// AI PROXY FUNCTIONS
// ============================================================================

/**
 * Proxy AI chat requests
 * Keeps API keys secure on server
 */
export const aiChat = functions.https.onCall(aiChatProxy);

// ============================================================================
// ANALYTICS FUNCTIONS
// ============================================================================

/**
 * Generate analytics reports
 * Runs daily at midnight
 */
export const dailyAnalytics = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('Asia/Kolkata')
  .onRun(generateAnalytics);

// ============================================================================
// CLEANUP FUNCTIONS
// ============================================================================

/**
 * Delete old revisions
 * Keeps last 20 revisions per page
 */
export const cleanupOldRevisions = functions.pubsub
  .schedule('0 2 * * *')
  .onRun(async () => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    
    const oldRevisions = await db
      .collection('revisions')
      .where('timestamp', '<', cutoffDate)
      .get();
    
    const batch = db.batch();
    oldRevisions.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    console.log(`Deleted ${oldRevisions.size} old revisions`);
  });

/**
 * Expire trial subscriptions
 */
export const expireTrials = functions.pubsub
  .schedule('0 1 * * *')
  .onRun(async () => {
    const now = new Date();
    
    const expiredUsers = await db
      .collection('users')
      .where('subscription.status', '==', 'active')
      .where('subscription.currentPeriodEnd', '<', now)
      .get();
    
    const batch = db.batch();
    expiredUsers.docs.forEach((doc) => {
      batch.update(doc.ref, {
        'subscription.status': 'expired',
      });
    });
    
    await batch.commit();
    
    console.log(`Expired ${expiredUsers.size} subscriptions`);
  });

export { db, auth };
