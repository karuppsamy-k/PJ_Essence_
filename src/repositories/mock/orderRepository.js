import { INITIAL_ORDERS } from './mockData';
import { canTransitionOrder, ORDER_STATUS } from '../../patterns/state-machine/orderStateMachine';

const STORAGE_KEY = 'pj_essence_mock_orders_v1';

function getStoredOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return [...INITIAL_ORDERS];
}

function saveOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {}
}

export function createMockOrderRepository() {
  let orders = getStoredOrders();

  return {
    async list({ status, userId, page = 1, limit = 20 } = {}) {
      await new Promise(r => setTimeout(r, 40));
      let result = [...orders];

      if (status && status !== 'ALL') {
        result = result.filter(o => o.orderStatus === status);
      }

      if (userId) {
        result = result.filter(o => o.userId === userId);
      }

      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const total = result.length;
      const startIndex = (page - 1) * limit;

      return {
        orders: result.slice(startIndex, startIndex + limit),
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      };
    },

    async getById(id) {
      await new Promise(r => setTimeout(r, 30));
      return orders.find(o => o.id === id) || null;
    },

    async create(orderPayload) {
      await new Promise(r => setTimeout(r, 70));

      const newOrder = {
        id: `ord_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
        userId: orderPayload.userId || null,
        customerName: orderPayload.customerName || 'PJ Essence Guest',
        customerEmail: orderPayload.customerEmail || 'client@pjessence.com',
        items: orderPayload.items || [],
        subtotal: Number(orderPayload.subtotal || 0),
        shipping: Number(orderPayload.shipping || 0),
        tax: Number(orderPayload.tax || 0),
        discount: Number(orderPayload.discount || 0),
        total: Number(orderPayload.total || 0),
        currency: orderPayload.currency || 'USD',
        shippingAddress: orderPayload.shippingAddress || {},
        paymentStatus: orderPayload.paymentStatus || 'UNPAID',
        orderStatus: ORDER_STATUS.PENDING_PAYMENT,
        statusHistory: [
          {
            status: ORDER_STATUS.PENDING_PAYMENT,
            timestamp: new Date().toISOString(),
            note: 'Order submitted, awaiting payment authorization.',
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      orders.unshift(newOrder);
      saveOrders(orders);
      return newOrder;
    },

    async updateStatus(id, targetStatus, note = '') {
      await new Promise(r => setTimeout(r, 60));
      const index = orders.findIndex(o => o.id === id);
      if (index === -1) throw new Error(`Order ${id} not found`);

      const currentOrder = orders[index];
      
      // Strict state machine validation
      if (!canTransitionOrder(currentOrder.orderStatus, targetStatus)) {
        throw new Error(
          `Invalid state transition: Cannot transition from ${currentOrder.orderStatus} to ${targetStatus}`
        );
      }

      const updatedHistory = [
        ...currentOrder.statusHistory,
        {
          status: targetStatus,
          timestamp: new Date().toISOString(),
          note: note || `Transitioned to ${targetStatus}`,
        },
      ];

      const updated = {
        ...currentOrder,
        orderStatus: targetStatus,
        paymentStatus: targetStatus === ORDER_STATUS.CANCELLED ? currentOrder.paymentStatus : (targetStatus !== ORDER_STATUS.PENDING_PAYMENT ? 'PAID' : 'UNPAID'),
        statusHistory: updatedHistory,
        updatedAt: new Date().toISOString(),
      };

      orders[index] = updated;
      saveOrders(orders);
      return updated;
    },
  };
}
