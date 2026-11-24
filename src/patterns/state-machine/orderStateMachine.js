/**
 * Order Lifecycle State Machine
 * Strictly enforces valid business transitions and prevents illegal jumps.
 */

export const ORDER_STATUS = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PAID: 'PAID',
  FORMULA_CONFIRMED: 'FORMULA_CONFIRMED',
  IN_PRODUCTION: 'IN_PRODUCTION',
  QUALITY_CHECK: 'QUALITY_CHECK',
  PACKED: 'PACKED',
  SHIPPED: 'SHIPPED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const ORDER_STATUS_DETAILS = {
  [ORDER_STATUS.PENDING_PAYMENT]: {
    label: 'Pending Payment',
    description: 'Awaiting secure transaction authorization.',
    stepIndex: 0,
    color: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  [ORDER_STATUS.PAID]: {
    label: 'Payment Verified',
    description: 'Funds confirmed via serverless payment gateway.',
    stepIndex: 1,
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  [ORDER_STATUS.FORMULA_CONFIRMED]: {
    label: 'Formula Confirmed',
    description: 'Master nose approved bespoke composition and essence ratios.',
    stepIndex: 2,
    color: 'text-bronze bg-bronze/10 border-bronze/30',
  },
  [ORDER_STATUS.IN_PRODUCTION]: {
    label: 'In Production',
    description: 'Artisanal maceration, formulation, and custom bottle decanting.',
    stepIndex: 3,
    color: 'text-burgundy bg-burgundy/10 border-burgundy/20',
  },
  [ORDER_STATUS.QUALITY_CHECK]: {
    label: 'Quality Inspection',
    description: 'Olfactory consistency, nozzle seal, and aesthetic review.',
    stepIndex: 4,
    color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
  },
  [ORDER_STATUS.PACKED]: {
    label: 'Luxury Packed',
    description: 'Sealed in PJ Essence velvet gift box with wax insignia.',
    stepIndex: 5,
    color: 'text-walnut bg-walnut/10 border-walnut/20',
  },
  [ORDER_STATUS.SHIPPED]: {
    label: 'Shipped',
    description: 'Dispatched via temperature-controlled courier with tracking.',
    stepIndex: 6,
    color: 'text-sky-700 bg-sky-50 border-sky-200',
  },
  [ORDER_STATUS.OUT_FOR_DELIVERY]: {
    label: 'Out for Delivery',
    description: 'Courier is en route to the sanctuary address.',
    stepIndex: 7,
    color: 'text-teal-700 bg-teal-50 border-teal-200',
  },
  [ORDER_STATUS.DELIVERED]: {
    label: 'Delivered',
    description: 'Safely delivered into your hands.',
    stepIndex: 8,
    color: 'text-emerald-800 bg-emerald-100 border-emerald-300',
  },
  [ORDER_STATUS.CANCELLED]: {
    label: 'Cancelled',
    description: 'Order terminated and voided.',
    stepIndex: -1,
    color: 'text-rose-700 bg-rose-50 border-rose-200',
  },
};

export const ALLOWED_TRANSITIONS = {
  [ORDER_STATUS.PENDING_PAYMENT]: [ORDER_STATUS.PAID, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PAID]: [ORDER_STATUS.FORMULA_CONFIRMED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.FORMULA_CONFIRMED]: [ORDER_STATUS.IN_PRODUCTION, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.IN_PRODUCTION]: [ORDER_STATUS.QUALITY_CHECK],
  [ORDER_STATUS.QUALITY_CHECK]: [ORDER_STATUS.PACKED],
  [ORDER_STATUS.PACKED]: [ORDER_STATUS.SHIPPED],
  [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.OUT_FOR_DELIVERY],
  [ORDER_STATUS.OUT_FOR_DELIVERY]: [ORDER_STATUS.DELIVERED],
  [ORDER_STATUS.DELIVERED]: [],
  [ORDER_STATUS.CANCELLED]: [],
};

/**
 * Validates if the order can transition from currentStatus to targetStatus.
 */
export function canTransitionOrder(currentStatus, targetStatus) {
  if (!currentStatus || !targetStatus) return false;
  if (currentStatus === targetStatus) return true; // idempotent
  const validNext = ALLOWED_TRANSITIONS[currentStatus] || [];
  return validNext.includes(targetStatus);
}

/**
 * Calculates transition progression steps for order tracking UI
 */
export function getTrackingSteps(currentStatus) {
  const linearStatuses = [
    ORDER_STATUS.PENDING_PAYMENT,
    ORDER_STATUS.PAID,
    ORDER_STATUS.FORMULA_CONFIRMED,
    ORDER_STATUS.IN_PRODUCTION,
    ORDER_STATUS.QUALITY_CHECK,
    ORDER_STATUS.PACKED,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.OUT_FOR_DELIVERY,
    ORDER_STATUS.DELIVERED,
  ];

  const currentIndex = linearStatuses.indexOf(currentStatus);

  return linearStatuses.map((status, idx) => {
    const details = ORDER_STATUS_DETAILS[status];
    const isCompleted = currentIndex > idx;
    const isCurrent = currentIndex === idx;
    const isPending = currentIndex < idx;

    return {
      status,
      label: details.label,
      description: details.description,
      isCompleted,
      isCurrent,
      isPending,
    };
  });
}
