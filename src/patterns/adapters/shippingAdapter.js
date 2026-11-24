/**
 * Shipping Provider Adapter
 */

export class ShippingProvider {
  async calculateRates(shippingAddress, items) {
    throw new Error('calculateRates must be implemented');
  }

  async createShipment(order) {
    throw new Error('createShipment must be implemented');
  }
}

export class MockShippingProvider extends ShippingProvider {
  async calculateRates(shippingAddress, items) {
    const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    // Free shipping threshold for orders >= ₹150
    const standardCost = subtotal >= 150 ? 0 : 15;
    
    return [
      {
        id: 'standard_courier',
        title: 'Complimentary White-Glove Ground (Signature Required)',
        estimatedDays: '3-5 Business Days',
        cost: standardCost,
        carrier: 'PJ Essence Concierge Delivery',
      },
      {
        id: 'express_courier',
        title: 'Temperature-Controlled Priority Express',
        estimatedDays: '1-2 Business Days',
        cost: 25,
        carrier: 'FedEx Luxury Climate-Safe',
      },
    ];
  }

  async createShipment(order) {
    return {
      trackingNumber: `PJ-${Math.floor(100000 + Math.random() * 900000)}US`,
      carrier: 'PJ Essence Concierge Delivery',
      estimatedDelivery: new Date(Date.now() + 4 * 86400000).toISOString(),
    };
  }
}
