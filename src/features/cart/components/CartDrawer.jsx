import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, Gift, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../CartContext';

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    subtotal,
    total,
    itemCount,
    amountToFreeShipping,
    freeShippingThreshold,
    shippingCost,
    giftWrapping,
    setGiftWrapping,
    giftWrappingFee,
  } = useCart();

  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const progressPercent = Math.min(100, Math.round(((freeShippingThreshold - amountToFreeShipping) / freeShippingThreshold) * 100));

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="w-screen max-w-md bg-cream-light shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-taupe/20 bg-cream flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-burgundy" />
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-charcoal">Your Fragrance Vault</h2>
                    <span className="text-xs text-taupe-dark">{itemCount} {itemCount === 1 ? 'creation' : 'creations'} selected</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-taupe-dark hover:text-charcoal rounded-full hover:bg-cream-dark/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Tier Bar */}
              <div className="bg-cream-warm/80 px-6 py-3 border-b border-taupe/15">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-taupe-dark font-medium">
                    {amountToFreeShipping > 0 ? (
                      <>Add <span className="font-semibold text-burgundy">${amountToFreeShipping}</span> for complimentary white-glove shipping</>
                    ) : (
                      <span className="text-emerald-800 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-bronze" /> Complimentary White-Glove Courier Unlocked
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] font-semibold text-bronze">{progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-taupe/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-bronze transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-cream-warm flex items-center justify-center mb-4 text-taupe-dark border border-bronze/30">
                      <ShoppingBag className="w-8 h-8 text-bronze" />
                    </div>
                    <h3 className="font-serif text-xl text-charcoal mb-2">Your Vault is Empty</h3>
                    <p className="text-xs text-taupe-dark max-w-xs mb-6">
                      Explore our bespoke atelier, seasonal perfumes, or take our guided quiz to find your signature scent.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/products');
                      }}
                      className="px-6 py-2.5 bg-burgundy text-cream text-xs font-semibold uppercase tracking-widest rounded-lg hover:bg-burgundy-dark transition-colors"
                    >
                      Explore Catalog
                    </button>
                  </div>
                ) : (
                  items.map(item => (
                    <div
                      key={item.cartItemId}
                      className="p-4 bg-white rounded-xl border border-taupe/20 shadow-sm flex gap-4 relative group"
                    >
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=200&q=80'}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover bg-cream-warm flex-shrink-0 border border-taupe/20"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="font-serif text-base font-semibold text-charcoal truncate pr-4">
                            {item.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.cartItemId)}
                            className="text-taupe hover:text-burgundy transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.isCustom ? (
                          <div className="mt-1">
                            <span className="inline-block text-[10px] font-semibold tracking-wider uppercase text-bronze bg-bronze/10 px-2 py-0.5 rounded">
                              Bespoke Formulation
                            </span>
                            {item.customData?.engravedLabel && (
                              <p className="text-[11px] text-taupe-dark mt-0.5 italic">
                                Engraving: "{item.customData.engravedLabel}"
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-taupe-dark block">
                            {item.attributes?.volume || item.type}
                          </span>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center border border-taupe/30 rounded-lg bg-cream/40">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="p-1 hover:text-burgundy transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2.5 text-xs font-semibold text-charcoal">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="p-1 hover:text-burgundy transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="font-serif font-bold text-base text-burgundy">
                            ₹{item.unitPrice * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer & Checkout Area */}
              {items.length > 0 && (
                <div className="p-6 border-t border-taupe/20 bg-cream space-y-4">
                  {/* Gift Wrapping Toggle */}
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-bronze/30 bg-white/60 cursor-pointer hover:bg-white transition-colors">
                    <input
                      type="checkbox"
                      checked={giftWrapping}
                      onChange={e => setGiftWrapping(e.target.checked)}
                      className="mt-1 text-burgundy rounded border-taupe/40 focus:ring-burgundy"
                    />
                    <div className="text-xs flex-1">
                      <div className="flex items-center justify-between font-semibold text-charcoal">
                        <span className="flex items-center gap-1.5 text-bronze-dark">
                          <Gift className="w-3.5 h-3.5" /> Bespoke Velvet Box & Wax Seal Packaging
                        </span>
                        <span>+₹15</span>
                      </div>
                      <p className="text-[11px] text-taupe-dark mt-0.5">
                        Hand-packed in deep burgundy velvet with gold-embossed heraldic crest and personalized wax seal.
                      </p>
                    </div>
                  </label>

                  {/* Summary Rows */}
                  <div className="space-y-1.5 text-xs text-taupe-dark pt-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-charcoal">${subtotal}</span>
                    </div>
                    {giftWrapping && (
                      <div className="flex justify-between">
                        <span>Bespoke Velvet Packaging</span>
                        <span className="font-semibold text-charcoal">+₹15</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>White-Glove Shipping</span>
                      <span className="font-semibold text-charcoal">
                        {shippingCost === 0 ? 'Complimentary' : `$${shippingCost}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-serif text-lg font-bold text-charcoal pt-2 border-t border-taupe/20">
                      <span>Total Investment</span>
                      <span className="text-burgundy">${total}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full py-3.5 bg-burgundy hover:bg-burgundy-dark text-cream font-semibold uppercase tracking-widest text-xs rounded-xl shadow-luxury flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center">
                    <Link
                      to="/cart"
                      onClick={() => setIsCartOpen(false)}
                      className="text-xs text-taupe-dark hover:text-burgundy transition-colors underline underline-offset-4"
                    >
                      View Full Vault Details
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
