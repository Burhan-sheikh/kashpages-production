// Firestore Collection References
// Centralized collection names with type safety

export const COLLECTIONS = {
  USERS: 'users',
  PAGES: 'pages',
  TEMPLATES: 'templates',
  REVISIONS: 'revisions',
  SUBSCRIPTIONS: 'subscriptions',
  CUSTOM_DOMAINS: 'customDomains',
  SYSTEM_SETTINGS: 'systemSettings',
  PAGE_ANALYTICS: 'pageAnalytics',
  AI_KNOWLEDGE_CARDS: 'aiKnowledgeCards',
  AI_CONVERSATIONS: 'aiConversations',
  PAYMENT_INTENTS: 'paymentIntents',
  USER_SETTINGS: 'userSettings',
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];

// Subcollections
export const SUBCOLLECTIONS = {
  PAGE_REVISIONS: 'revisions',
  PAGE_ANALYTICS: 'analytics',
} as const;
