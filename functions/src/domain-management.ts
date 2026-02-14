import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/v1/https';
import { Resolver } from 'dns';
import * as dns from 'dns/promises';

const db = admin.firestore();
const resolver = new Resolver();

interface DomainVerificationData {
  domainId: string;
}

/**
 * Verify custom domain DNS configuration
 */
export const verifyDomain = async (
  data: DomainVerificationData,
  context: CallableContext
) => {
  if (!context.auth) {
    throw new Error('Unauthenticated');
  }
  
  const { domainId } = data;
  
  // Get domain record
  const domainDoc = await db.collection('domains').doc(domainId).get();
  if (!domainDoc.exists) {
    throw new Error('Domain not found');
  }
  
  const domain = domainDoc.data();
  
  // Verify ownership
  if (domain?.userId !== context.auth.uid) {
    throw new Error('Unauthorized');
  }
  
  const hostname = domain.hostname;
  
  try {
    // Check CNAME record
    let cnameValid = false;
    try {
      const cname = await dns.resolveCname(hostname);
      cnameValid = cname.some((record) =>
        record.includes('cname.kashpages.com')
      );
    } catch (error) {
      // CNAME not found, check A record for apex domain
      if (!hostname.startsWith('www.')) {
        try {
          const aRecords = await dns.resolve4(hostname);
          // Check if points to our IP (configure with actual IP)
          cnameValid = aRecords.includes('YOUR_SERVER_IP');
        } catch {}
      }
    }
    
    if (!cnameValid) {
      return {
        verified: false,
        error: 'CNAME record not found or incorrect',
        instructions: {
          type: 'CNAME',
          host: hostname.replace(/\..+$/, ''),
          value: 'cname.kashpages.com',
          note: 'For apex domains, use A record pointing to our IP',
        },
      };
    }
    
    // Check TXT record for verification token
    let txtValid = false;
    try {
      const txtRecords = await dns.resolveTxt(`_kashpages.${hostname}`);
      const flatRecords = txtRecords.flat();
      txtValid = flatRecords.includes(domain.verificationToken);
    } catch {}
    
    if (!txtValid) {
      return {
        verified: false,
        error: 'Verification TXT record not found',
        instructions: {
          type: 'TXT',
          host: `_kashpages.${hostname.replace(/\..+$/, '')}`,
          value: domain.verificationToken,
        },
      };
    }
    
    // Both records valid - mark as verified
    await domainDoc.ref.update({
      verified: true,
      verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      sslStatus: 'pending',
      lastCheckedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    console.log(`Domain ${hostname} verified successfully`);
    
    return {
      verified: true,
      message: 'Domain verified successfully. SSL provisioning in progress.',
    };
  } catch (error: any) {
    console.error('Domain verification error:', error);
    
    return {
      verified: false,
      error: 'DNS verification failed',
      details: error.message,
    };
  }
};

/**
 * Provision SSL certificate
 * This is a placeholder - actual implementation depends on hosting provider
 */
export const provisionSSL = async (
  data: { domainId: string },
  context: CallableContext
) => {
  if (!context.auth) {
    throw new Error('Unauthenticated');
  }
  
  const { domainId } = data;
  
  const domainDoc = await db.collection('domains').doc(domainId).get();
  if (!domainDoc.exists) {
    throw new Error('Domain not found');
  }
  
  const domain = domainDoc.data();
  
  if (domain?.userId !== context.auth.uid) {
    throw new Error('Unauthorized');
  }
  
  if (!domain?.verified) {
    throw new Error('Domain not verified');
  }
  
  // Provision SSL certificate
  // Implementation depends on hosting provider:
  // - Vercel: Use Vercel API
  // - Netlify: Use Netlify API
  // - Self-hosted: Use Let's Encrypt / Certbot
  
  // Example for Vercel:
  /*
  const response = await fetch(
    `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: domain.hostname,
      }),
    }
  );
  */
  
  // Update SSL status
  await domainDoc.ref.update({
    sslStatus: 'active',
    sslProvisionedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return { success: true, message: 'SSL certificate provisioned' };
};

/**
 * Background job: Check domain health
 */
export const checkDomainHealth = async () => {
  const domains = await db
    .collection('domains')
    .where('verified', '==', true)
    .get();
  
  for (const domainDoc of domains.docs) {
    const domain = domainDoc.data();
    const hostname = domain.hostname;
    
    try {
      // Check if DNS still points to us
      const cname = await dns.resolveCname(hostname);
      const isValid = cname.some((record) =>
        record.includes('cname.kashpages.com')
      );
      
      if (!isValid) {
        // DNS no longer points to us
        await domainDoc.ref.update({
          status: 'dns_error',
          lastError: 'DNS records changed',
          lastCheckedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        // Notify user
        await db.collection('notifications').add({
          userId: domain.userId,
          type: 'domain_error',
          message: `DNS configuration for ${hostname} has changed. Please check your settings.`,
          domainId: domainDoc.id,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          read: false,
        });
      } else {
        await domainDoc.ref.update({
          status: 'active',
          lastCheckedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    } catch (error) {
      console.error(`Health check failed for ${hostname}:`, error);
    }
  }
  
  console.log(`Checked health of ${domains.size} domains`);
};
