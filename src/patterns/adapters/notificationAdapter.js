/**
 * Notification Provider Adapter
 */

export class NotificationProvider {
  async sendOrderConfirmation(order) {
    throw new Error('sendOrderConfirmation must be implemented');
  }

  async sendStatusUpdate(order, newStatus) {
    throw new Error('sendStatusUpdate must be implemented');
  }
}

export class MockNotificationProvider extends NotificationProvider {
  async sendOrderConfirmation(order) {
    console.info(`[Notification] Order confirmation dispatched to ${order.customerEmail} for Order #${order.id}`);
    return { success: true, deliveredAt: new Date().toISOString() };
  }

  async sendStatusUpdate(order, newStatus) {
    console.info(`[Notification] Status update dispatched to ${order.customerEmail}: Order #${order.id} is now ${newStatus}`);
    return { success: true, deliveredAt: new Date().toISOString() };
  }
}

export class WebhookNotificationProvider extends NotificationProvider {
  constructor(endpoint) {
    super();
    this.endpoint = endpoint;
  }

  async sendOrderConfirmation(order) {
    return await fetch(`${this.endpoint}/order-confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
  }

  async sendStatusUpdate(order, newStatus) {
    return await fetch(`${this.endpoint}/order-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: order.id, status: newStatus }),
    });
  }
}
