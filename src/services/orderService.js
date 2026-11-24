import { getOrderRepository, getPaymentProvider, getNotificationProvider, getShippingProvider } from '../repositories';
import { ORDER_STATUS } from '../patterns/state-machine/orderStateMachine';

export const orderService = {
  async listOrders(filters) {
    const repo = getOrderRepository();
    return await repo.list(filters);
  },

  async getOrderById(id) {
    const repo = getOrderRepository();
    return await repo.getById(id);
  },

  /**
   * Initializes order and generates serverless payment session.
   */
  async createOrder({ items, shippingAddress, giftWrapping = false, customerEmail, customerName, userId }) {
    const orderRepo = getOrderRepository();
    const shippingProvider = getShippingProvider();
    const paymentProvider = getPaymentProvider();

    // 1. Calculate pricing
    const subtotal = items.reduce((sum, item) => sum + (Number(item.unitPrice) * Number(item.quantity)), 0);
    const shippingRates = await shippingProvider.calculateRates(shippingAddress, items);
    const shippingCost = shippingRates[0]?.cost || 0;
    const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% sales tax estimate
    const giftFee = giftWrapping ? 15 : 0;
    const total = subtotal + shippingCost + tax + giftFee;

    // 2. Persist order in initial PENDING_PAYMENT state
    const order = await orderRepo.create({
      userId,
      customerEmail,
      customerName,
      items,
      subtotal,
      shipping: shippingCost,
      tax,
      discount: 0,
      total,
      giftWrapping,
      shippingAddress,
      paymentStatus: 'UNPAID',
    });

    // 3. Request payment session
    const paymentSession = await paymentProvider.createCheckoutSession(order);

    return {
      order,
      paymentSession,
    };
  },

  /**
   * Authoritative payment verification (server-side webhook simulation).
   * Transitions order from PENDING_PAYMENT -> PAID only upon verified proof.
   */
  async confirmPayment(orderId, paymentSessionId) {
    const orderRepo = getOrderRepository();
    const paymentProvider = getPaymentProvider();
    const notificationProvider = getNotificationProvider();

    // 1. Verify with payment provider
    const verification = await paymentProvider.verifyPayment(paymentSessionId);
    if (!verification.verified) {
      throw new Error('Payment authorization failed or declined.');
    }

    // 2. Transition state machine: PENDING_PAYMENT -> PAID
    const updatedOrder = await orderRepo.updateStatus(
      orderId,
      ORDER_STATUS.PAID,
      `Payment verified via transaction ref: ${verification.transactionId}`
    );

    // 3. Dispatch customer notification
    await notificationProvider.sendOrderConfirmation(updatedOrder);

    return updatedOrder;
  },

  /**
   * Admin status update with state machine guard.
   */
  async transitionStatus(orderId, nextStatus, note = '') {
    const orderRepo = getOrderRepository();
    const notificationProvider = getNotificationProvider();

    const updated = await orderRepo.updateStatus(orderId, nextStatus, note);
    await notificationProvider.sendStatusUpdate(updated, nextStatus);

    return updated;
  },
};
