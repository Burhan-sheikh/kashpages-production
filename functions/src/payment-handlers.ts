import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/v1/https';
import * as crypto from 'crypto';
import axios from 'axios';

const db = admin.firestore();

interface PaymentOrderData {
  planId: 'starter' | 'business';
  provider: 'cashfree' | 'razorpay';
}

interface VerifyPaymentData {
  orderId: string;
  paymentId: string;
  signature: string;
  provider: 'cashfree' | 'razorpay';
}

/**
 * Create payment order
 */
export const createPaymentOrder = async (
  data: PaymentOrderData,
  context: CallableContext
) => {
  if (!context.auth) {
    throw new Error('Unauthenticated');
  }
  
  const userId = context.auth.uid;
  const { planId, provider } = data;
  
  // Get plan details
  const plans = {
    starter: { price: 49900, name: 'Starter' },
    business: { price: 249900, name: 'Business' },
  };
  
  const plan = plans[planId];
  if (!plan) {
    throw new Error('Invalid plan');
  }
  
  // Generate order ID
  const orderId = `ORDER_${Date.now()}_${userId.substring(0, 8)}`;
  
  // Get payment gateway credentials from system settings
  const settingsDoc = await db.collection('systemSettings').doc('payments').get();
  const settings = settingsDoc.data();
  
  if (!settings) {
    throw new Error('Payment not configured');
  }
  
  // Create order in database
  await db.collection('orders').doc(orderId).set({
    userId,
    planId,
    amount: plan.price,
    currency: 'INR',
    status: 'pending',
    provider,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  let paymentData: any;
  
  if (provider === 'cashfree') {
    // Create Cashfree order
    const response = await axios.post(
      'https://api.cashfree.com/pg/orders',
      {
        order_id: orderId,
        order_amount: plan.price / 100,
        order_currency: 'INR',
        customer_details: {
          customer_id: userId,
          customer_email: context.auth.token.email,
        },
      },
      {
        headers: {
          'x-client-id': settings.cashfreeAppId,
          'x-client-secret': settings.cashfreeSecretKey,
          'x-api-version': '2023-08-01',
        },
      }
    );
    
    paymentData = {
      orderId,
      sessionId: response.data.payment_session_id,
      provider: 'cashfree',
    };
  } else if (provider === 'razorpay') {
    // Create Razorpay order
    const auth = Buffer.from(
      `${settings.razorpayKeyId}:${settings.razorpaySecretKey}`
    ).toString('base64');
    
    const response = await axios.post(
      'https://api.razorpay.com/v1/orders',
      {
        amount: plan.price,
        currency: 'INR',
        receipt: orderId,
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    
    paymentData = {
      orderId,
      razorpayOrderId: response.data.id,
      amount: plan.price,
      keyId: settings.razorpayKeyId,
      provider: 'razorpay',
    };
  }
  
  return paymentData;
};

/**
 * Verify payment signature
 */
export const verifyPayment = async (
  data: VerifyPaymentData,
  context: CallableContext
) => {
  if (!context.auth) {
    throw new Error('Unauthenticated');
  }
  
  const { orderId, paymentId, signature, provider } = data;
  
  // Get order
  const orderDoc = await db.collection('orders').doc(orderId).get();
  if (!orderDoc.exists) {
    throw new Error('Order not found');
  }
  
  const order = orderDoc.data();
  if (order?.userId !== context.auth.uid) {
    throw new Error('Unauthorized');
  }
  
  // Get payment settings
  const settingsDoc = await db.collection('systemSettings').doc('payments').get();
  const settings = settingsDoc.data();
  
  let isValid = false;
  
  if (provider === 'cashfree') {
    // Verify Cashfree signature
    // (Implementation depends on Cashfree verification method)
    isValid = true; // Simplified for example
  } else if (provider === 'razorpay') {
    // Verify Razorpay signature
    const text = `${orderId}|${paymentId}`;
    const generated = crypto
      .createHmac('sha256', settings?.razorpaySecretKey || '')
      .update(text)
      .digest('hex');
    
    isValid = generated === signature;
  }
  
  if (!isValid) {
    throw new Error('Invalid signature');
  }
  
  // Update order status
  await orderDoc.ref.update({
    status: 'completed',
    paymentId,
    signature,
    completedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return { success: true, orderId };
};

/**
 * Handle payment webhooks
 */
export const handleWebhook = async (req: any, res: any) => {
  const provider = req.query.provider;
  
  if (provider === 'cashfree') {
    // Handle Cashfree webhook
    const { orderId, paymentStatus } = req.body;
    
    if (paymentStatus === 'SUCCESS') {
      await db.collection('orders').doc(orderId).update({
        status: 'completed',
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  } else if (provider === 'razorpay') {
    // Handle Razorpay webhook
    const { order_id, payment_id } = req.body.payload.payment.entity;
    
    await db.collection('orders').doc(order_id).update({
      status: 'completed',
      paymentId: payment_id,
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  
  res.status(200).send({ success: true });
};
