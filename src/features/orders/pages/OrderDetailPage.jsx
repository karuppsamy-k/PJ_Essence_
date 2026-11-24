import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Clock, Package, Truck, ShieldCheck, MapPin, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { orderService } from '../../../services/orderService';
import { getTrackingSteps, ORDER_STATUS, ORDER_STATUS_DETAILS } from '../../../patterns/state-machine/orderStateMachine';
import { useAuth } from '../../auth/AuthContext';

export function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      try {
        const found = await orderService.getOrderById(id);
        setOrder(found);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Sparkles className="w-8 h-8 text-bronze animate-pulse mx-auto mb-4" />
        <p className="font-serif text-2xl text-charcoal">Loading Order Dossier...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl text-charcoal">Order Not Found</h2>
        <p className="text-xs text-taupe-dark">No order matches identification #{id}.</p>
        <Link to="/account" className="inline-block px-6 py-2.5 bg-burgundy text-cream text-xs font-semibold uppercase tracking-widest rounded-lg">
          View Account Orders
        </Link>
      </div>
    );
  }

  const trackingSteps = getTrackingSteps(order.orderStatus);
  const currentDetails = ORDER_STATUS_DETAILS[order.orderStatus] || {};

  // For testing/admin live simulator
  const handleSimulateNextStep = async (nextStatus) => {
    setTransitioning(true);
    try {
      const updated = await orderService.transitionStatus(
        order.id,
        nextStatus,
        `Progressed to ${nextStatus} via live state machine simulator`
      );
      setOrder(updated);
    } catch (err) {
      alert(err.message);
    } finally {
      setTransitioning(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-taupe/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest text-bronze font-semibold">Order Dossier</span>
            <span className="text-taupe">•</span>
            <span className="text-xs text-taupe-dark">Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-semibold">
            Commission #{order.id}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${currentDetails.color || 'bg-cream text-charcoal'}`}>
            {currentDetails.label || order.orderStatus}
          </span>
        </div>
      </div>

      {/* FINITE STATE MACHINE PROGRESSION STEPPER */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl border border-bronze/35 p-6 sm:p-10 shadow-luxury space-y-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-bronze font-semibold">Lifecycle State Machine</span>
          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal mt-1">Artisanal Production &amp; Delivery Stepper</h2>
          <p className="text-xs text-taupe-dark mt-1">
            Strict deterministic lifecycle guarantees each bespoke flacon is verified, macerated, and hand-inspected.
          </p>
        </div>

        {/* Stepper Timeline */}
        <div className="relative">
          <div className="space-y-6">
            {trackingSteps.map((step, idx) => (
              <div key={step.status} className="flex items-start gap-4 sm:gap-6 relative group">
                {/* Stepper Node */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all z-10 ${
                      step.isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : step.isCurrent
                        ? 'bg-burgundy border-bronze text-white ring-4 ring-burgundy/15 animate-pulse'
                        : 'bg-white border-taupe/30 text-taupe-dark'
                    }`}
                  >
                    {step.isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-semibold">{idx + 1}</span>
                    )}
                  </div>
                  {idx < trackingSteps.length - 1 && (
                    <div
                      className={`w-0.5 h-10 mt-1 transition-colors ${
                        step.isCompleted ? 'bg-emerald-500' : 'bg-taupe/20'
                      }`}
                    />
                  )}
                </div>

                {/* Node Text */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-serif text-lg font-semibold ${step.isCurrent ? 'text-burgundy' : step.isCompleted ? 'text-charcoal' : 'text-taupe-dark'}`}>
                      {step.label}
                    </h4>
                    {step.isCurrent && (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-burgundy bg-burgundy/10 px-2.5 py-0.5 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-taupe-dark mt-0.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tracking Details */}
        {order.trackingNumber && (
          <div className="mt-8 p-4 rounded-xl bg-cream-warm/70 border border-bronze/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-bronze flex-shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-charcoal block">Courier Tracking: {order.trackingNumber}</span>
                <span className="text-taupe-dark">{order.carrier}</span>
              </div>
            </div>
            <span className="text-xs text-emerald-800 font-semibold">Climate-Safe Sealed En Route</span>
          </div>
        )}
      </div>

      {/* ORDER ITEMS & ADDRESS BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 bg-white/80 rounded-2xl border border-bronze/25 p-6 shadow-sm space-y-4">
          <h3 className="font-serif text-xl text-charcoal font-semibold border-b border-taupe/15 pb-3">
            Commissioned Creations ({order.items?.length})
          </h3>

          <div className="space-y-4">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex gap-4 p-3 rounded-xl bg-cream/30 border border-taupe/15">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=200&q=80'}
                  alt={item.productName}
                  className="w-16 h-16 rounded-lg object-cover bg-cream-warm border border-taupe/20"
                />
                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-serif text-base font-semibold text-charcoal">{item.productName}</span>
                    <span className="font-serif font-bold text-burgundy text-sm">₹{item.unitPrice * item.quantity}</span>
                  </div>
                  <span className="text-taupe-dark block mt-0.5">Quantity: {item.quantity}</span>

                  {item.customFormulaNotes && (
                    <div className="mt-2 pt-2 border-t border-taupe/15 text-[11px] space-y-0.5 text-taupe-dark">
                      <p><strong className="text-charcoal">Top:</strong> {item.customFormulaNotes.top?.join(', ')}</p>
                      <p><strong className="text-charcoal">Heart:</strong> {item.customFormulaNotes.heart?.join(', ')}</p>
                      <p><strong className="text-charcoal">Base:</strong> {item.customFormulaNotes.base?.join(', ')}</p>
                      {item.customFormulaNotes.engraving && (
                        <p className="italic text-bronze"><strong className="text-charcoal">Engraving:</strong> "{item.customFormulaNotes.engraving}"</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="border-t border-taupe/20 pt-4 space-y-1.5 text-xs text-taupe-dark">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-charcoal">${order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>White-Glove Courier</span>
              <span className="font-semibold text-charcoal">{order.shipping === 0 ? 'Complimentary' : `$${order.shipping}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Regional Tax</span>
              <span className="font-semibold text-charcoal">${order.tax}</span>
            </div>
            <div className="flex justify-between font-serif text-xl font-bold text-charcoal pt-2 border-t border-taupe/15">
              <span>Total Settled</span>
              <span className="text-burgundy">₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address & Client */}
        <div className="lg:col-span-4 bg-white/80 rounded-2xl border border-bronze/25 p-6 shadow-sm space-y-6 text-xs">
          <div>
            <h4 className="font-serif text-lg font-semibold text-charcoal border-b border-taupe/15 pb-2 mb-3">
              Delivery Destination
            </h4>
            <div className="space-y-1 text-taupe-dark leading-relaxed">
              <span className="font-bold text-charcoal block">{order.shippingAddress?.fullName || order.customerName}</span>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold text-charcoal border-b border-taupe/15 pb-2 mb-3">
              Payment Audit Log
            </h4>
            <div className="space-y-1 text-taupe-dark">
              <p><strong className="text-charcoal">Status:</strong> {order.paymentStatus}</p>
              <p><strong className="text-charcoal">Gateway:</strong> Serverless Stripe / Verified</p>
              <p><strong className="text-charcoal">Recipient:</strong> {order.customerEmail}</p>
            </div>
          </div>

          {/* Quick simulator controls for reviewers/admin */}
          <div className="p-4 rounded-xl bg-cream-warm/70 border border-bronze/30 space-y-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-bronze block">
              State Machine Progression Control
            </span>
            <p className="text-[11px] text-taupe-dark leading-tight">
              Test next valid state transition enforced by finite state machine.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {order.orderStatus === ORDER_STATUS.PAID && (
                <button
                  type="button"
                  disabled={transitioning}
                  onClick={() => handleSimulateNextStep(ORDER_STATUS.FORMULA_CONFIRMED)}
                  className="px-3 py-1 bg-burgundy text-cream text-[10px] font-semibold uppercase tracking-wider rounded"
                >
                  Confirm Formula →
                </button>
              )}
              {order.orderStatus === ORDER_STATUS.FORMULA_CONFIRMED && (
                <button
                  type="button"
                  disabled={transitioning}
                  onClick={() => handleSimulateNextStep(ORDER_STATUS.IN_PRODUCTION)}
                  className="px-3 py-1 bg-burgundy text-cream text-[10px] font-semibold uppercase tracking-wider rounded"
                >
                  Start Production →
                </button>
              )}
              {order.orderStatus === ORDER_STATUS.IN_PRODUCTION && (
                <button
                  type="button"
                  disabled={transitioning}
                  onClick={() => handleSimulateNextStep(ORDER_STATUS.QUALITY_CHECK)}
                  className="px-3 py-1 bg-burgundy text-cream text-[10px] font-semibold uppercase tracking-wider rounded"
                >
                  Quality Check →
                </button>
              )}
              {order.orderStatus === ORDER_STATUS.QUALITY_CHECK && (
                <button
                  type="button"
                  disabled={transitioning}
                  onClick={() => handleSimulateNextStep(ORDER_STATUS.PACKED)}
                  className="px-3 py-1 bg-burgundy text-cream text-[10px] font-semibold uppercase tracking-wider rounded"
                >
                  Pack in Velvet Box →
                </button>
              )}
              {order.orderStatus === ORDER_STATUS.PACKED && (
                <button
                  type="button"
                  disabled={transitioning}
                  onClick={() => handleSimulateNextStep(ORDER_STATUS.SHIPPED)}
                  className="px-3 py-1 bg-burgundy text-cream text-[10px] font-semibold uppercase tracking-wider rounded"
                >
                  Ship via Courier →
                </button>
              )}
              {order.orderStatus === ORDER_STATUS.SHIPPED && (
                <button
                  type="button"
                  disabled={transitioning}
                  onClick={() => handleSimulateNextStep(ORDER_STATUS.OUT_FOR_DELIVERY)}
                  className="px-3 py-1 bg-burgundy text-cream text-[10px] font-semibold uppercase tracking-wider rounded"
                >
                  Out for Delivery →
                </button>
              )}
              {order.orderStatus === ORDER_STATUS.OUT_FOR_DELIVERY && (
                <button
                  type="button"
                  disabled={transitioning}
                  onClick={() => handleSimulateNextStep(ORDER_STATUS.DELIVERED)}
                  className="px-3 py-1 bg-emerald-700 text-cream text-[10px] font-semibold uppercase tracking-wider rounded"
                >
                  Mark Delivered ✓
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
