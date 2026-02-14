import * as admin from 'firebase-admin';

const db = admin.firestore();

interface DailyMetrics {
  date: string;
  users: {
    total: number;
    active: number;
    new: number;
    suspended: number;
  };
  pages: {
    total: number;
    published: number;
    pending: number;
    drafts: number;
  };
  subscriptions: {
    free: number;
    starter: number;
    business: number;
  };
  revenue: {
    daily: number;
    monthly: number;
  };
  ai: {
    interactions: number;
    pages: number;
  };
  domains: {
    total: number;
    verified: number;
    pending: number;
  };
}

/**
 * Generate daily analytics
 */
export const generateAnalytics = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Calculate metrics
  const metrics: DailyMetrics = {
    date: today.toISOString().split('T')[0],
    users: await calculateUserMetrics(yesterday, today),
    pages: await calculatePageMetrics(),
    subscriptions: await calculateSubscriptionMetrics(),
    revenue: await calculateRevenue(yesterday, today),
    ai: await calculateAIMetrics(yesterday, today),
    domains: await calculateDomainMetrics(),
  };
  
  // Store metrics
  await db
    .collection('analytics')
    .doc(metrics.date)
    .set(metrics);
  
  console.log(`Generated analytics for ${metrics.date}`);
  
  return metrics;
};

/**
 * Calculate user metrics
 */
async function calculateUserMetrics(
  startDate: Date,
  endDate: Date
): Promise<DailyMetrics['users']> {
  const allUsers = await db.collection('users').get();
  
  const newUsers = await db
    .collection('users')
    .where('createdAt', '>=', startDate)
    .where('createdAt', '<', endDate)
    .get();
  
  const activeUsers = await db
    .collection('users')
    .where('status', '==', 'active')
    .get();
  
  const suspendedUsers = await db
    .collection('users')
    .where('status', '==', 'suspended')
    .get();
  
  return {
    total: allUsers.size,
    active: activeUsers.size,
    new: newUsers.size,
    suspended: suspendedUsers.size,
  };
}

/**
 * Calculate page metrics
 */
async function calculatePageMetrics(): Promise<DailyMetrics['pages']> {
  const allPages = await db.collection('pages').get();
  
  const published = await db
    .collection('pages')
    .where('status', '==', 'published')
    .get();
  
  const pending = await db
    .collection('pages')
    .where('status', '==', 'pending')
    .get();
  
  const drafts = await db
    .collection('pages')
    .where('status', '==', 'draft')
    .get();
  
  return {
    total: allPages.size,
    published: published.size,
    pending: pending.size,
    drafts: drafts.size,
  };
}

/**
 * Calculate subscription metrics
 */
async function calculateSubscriptionMetrics(): Promise<
  DailyMetrics['subscriptions']
> {
  const free = await db
    .collection('users')
    .where('subscription.plan', '==', 'free')
    .get();
  
  const starter = await db
    .collection('users')
    .where('subscription.plan', '==', 'starter')
    .get();
  
  const business = await db
    .collection('users')
    .where('subscription.plan', '==', 'business')
    .get();
  
  return {
    free: free.size,
    starter: starter.size,
    business: business.size,
  };
}

/**
 * Calculate revenue
 */
async function calculateRevenue(
  startDate: Date,
  endDate: Date
): Promise<DailyMetrics['revenue']> {
  // Daily revenue
  const dailyOrders = await db
    .collection('orders')
    .where('status', '==', 'completed')
    .where('completedAt', '>=', startDate)
    .where('completedAt', '<', endDate)
    .get();
  
  const dailyRevenue = dailyOrders.docs.reduce(
    (sum, doc) => sum + (doc.data().amount || 0),
    0
  );
  
  // Monthly recurring revenue (active subscriptions)
  const activeStarter = await db
    .collection('users')
    .where('subscription.plan', '==', 'starter')
    .where('subscription.status', '==', 'active')
    .get();
  
  const activeBusiness = await db
    .collection('users')
    .where('subscription.plan', '==', 'business')
    .where('subscription.status', '==', 'active')
    .get();
  
  const monthlyRevenue =
    activeStarter.size * 49900 + activeBusiness.size * 249900;
  
  return {
    daily: dailyRevenue,
    monthly: monthlyRevenue,
  };
}

/**
 * Calculate AI metrics
 */
async function calculateAIMetrics(
  startDate: Date,
  endDate: Date
): Promise<DailyMetrics['ai']> {
  const interactions = await db
    .collection('aiInteractions')
    .where('timestamp', '>=', startDate)
    .where('timestamp', '<', endDate)
    .get();
  
  const aiPages = await db
    .collection('pages')
    .where('aiConfig.enabled', '==', true)
    .get();
  
  return {
    interactions: interactions.size,
    pages: aiPages.size,
  };
}

/**
 * Calculate domain metrics
 */
async function calculateDomainMetrics(): Promise<DailyMetrics['domains']> {
  const allDomains = await db.collection('domains').get();
  
  const verified = await db
    .collection('domains')
    .where('verified', '==', true)
    .get();
  
  const pending = await db
    .collection('domains')
    .where('verified', '==', false)
    .get();
  
  return {
    total: allDomains.size,
    verified: verified.size,
    pending: pending.size,
  };
}
