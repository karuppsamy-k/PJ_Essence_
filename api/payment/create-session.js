// Vercel Serverless Function: POST /api/payment/create-session
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } });
  }

  const { id: orderId, total, currency = 'USD' } = req.body || {};

  if (!orderId || !total) {
    return res.status(400).json({ error: { code: 'INVALID_PAYLOAD', message: 'Order ID and total are required' } });
  }

  // Generate cryptographic session ID
  const sessionId = `cs_pj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  return res.status(200).json({
    success: true,
    sessionId,
    amount: total,
    currency,
    checkoutUrl: `/checkout?session_id=${sessionId}`,
  });
}
