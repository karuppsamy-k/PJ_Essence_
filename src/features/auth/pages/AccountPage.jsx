import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Sparkles, LogOut, Compass, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { orderService } from '../../../services/orderService';
import { quizService } from '../../../services/quizService';
import { ORDER_STATUS_DETAILS } from '../../../patterns/state-machine/orderStateMachine';

export function AccountPage() {
  const { user, logout, openAuth, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [savedProfile, setSavedProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccountData() {
      setLoading(true);
      try {
        const { orders: allOrders } = await orderService.listOrders();
        setOrders(allOrders);
        const profile = quizService.getLastSavedProfile();
        setSavedProfile(profile);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadAccountData();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Account Hero Bar */}
      <div className="bg-gradient-to-r from-cream via-white to-cream-warm rounded-3xl p-8 sm:p-10 border border-bronze/35 shadow-luxury flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-burgundy/10 text-burgundy border border-burgundy/25 flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-bronze font-semibold">
                {isAdmin ? 'Master Administrator' : 'Privileged Client Portfolio'}
              </span>
              {isAdmin && (
                <span className="text-[10px] uppercase font-bold bg-burgundy text-cream px-2 py-0.5 rounded">
                  Admin
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-semibold mt-1">
              {user?.name || 'Sanctuary Client'}
            </h1>
            <p className="text-xs text-taupe-dark">{user?.email || 'guest@pjessence.com'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="px-5 py-2.5 bg-burgundy hover:bg-burgundy-dark text-cream text-xs font-semibold uppercase tracking-wider rounded-xl shadow transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-4 h-4" />
              Admin Portal
            </Link>
          )}

          <button
            type="button"
            onClick={logout}
            className="px-4 py-2.5 border border-taupe/30 hover:border-burgundy text-xs font-semibold uppercase tracking-wider text-charcoal hover:text-burgundy rounded-xl transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Order History */}
        <div className="lg:col-span-8 bg-white/80 rounded-2xl border border-bronze/25 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-taupe/15 pb-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-bronze font-semibold">Acquisitions Dossier</span>
              <h2 className="font-serif text-2xl text-charcoal mt-0.5">Order Commissions</h2>
            </div>
            <span className="text-xs text-taupe-dark">{orders.length} orders on record</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-taupe-dark">Retrieving commissions ledger...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <p className="text-xs text-taupe-dark">No orders registered to this client account.</p>
              <Link to="/products" className="inline-block px-5 py-2 bg-burgundy text-cream text-xs font-semibold uppercase tracking-wider rounded-lg">
                Explore Creations
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => {
                const statusDetails = ORDER_STATUS_DETAILS[ord.orderStatus] || {};
                return (
                  <div
                    key={ord.id}
                    className="p-5 rounded-xl border border-taupe/20 bg-cream/30 hover:bg-white hover:border-bronze transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-charcoal text-base">#{ord.id}</span>
                        <span className="text-taupe">•</span>
                        <span className="text-xs text-taupe-dark">{new Date(ord.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-charcoal font-medium">
                        {ord.items?.map(i => i.productName || i.name).join(', ')}
                      </p>
                      <span className="text-xs text-taupe-dark">
                        {ord.items?.length} {ord.items?.length === 1 ? 'creation' : 'creations'} • White-Glove Handled
                      </span>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                      <span className="font-serif font-bold text-burgundy text-lg">
                        ₹{ord.total}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${statusDetails.color || 'bg-cream text-charcoal'}`}>
                        {statusDetails.label || ord.orderStatus}
                      </span>
                      <Link
                        to={`/orders/${ord.id}`}
                        className="text-xs text-burgundy hover:underline flex items-center gap-0.5 font-medium mt-1"
                      >
                        <span>View Dossier</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Scent Profile & Lab Notebook */}
        <div className="lg:col-span-4 space-y-6">
          {/* Scent Profile Snapshot */}
          <div className="bg-white/80 rounded-2xl border border-bronze/25 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-bronze font-semibold">
              <Compass className="w-4 h-4 text-bronze" />
              <span>Personal Scent Profile</span>
            </div>

            {savedProfile ? (
              <div className="space-y-3">
                <h3 className="font-serif text-xl text-charcoal font-semibold">
                  Saved Discovery Assessment
                </h3>
                <div className="space-y-1.5 text-xs text-taupe-dark">
                  <div className="flex justify-between">
                    <span>Preferred Season:</span>
                    <span className="font-semibold text-charcoal">{savedProfile.season}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Warmth Index:</span>
                    <span className="font-semibold text-burgundy">{savedProfile.warmth} / 10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Intensity Projection:</span>
                    <span className="font-semibold text-bronze-dark">{savedProfile.intensity} / 10</span>
                  </div>
                  {savedProfile.preferredNotes?.length > 0 && (
                    <div className="pt-2 border-t border-taupe/15">
                      <span className="block text-[11px] text-taupe-dark mb-1">Key Resonating Notes:</span>
                      <div className="flex flex-wrap gap-1">
                        {savedProfile.preferredNotes.map((note, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-cream text-charcoal border border-taupe/20 text-[10px]">
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3">
                  <Link
                    to="/quiz"
                    className="w-full py-2 bg-cream-warm hover:bg-white text-charcoal border border-bronze/30 text-xs font-semibold uppercase tracking-wider rounded-lg block text-center transition-colors"
                  >
                    Retake Natural Scent Quiz
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-taupe-dark leading-relaxed">
                  You have not yet completed the natural-language fragrance quiz. Discover your olfactory profile to unlock tailored recommendations.
                </p>
                <Link
                  to="/quiz"
                  className="w-full py-2.5 bg-burgundy text-cream text-xs font-semibold uppercase tracking-wider rounded-lg block text-center"
                >
                  Start Discovery Quiz
                </Link>
              </div>
            )}
          </div>

          {/* Bespoke Lab Notebook Link */}
          <div className="bg-gradient-to-br from-burgundy/10 via-cream to-cream rounded-2xl border border-bronze/30 p-6 space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-bronze font-semibold">Atelier Formula Vault</span>
            <h4 className="font-serif text-lg text-charcoal font-semibold">Create a Private Formula</h4>
            <p className="text-xs text-taupe-dark leading-relaxed">
              Design a custom blend with personalized flacon engraving for your personal collection or a distinguished gift.
            </p>
            <Link
              to="/custom-perfume"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-burgundy hover:underline pt-1"
            >
              <span>Open Atelier Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
