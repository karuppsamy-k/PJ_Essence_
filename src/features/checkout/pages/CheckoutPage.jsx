import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, CreditCard, Check, ArrowRight, Truck, Sparkles, AlertCircle } from 'lucide-react';
import { useCart } from '../../cart/CartContext';
import { useAuth } from '../../auth/AuthContext';
import { orderService } from '../../../services/orderService';
import { ORDER_STATUS } from '../../../patterns/state-machine/orderStateMachine';

export function CheckoutPage() {
  const { items, subtotal, total, giftWrapping, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: user && !user.isGuest ? user.name : 'Lady Genevieve Vance',
    email: user && !user.isGuest ? user.email : 'genevieve.vance@estate.com',
    street: '740 Park Avenue, Apt 14B',
    city: 'New York',
    state: 'NY',
    zip: '10021',
    country: 'United States',
    phone: '+1 (212) 555-0198',
  });

  const [shippingMethod, setShippingMethod] = useState('ground');
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Processing, 4: Confirmed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);

  if (items.length === 0 && step !== 4) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl text-charcoal">No Creations to Check Out</h2>
        <p className="text-xs text-taupe-dark">Your fragrance vault is empty. Please add creations before proceeding.</p>
        <Link to="/products" className="inline-block px-6 py-2.5 bg-burgundy text-cream text-xs font-semibold uppercase tracking-widest rounded-lg">
          Browse Creations
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateOrderAndPay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Initialize Order in PENDING_PAYMENT state via service layer
      const { order, paymentSession } = await orderService.createOrder({
        items,
        shippingAddress: {
          fullName: formData.fullName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
        },
        giftWrapping,
        customerEmail: formData.email,
        customerName: formData.fullName,
        userId: user ? user.id : null,
      });

      // 2. Execute authoritative serverless payment verification
      // (Never trust client-side; order transitions to PAID only via verified server proof)
      const confirmedOrder = await orderService.confirmPayment(order.id, paymentSession.sessionId);

      setCreatedOrder(confirmedOrder);
      clearCart();
      setStep(4);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Payment verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Checkout Stepper Bar */}
      <div className="flex items-center justify-center space-x-8 text-xs uppercase tracking-widest font-semibold text-taupe-dark border-b border-taupe/20 pb-6">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-burgundy' : ''}`}>
          <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold">1</span>
          <span>Delivery Details</span>
        </div>
        <span className="text-taupe/30">———</span>
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-burgundy' : ''}`}>
          <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold">2</span>
          <span>Payment Authorization</span>
        </div>
        <span className="text-taupe/30">———</span>
        <div className={`flex items-center gap-2 ${step === 4 ? 'text-burgundy' : ''}`}>
          <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold">3</span>
          <span>Confirmation</span>
        </div>
      </div>

      {step === 4 ? (
        /* ORDER CONFIRMATION SCREEN */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center bg-white/90 rounded-3xl border border-bronze/40 p-8 sm:p-14 shadow-2xl space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto">
            <Check className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-bronze font-semibold">
              Payment Verified • Order #{createdOrder?.id}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">
              Your Fragrance Commission is Confirmed
            </h1>
            <p className="text-xs sm:text-sm text-taupe-dark max-w-md mx-auto leading-relaxed">
              We have transmitted your recipe to our Grasse atelier. Your order has commenced its official state machine progression.
            </p>
          </div>

          {/* State Machine Status Badge */}
          <div className="p-4 rounded-xl bg-cream-warm/70 border border-bronze/30 inline-block text-left text-xs space-y-1">
            <div className="flex justify-between gap-6">
              <span className="text-taupe-dark">Authoritative Status:</span>
              <span className="font-bold text-emerald-800 uppercase tracking-wider">{createdOrder?.orderStatus}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-taupe-dark">Total Verified Investment:</span>
              <span className="font-bold text-burgundy">₹{createdOrder?.total}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to={`/orders/${createdOrder?.id}`}
              className="px-8 py-3.5 bg-burgundy hover:bg-burgundy-dark text-cream text-xs font-semibold uppercase tracking-widest rounded-xl shadow-luxury transition-all"
            >
              Track Live Order Progression →
            </Link>
            <Link
              to="/"
              className="px-8 py-3.5 bg-white border border-taupe/30 hover:border-bronze text-charcoal text-xs font-semibold uppercase tracking-widest rounded-xl transition-all"
            >
              Return Home
            </Link>
          </div>
        </motion.div>
      ) : (
        /* MAIN CHECKOUT FORM & SIDEBAR */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Form Column */}
          <div className="lg:col-span-7 space-y-8">
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateOrderAndPay} className="space-y-8">
              {/* Delivery Details */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-bronze/30 p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="font-serif text-2xl text-charcoal font-semibold border-b border-taupe/15 pb-3">
                  Sanctuary Delivery Address
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-lg border border-taupe/30 bg-cream/30 text-xs focus:ring-burgundy"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-lg border border-taupe/30 bg-cream/30 text-xs focus:ring-burgundy"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1">
                    Street Address &amp; Suite / Residence
                  </label>
                  <input
                    type="text"
                    required
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-lg border border-taupe/30 bg-cream/30 text-xs focus:ring-burgundy"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-lg border border-taupe/30 bg-cream/30 text-xs focus:ring-burgundy"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1">
                      State / Province
                    </label>
                    <input
                      type="text"
                      required
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-lg border border-taupe/30 bg-cream/30 text-xs focus:ring-burgundy"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-lg border border-taupe/30 bg-cream/30 text-xs focus:ring-burgundy"
                    />
                  </div>
                </div>
              </div>

              {/* Secure Payment Authorization */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-bronze/30 p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-taupe/15 pb-3">
                  <h3 className="font-serif text-2xl text-charcoal font-semibold">
                    Payment Gateway (Serverless Verified)
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-emerald-800 font-semibold">
                    <Lock className="w-3.5 h-3.5 text-bronze" /> 256-Bit Encrypted
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-bronze/30 bg-cream/40 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-charcoal flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-bronze" /> Stripe &amp; Private Merchant Simulator
                    </span>
                    <span className="text-[10px] uppercase font-bold text-bronze bg-bronze/10 px-2 py-0.5 rounded">
                      Sandbox Safe
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-taupe-dark font-medium mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      disabled
                      value="4242 •••• •••• 4242"
                      className="w-full px-3.5 py-2 rounded-lg border border-taupe/30 bg-white text-xs font-mono text-charcoal"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-taupe-dark font-medium mb-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        disabled
                        value="12 / 28"
                        className="w-full px-3.5 py-2 rounded-lg border border-taupe/30 bg-white text-xs font-mono text-charcoal"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-taupe-dark font-medium mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        disabled
                        value="888"
                        className="w-full px-3.5 py-2 rounded-lg border border-taupe/30 bg-white text-xs font-mono text-charcoal"
                      />
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-taupe-dark leading-relaxed">
                  Upon submission, our backend webhook validates transaction authorization with zero-trust validation before advancing the order state to <strong>PAID</strong>.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-burgundy hover:bg-burgundy-dark text-cream font-semibold uppercase tracking-widest text-xs rounded-xl shadow-luxury-hover flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-bronze" />
                      Authorizing Server Verification...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-bronze-light" />
                      Authorize Payment &amp; Place Order • ${total}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-bronze/35 p-6 shadow-luxury space-y-4">
              <h4 className="font-serif text-xl font-semibold text-charcoal border-b border-taupe/15 pb-3">
                Order Review ({items.length} items)
              </h4>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex items-center justify-between text-xs py-2 border-b border-taupe/10 last:border-none">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-cream-warm" />
                      <div>
                        <span className="font-medium text-charcoal block line-clamp-1">{item.name}</span>
                        <span className="text-taupe-dark text-[11px]">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-charcoal">₹{item.unitPrice * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-taupe/15 space-y-1.5 text-xs text-taupe-dark">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-charcoal">${subtotal}</span>
                </div>
                {giftWrapping && (
                  <div className="flex justify-between">
                    <span>Velvet Case &amp; Wax Seal</span>
                    <span className="font-semibold text-charcoal">+₹15</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>White-Glove Courier</span>
                  <span className="font-semibold text-emerald-800">Complimentary</span>
                </div>
                <div className="flex justify-between font-serif text-xl font-bold text-charcoal pt-3 border-t border-taupe/15">
                  <span>Total Due</span>
                  <span className="text-burgundy">${total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
