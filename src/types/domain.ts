import { BaseDocument, Timestamp } from './common';

export type DomainStatus = 
  | 'pending_dns'
  | 'verifying'
  | 'verified'
  | 'ssl_pending'
  | 'live'
  | 'failed';

export type SSLStatus = 'pending' | 'active' | 'failed' | 'renewing';

export interface CustomDomain extends BaseDocument {
  userId: string;
  pageId: string;
  hostname: string; // e.g., www.example.com
  verificationToken: string;
  verified: boolean;
  sslStatus: SSLStatus;
  sslCertificate?: {
    issuer: string;
    validFrom: Timestamp;
    validUntil: Timestamp;
    autoRenew: boolean;
  };
  dnsRecords: {
    type: 'CNAME' | 'A' | 'TXT';
    host: string;
    value: string;
    verified: boolean;
  }[];
  connectedAt?: Timestamp;
  lastCheckedAt?: Timestamp;
  lastError?: string;
  retryCount: number;
}

export interface DNSVerificationResult {
  success: boolean;
  records: Array<{
    type: string;
    name: string;
    value: string;
    found: boolean;
  }>;
  message?: string;
}

export interface DomainSetupInstructions {
  domain: string;
  steps: Array<{
    title: string;
    description: string;
    records: Array<{
      type: 'CNAME' | 'A' | 'TXT';
      host: string;
      value: string;
      ttl?: number;
    }>;
  }>;
  verificationToken: string;
}
