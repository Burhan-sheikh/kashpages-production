import { BaseDocument } from './common';

export type AIProvider = 'openai' | 'anthropic' | 'custom';

export type TrainingMode = 'premade' | 'custom' | 'hybrid';

export interface AIConfig {
  enabled: boolean;
  assistantName: string;
  assistantAvatar?: string;
  provider?: AIProvider;
  model?: string;
  trainingMode: TrainingMode;
  customTraining?: CustomTraining;
  premadeCards?: string[]; // IDs of selected premade knowledge cards
  appearance: {
    position: 'bottom-right' | 'bottom-left';
    primaryColor: string;
    greeting: string;
  };
  behavior: {
    responseStyle: 'friendly' | 'professional' | 'casual';
    maxResponseLength: number;
    fallbackMessage: string;
  };
}

export interface CustomTraining {
  businessOverview: string;
  services: string[];
  pricingApproach: string;
  policies: string[];
  contactPreference: string;
  extraInstructions: string;
  faqPairs: Array<{
    question: string;
    answer: string;
  }>;
}

export interface PremadeKnowledgeCard extends BaseDocument {
  title: string;
  category: string;
  niche: string;
  content: string;
  keywords: string[];
  usageCount: number;
  isActive: boolean;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AIConversation {
  id: string;
  pageId: string;
  visitorId: string;
  messages: AIMessage[];
  startedAt: number;
  endedAt?: number;
  metadata: {
    userAgent?: string;
    ip?: string;
    referrer?: string;
  };
}

export interface AITrainingStatus {
  pageId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  startedAt: number;
  completedAt?: number;
  error?: string;
}
