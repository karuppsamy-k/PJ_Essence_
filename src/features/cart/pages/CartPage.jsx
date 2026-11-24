import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Gift, ArrowRight, ShieldCheck, Sparkles, Tag } from 'lucide-react';
import { useCart } from '../CartContext';

export function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    total,
    itemCount,
    freeShippingThreshold,
    amountToFreeShipping,
    shippingCost,
    giftWrapping,
    setGiftWrapping,
    giftWrappingFee,
    estimatedTax,
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'HERALDRY10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promotion code. Try "HERALDRY10" for 10% VIP concession.');
    }
  };

  const discountAmount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const finalTotal = Math.max(0, total - discountAmount);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-cream-warm border border-bronze/30 flex items-center justify-center mx-auto text-bronze">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">Your Fragrance Vault is Empty</h1>
        <p className="text-xs sm:text-sm text-taupe-dark max-w-md mx-auto leading-relaxed">
          No creations currently reside in your vault. Formulate a bespoke scent in our atelier or explore our seasonal harvests.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            to="/products"
            className="px-8 py-3.5 bg-burgundy hover:bg-burgundy-dark text-cream text-xs font-semibold uppercase tracking-widest rounded-xl shadow-luxury transition-all"
          >
            Explore Catalog
          </Link>
          <Link
            to="/custom-perfume"
            className="px-8 py-3.5 bg-white border border-bronze/40 hover:border-bronze text-charcoal text-xs font-semibold uppercase tracking-widest rounded-xl transition-all"
          >
            Bespoke Atelier
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div>
        <span className="text-xs uppercase tracking-widest text-bronze font-semibold">Your Acquisitions</span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal">Fragrance Vault Portfolio</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.cartItemId}
              className="p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-bronze/25 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
            >
              <div className="flex items-center gap-5">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=300&q=80'}
                  alt={item.name}
                  className="w-24 h-24 rounded-xl object-cover bg-cream-warm border border-taupe/20 flex-shrink-0"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-bronze bg-bronze/10 px-2 py-0.5 rounded">
                      {item.isCustom ? 'Bespoke Atelier' : item.type?.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-semibold text-charcoal">
                    {item.name}
                  </h3>

                  {item.customData?.engravedLabel && (
                    <p className="text-xs text-taupe-dark italic">
                      Engraved Crest: "{item.customData.engravedLabel}"
                    </p>
                  )}

                  <span className="text-xs text-taupe-dark block">
                    {item.attributes?.volume || item.attributes?.mountType || '50ml Crystal Flacon'}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-4 sm:pt-0 border-t sm:border-none border-taupe/15">
                <div className="flex items-center border border-taupe/30 rounded-xl bg-white px-2 py-1">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                    className="p-1 hover:text-burgundy"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-semibold text-charcoal">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                    className="p-1 hover:text-burgundy"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="font-serif text-xl font-bold text-burgundy block">
                    ₹{item.unitPrice * item.quantity}
                  </span>
                  <span className="text-[11px] text-taupe-dark">
                    (₹{item.unitPrice} each)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.cartItemId)}
                  className="p-2 text-taupe hover:text-burgundy transition-colors"
                  title="Remove creation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Gift Packaging Toggle */}
          <label className="flex items-start gap-4 p-5 rounded-2xl border border-bronze/35 bg-white/70 shadow-sm cursor-pointer hover:bg-white transition-colors">
            <input
              type="checkbox"
              checked={giftWrapping}
              onChange={(e) => setGiftWrapping(e.target.checked)}
              className="mt-1 text-burgundy rounded border-taupe/40 focus:ring-burgundy"
            />
            <div className="text-xs flex-1">
              <div className="flex items-center justify-between font-semibold text-charcoal">
                <span className="flex items-center gap-1.5 text-bronze-dark text-sm font-serif">
                  <Gift className="w-4 h-4 text-bronze" /> Add Hand-Stamped Burgundy Velvet Box &amp; Wax Crest
                </span>
                <span className="text-burgundy font-bold">+₹15</span>
              </div>
              <p className="text-xs text-taupe-dark mt-1 leading-relaxed">
                Hand-packed in royal burgundy velvet presentation casing, tied with dark bronze grosgrain ribbon and stamped with molten red wax. Includes handwritten perfumer provenance card.
              </p>
            </div>
          </label>
        </div>

        {/* Right: Investment Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-bronze/35 p-6 sm:p-8 shadow-luxury space-y-6">
            <h3 className="font-serif text-2xl text-charcoal font-semibold border-b border-taupe/15 pb-4">
              Vault Summary
            </h3>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <label className="block text-[11px] uppercase tracking-wider text-taupe-dark font-medium">
                Privilege / Concession Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="HERALDRY10"
                  className="w-full px-3 py-2 rounded-lg border border-taupe/30 bg-cream/40 text-xs uppercase tracking-wider focus:ring-burgundy"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-charcoal text-cream text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-burgundy transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-bronze" /> 10% VIP Concession applied
                </p>
              )}
              {promoError && (
                <p className="text-xs text-rose-700">{promoError}</p>
              )}
            </form>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs text-taupe-dark border-t border-taupe/15 pt-4">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-semibold text-charcoal">${subtotal}</span>
              </div>

              {promoApplied && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>VIP Concession (10%)</span>
                  <span>-${discountAmount}</span>
                </div>
              )}

              {giftWrapping && (
                <div className="flex justify-between">
                  <span>Velvet Box &amp; Wax Seal</span>
                  <span className="font-semibold text-charcoal">+₹15</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>White-Glove Courier</span>
                <span className="font-semibold text-charcoal">
                  {shippingCost === 0 ? 'Complimentary' : `$${shippingCost}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Regional Tax</span>
                <span className="font-semibold text-charcoal">${estimatedTax}</span>
              </div>

              <div className="flex justify-between font-serif text-2xl font-bold text-charcoal pt-4 border-t border-taupe/20">
                <span>Total Investment</span>
                <span className="text-burgundy">${finalTotal}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-burgundy hover:bg-burgundy-dark text-cream font-semibold uppercase tracking-widest text-xs rounded-xl shadow-luxury-hover flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <span>Proceed to White-Glove Checkout</span>
              <ArrowRight className="w-4 h-4 text-bronze-light" />
            </button>

            <div className="text-center pt-2">
              <span className="text-[11px] text-taupe-dark flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-bronze" />
                Guaranteed Authentic Grasse Formulation
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
