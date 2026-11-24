/**
 * Payment Provider Adapter Interface & Implementations
 */

export class PaymentProvider {
  async createCheckoutSession(orderData) {
    throw new Error('createCheckoutSession must be implemented');
  }

  async verifyPayment(sessionId, clientToken) {
    throw new Error('verifyPayment must be implemented');
  }
}

/**
 * Mock / Sandbox Payment Provider (Simulates Stripe / Serverless checkout)
 */
export class MockPaymentProvider extends PaymentProvider {
  async createCheckoutSession(orderData) {
    // Simulates server-side session generation
    return {
      success: true,
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      checkoutUrl: `/checkout/payment-simulation?orderId=${orderData.id}`,
      amount: orderData.total,
      currency: orderData.currency || 'USD',
    };
  }

  async verifyPayment(sessionId) {
    // Simulates authoritative server-side webhook / verification
    await new Promise(r => setTimeout(r, 600)); // slight latency
    return {
      verified: true,
      transactionId: `txn_stripe_${Date.now()}`,
      status: 'PAID',
      paidAt: new Date().toISOString(),
    };
  }
}

/**
 * Stripe Live Payment Provider
 */
export class StripePaymentProvider extends PaymentProvider {
  constructor(publishableKey) {
    super();
    this.publishableKey = publishableKey;
  }

  async createCheckoutSession(orderData) {
    const res = await fetch('/api/payment/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error('Failed to create payment session');
    return await res.json();
  }

  async verifyPayment(sessionId) {
    const res = await fetch(`/api/payment/verify?session_id=${sessionId}`);
    if (!res.ok) throw new Error('Payment verification failed on server');
    return await res.json();
  }
}
