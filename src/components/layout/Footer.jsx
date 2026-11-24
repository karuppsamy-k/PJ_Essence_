import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Compass, Heart, ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-charcoal text-cream border-t border-bronze/30 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-taupe-dark/30">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-full bg-cream/10 border border-bronze/40 text-bronze">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-cream">No Terminology Barrier</h4>
              <p className="text-xs text-taupe-light mt-1 leading-relaxed">
                We speak the language of emotions, seasons, and atmospheres. Discover without intimidating jargon.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-full bg-cream/10 border border-bronze/40 text-bronze">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-cream">Master Distillation</h4>
              <p className="text-xs text-taupe-light mt-1 leading-relaxed">
                Cold-macerated aged agarwood, Tunisian blossom neroli, and pure plant botanicals bottled in Grasse.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-full bg-cream/10 border border-bronze/40 text-bronze">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-cream">White-Glove Guarantee</h4>
              <p className="text-xs text-taupe-light mt-1 leading-relaxed">
                Temperature-controlled climate transport, velvet presentation case, and complete formula traceability.
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12 border-b border-taupe-dark/30">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-serif text-2xl tracking-[0.2em] font-semibold text-cream">
              PJ ESSENCE
            </span>
            <p className="text-xs text-taupe-light leading-relaxed max-w-sm">
              An independent haute parfumerie house elevating daily existence through customized perfumes, artisanal carved car diffusers, and palatial room essences.
            </p>
            <div className="pt-2">
              <Link
                to="/quiz"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-bronze hover:text-bronze-light font-medium group"
              >
                <span>Find Your Scent Signature</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h5 className="text-xs uppercase tracking-widest font-semibold text-bronze mb-4">
              Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-taupe-light">
              <li>
                <Link to="/products?type=PERFUME" className="hover:text-cream transition-colors">
                  Haute Parfumerie
                </Link>
              </li>
              <li>
                <Link to="/products?type=CAR_PERFUME" className="hover:text-cream transition-colors">
                  Artisanal Car Diffusers
                </Link>
              </li>
              <li>
                <Link to="/products?type=ROOM_FRESHENER" className="hover:text-cream transition-colors">
                  Palatial Room Sprays
                </Link>
              </li>
              <li>
                <Link to="/custom-perfume" className="hover:text-cream transition-colors text-bronze-light">
                  Bespoke Atelier Lab
                </Link>
              </li>
              <li>
                <Link to="/collection/winter" className="hover:text-cream transition-colors">
                  Winter Solstice Edition
                </Link>
              </li>
            </ul>
          </div>

          {/* Discovery & Tools */}
          <div>
            <h5 className="text-xs uppercase tracking-widest font-semibold text-bronze mb-4">
              Discovery
            </h5>
            <ul className="space-y-2.5 text-xs text-taupe-light">
              <li>
                <Link to="/quiz" className="hover:text-cream transition-colors">
                  Natural Language Quiz
                </Link>
              </li>
              <li>
                <Link to="/discover" className="hover:text-cream transition-colors">
                  Fragrance Pyramid Notes
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-cream transition-colors">
                  Olfactory Family Index
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-cream transition-colors">
                  Client Fragrance Portfolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-xs uppercase tracking-widest font-semibold text-bronze mb-4">
              The Atelier Dispatch
            </h5>
            <p className="text-xs text-taupe-light leading-relaxed mb-3">
              Receive limited release previews and seasonal harvest notifications.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to the PJ Essence Dispatch.'); }} className="space-y-2">
              <input
                type="email"
                required
                placeholder="your.email@estate.com"
                className="w-full px-3 py-2 bg-cream/10 border border-taupe-dark/40 rounded text-xs text-cream placeholder-taupe-light focus:outline-none focus:border-bronze"
              />
              <button
                type="submit"
                className="w-full py-2 bg-burgundy hover:bg-burgundy-dark text-cream text-[11px] font-semibold uppercase tracking-widest rounded transition-colors"
              >
                Join Circle
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-taupe-dark">
          <p>© {new Date().getFullYear()} PJ Essence Parfumerie International. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <Link to="/discover" className="hover:text-cream transition-colors">Fragrance Philosophy</Link>
            <Link to="/admin" className="hover:text-cream transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
