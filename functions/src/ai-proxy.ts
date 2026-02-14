import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/v1/https';
import axios from 'axios';

const db = admin.firestore();

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIChatData {
  pageId: string;
  message: string;
  history: Message[];
}

/**
 * Proxy AI chat requests
 * Keeps API keys secure on server
 */
export const aiChatProxy = async (
  data: AIChatData,
  context: CallableContext
) => {
  const { pageId, message, history } = data;
  
  // Rate limiting - check request count
  const rateLimitKey = `ai_requests_${pageId}`;
  const requestCount = await admin
    .database()
    .ref(rateLimitKey)
    .once('value');
  
  const count = requestCount.val() || 0;
  
  if (count > 100) {
    // 100 requests per hour per page
    throw new Error('Rate limit exceeded');
  }
  
  // Increment counter
  await admin
    .database()
    .ref(rateLimitKey)
    .set(count + 1);
  
  // Expire counter after 1 hour
  await admin
    .database()
    .ref(rateLimitKey)
    .onDisconnect()
    .remove();
  
  // Get page AI configuration
  const pageDoc = await db.collection('pages').doc(pageId).get();
  if (!pageDoc.exists) {
    throw new Error('Page not found');
  }
  
  const page = pageDoc.data();
  const aiConfig = page?.aiConfig;
  
  if (!aiConfig?.enabled) {
    throw new Error('AI not enabled for this page');
  }
  
  // Get AI API key from system settings
  const settingsDoc = await db.collection('systemSettings').doc('ai').get();
  const settings = settingsDoc.data();
  
  if (!settings?.apiKey) {
    throw new Error('AI not configured');
  }
  
  const provider = settings.provider || 'openai';
  
  // Build system prompt from AI configuration
  const systemPrompt = buildSystemPrompt(aiConfig, page);
  
  let response;
  
  try {
    if (provider === 'openai') {
      response = await callOpenAI(
        settings.apiKey,
        systemPrompt,
        message,
        history
      );
    } else if (provider === 'anthropic') {
      response = await callAnthropic(
        settings.apiKey,
        systemPrompt,
        message,
        history
      );
    } else {
      throw new Error('Unsupported AI provider');
    }
  } catch (error: any) {
    console.error('AI API error:', error);
    throw new Error('AI service temporarily unavailable');
  }
  
  // Log interaction for analytics
  await db.collection('aiInteractions').add({
    pageId,
    userId: page.ownerId,
    messageLength: message.length,
    responseLength: response.length,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return {
    reply: {
      role: 'assistant',
      content: response,
    },
  };
};

/**
 * Build system prompt from AI configuration
 */
function buildSystemPrompt(aiConfig: any, page: any): string {
  const training = aiConfig.training?.customData || {};
  
  return `
You are ${aiConfig.name || 'AI Assistant'}, a helpful assistant for this business.

BUSINESS INFORMATION:

Name: ${page.title}
Overview: ${training.businessOverview || 'No overview provided'}

Services Offered:
${(training.services || []).map((s: string) => `- ${s}`).join('\n')}

Pricing Approach:
${training.pricingApproach || 'Contact for pricing'}

Policies:
${(training.policies || []).map((p: string) => `- ${p}`).join('\n')}

Contact Preference:
${training.contactPreference || 'Contact via form on website'}

Additional Instructions:
${training.extraInstructions || ''}

COMMUNICATION STYLE:

Tone: ${aiConfig.behavior?.tone || 'professional'}
Response Length: ${aiConfig.behavior?.responseLength || 'concise'}
Language: ${aiConfig.behavior?.language || 'en'}

INSTRUCTIONS:

- Always be helpful, polite, and accurate
- Base responses on the training data provided above
- If you don't know something, admit it and suggest contacting the business directly
- Keep responses ${aiConfig.behavior?.responseLength === 'concise' ? 'brief and to the point' : 'detailed and comprehensive'}
- Maintain a ${aiConfig.behavior?.tone} tone
- Never make up information not provided in the training data
- For specific pricing, policies, or detailed questions, direct users to contact the business
  `.trim();
}

/**
 * Call OpenAI API
 */
async function callOpenAI(
  apiKey: string,
  systemPrompt: string,
  message: string,
  history: Message[]
): Promise<string> {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );
  
  return response.data.choices[0].message.content;
}

/**
 * Call Anthropic API
 */
async function callAnthropic(
  apiKey: string,
  systemPrompt: string,
  message: string,
  history: Message[]
): Promise<string> {
  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-3-sonnet-20240229',
      system: systemPrompt,
      messages: [...history, { role: 'user', content: message }],
      max_tokens: 500,
    },
    {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
    }
  );
  
  return response.data.content[0].text;
}
