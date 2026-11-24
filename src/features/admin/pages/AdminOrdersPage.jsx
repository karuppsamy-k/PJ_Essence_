import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, ArrowRight, ShieldCheck, Check, Clock, AlertCircle } from 'lucide-react';
import { orderService } from '../../../services/orderService';
import {
  ORDER_STATUS,
  ORDER_STATUS_DETAILS,
  ALLOWED_TRANSITIONS,
  canTransitionOrder
} from '../../../patterns/state-machine/orderStateMachine';

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [transitioningId, setTransitioningId] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { orders: all } = await orderService.listOrders({
        status: selectedStatus === 'ALL' ? undefined : selectedStatus,
        limit: 50,
      });
      setOrders(all);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [selectedStatus]);

  const handleTransition = async (orderId, targetStatus) => {
    setTransitioningId(orderId);
    try {
      await orderService.transitionStatus(orderId, targetStatus, `Admin manual transition to ${targetStatus}`);
      await loadOrders();
    } catch (err) {
      alert(err.message);
    } finally {
      setTransitioningId(null);
    }
  };

  const statusFilterKeys = ['ALL', ...Object.values(ORDER_STATUS)];

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase tracking-widest text-bronze font-semibold">Fulfillment Pipeline</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-semibold mt-0.5">Order Commissions Ledger</h1>
        <p className="text-xs text-taupe-dark mt-1">
          Strict state machine validation prevents out-of-order transitions. Payment status requires cryptographic proof.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-2xl border border-bronze/25 shadow-sm overflow-x-auto">
        {statusFilterKeys.map((statusKey) => (
          <button
            key={statusKey}
            type="button"
            onClick={() => setSelectedStatus(statusKey)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              selectedStatus === statusKey
                ? 'bg-burgundy text-cream shadow'
                : 'text-charcoal hover:bg-cream-warm'
            }`}
          >
            {statusKey === 'ALL' ? 'All Commissions' : ORDER_STATUS_DETAILS[statusKey]?.label || statusKey}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-bronze/25 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-warm/80 text-taupe-dark uppercase tracking-wider text-[10px] border-b border-taupe/20">
              <tr>
                <th className="p-4">Commission</th>
                <th className="p-4">Client Dossier</th>
                <th className="p-4">Creations</th>
                <th className="p-4">Total</th>
                <th className="p-4">Current Status</th>
                <th className="p-4">Permitted Transitions</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-taupe/10">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-taupe-dark">
                    Synchronizing orders state ledger...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-taupe-dark">
                    No commissions found matching filter.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => {
                  const currentDetails = ORDER_STATUS_DETAILS[ord.orderStatus] || {};
                  const allowedNextStatuses = ALLOWED_TRANSITIONS[ord.orderStatus] || [];

                  return (
                    <tr key={ord.id} className="hover:bg-cream/30 transition-colors">
                      <td className="p-4 font-serif font-bold text-charcoal">
                        #{ord.id}
                        <span className="block font-sans text-[11px] text-taupe-dark font-normal">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-charcoal block">{ord.customerName}</span>
                        <span className="text-[11px] text-taupe-dark">{ord.customerEmail}</span>
                      </td>

                      <td className="p-4">
                        <span className="font-medium text-charcoal block">{ord.items?.length} items</span>
                        <span className="text-[11px] text-taupe-dark truncate max-w-xs block">
                          {ord.items?.map(i => i.productName || i.name).join(', ')}
                        </span>
                      </td>

                      <td className="p-4 font-serif font-bold text-burgundy text-sm">
                        ₹{ord.total}
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${currentDetails.color || 'bg-cream text-charcoal'}`}>
                          {currentDetails.label || ord.orderStatus}
                        </span>
                      </td>

                      {/* State Machine Transition Action Buttons */}
                      <td className="p-4">
                        {allowedNextStatuses.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {allowedNextStatuses.map((nextStatus) => {
                              const nextDetails = ORDER_STATUS_DETAILS[nextStatus];
                              const isCancel = nextStatus === ORDER_STATUS.CANCELLED;

                              return (
                                <button
                                  key={nextStatus}
                                  type="button"
                                  disabled={transitioningId === ord.id}
                                  onClick={() => handleTransition(ord.id, nextStatus)}
                                  className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                                    isCancel
                                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                      : 'bg-burgundy text-cream hover:bg-burgundy-dark shadow-sm'
                                  }`}
                                >
                                  → {nextDetails?.label || nextStatus}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-[11px] text-taupe-dark italic">
                            Terminal State Reached
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <Link
                          to={`/orders/${ord.id}`}
                          className="text-burgundy hover:underline font-semibold"
                          title="View order dossier"
                        >
                          Dossier
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
