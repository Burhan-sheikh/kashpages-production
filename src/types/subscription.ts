import { BaseDocument, Plan, Timestamp } from './common';

export type SubscriptionStatus = 
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'trialing';

export type PaymentProvider = 'cashfree' | 'razorpay';

export interface Subscription extends BaseDocument {
  userId: string;
  plan: Plan;
  status: SubscriptionStatus;
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  cancelAtPeriodEnd: boolean;
  paymentProvider: PaymentProvider;
  externalSubscriptionId?: string;
  priceId?: string;
  nextBillingDate?: Timestamp;
  trialEnd?: Timestamp;
}

export interface PlanFeatures {
  maxPages: number; // -1 for unlimited
  templates: TemplateCategory[] | 'all';
  customDomain: boolean;
  removeBranding: boolean;
  aiAssistant: boolean;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  versionHistory: boolean;
  customSEO: boolean;
}

export interface PlanConfig {
  id: Plan;
  name: string;
  description: string;
  price: number; // In INR
  currency: 'INR';
  interval: 'month' | 'year';
  features: PlanFeatures;
  popular?: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  provider: PaymentProvider;
  metadata: {
    userId: string;
    plan: Plan;
    subscriptionId?: string;
  };
}

export const PLAN_CONFIGS: Record<Plan, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Get started with basic features',
    price: 0,
    currency: 'INR',
    interval: 'month',
    features: {
      maxPages: 1,
      templates: ['landing'],
      customDomain: false,
      removeBranding: false,
      aiAssistant: false,
      advancedAnalytics: false,
      prioritySupport: false,
      versionHistory: false,
      customSEO: false,
    },
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small businesses',
    price: 499,
    currency: 'INR',
    interval: 'month',
    features: {
      maxPages: 10,
      templates: ['landing', 'services', 'portfolio'],
      customDomain: false,
      removeBranding: false,
      aiAssistant: true,
      advancedAnalytics: true,
      prioritySupport: true,
      versionHistory: true,
      customSEO: true,
    },
  },
  business: {
    id: 'business',
    name: 'Business',
    description: 'For growing businesses',
    price: 2499,
    currency: 'INR',
    interval: 'month',
    popular: true,
    features: {
      maxPages: -1, // unlimited
      templates: 'all',
      customDomain: true,
      removeBranding: true,
      aiAssistant: true,
      advancedAnalytics: true,
      prioritySupport: true,
      versionHistory: true,
      customSEO: true,
    },
  },
};
