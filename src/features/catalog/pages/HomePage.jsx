import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Sparkles, ArrowRight, ShieldCheck, Heart, Wind, Home, Star, Droplets, User, Users } from 'lucide-react';
import { catalogService } from '../../../services/catalogService';
import { ProductCard } from '../../../components/shared/ProductCard';
import { HERO_PRODUCTS } from '../../../data/heroProducts';
import { useProductCarousel } from '../../../hooks/useProductCarousel';
import { HeroProductShowcase } from '../components/hero/HeroProductShowcase';
import { SynchronizedFragrancePyramid } from '../components/hero/SynchronizedFragrancePyramid';

export function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Central synchronized carousel engine: single source of truth for all 8 perfumes
  const carousel = useProductCarousel({
    products: HERO_PRODUCTS,
    interval: 7000,
    autoPlay: true,
  });

  const handleScrollToPyramid = () => {
    const el = document.getElementById('fragrance-pyramid-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const { products } = await catalogService.getProducts({ limit: 4 });
        setFeaturedProducts(products);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-24">
      {/* 1. SYNCHRONIZED AUTOMATIC LUXURY HERO CAMPAIGN (8 PERFUMES SEQUENCE) */}
      <section>
        <HeroProductShowcase
          carousel={carousel}
          onScrollToPyramid={handleScrollToPyramid}
        />
      </section>

      {/* 2. THE MASTER DISCIPLINES (INCLUDING ATTAR & BESPOKE ATELIER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-bronze font-semibold">The House Disciplines</span>
          <h2 className="font-serif text-3xl sm:text-5xl text-charcoal">Expressions of Olfactory Luxury</h2>
          <p className="text-sm text-taupe-dark leading-relaxed">
            From concentrated skin oils and bespoke formulation to palatial atmospheric diffusion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Discipline 1: Custom Perfumes */}
          <Link
            to="/custom-perfume"
            className="group p-6 rounded-2xl bg-white/80 border border-bronze/25 hover:border-bronze shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-burgundy/10 text-burgundy flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-charcoal group-hover:text-burgundy transition-colors mb-2">
                Customized Perfumes
              </h3>
              <p className="text-xs text-taupe-dark leading-relaxed">
                Step into our digital atelier. Formulate top, heart, and base fractions with custom diamond label engraving.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-taupe/15 flex items-center text-xs font-semibold text-burgundy uppercase tracking-wider gap-1">
              <span>Compose</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Discipline 2: Ready-Made Haute Perfumes */}
          <Link
            to="/products?type=PERFUME"
            className="group p-6 rounded-2xl bg-white/80 border border-bronze/25 hover:border-bronze shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-bronze/10 text-bronze-dark flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-charcoal group-hover:text-burgundy transition-colors mb-2">
                Ready-Made Perfumes
              </h3>
              <p className="text-xs text-taupe-dark leading-relaxed">
                Masterpiece compositions matured in Grasse oak casks. Bottled at rich 25% Extrait concentration.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-taupe/15 flex items-center text-xs font-semibold text-bronze-dark uppercase tracking-wider gap-1">
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Discipline 3: Pure Artisanal Attars (Concentrated Oils) */}
          <Link
            to="/products?type=ATTAR"
            className="group p-6 rounded-2xl bg-gradient-to-b from-amber-50/50 to-white/90 border border-amber-500/30 hover:border-bronze shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-amber-600/10 text-amber-900 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <span className="text-xl">🪔</span>
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-900 bg-amber-500/15 px-2 py-0.5 rounded">
                  Alcohol-Free
                </span>
              </div>
              <h3 className="font-serif text-xl text-charcoal group-hover:text-burgundy transition-colors mb-2">
                Artisanal Pure Attars
              </h3>
              <p className="text-xs text-taupe-dark leading-relaxed">
                100% pure undiluted perfume oils hydro-distilled in copper degs. Bottled in hand-cut crystal tola flacons with glass dip wands.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-taupe/15 flex items-center text-xs font-semibold text-amber-900 uppercase tracking-wider gap-1">
              <span>View Attar Oils</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Discipline 4: Car Perfumes */}
          <Link
            to="/products?type=CAR_PERFUME"
            className="group p-6 rounded-2xl bg-white/80 border border-bronze/25 hover:border-bronze shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-walnut/10 text-walnut flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Wind className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-charcoal group-hover:text-burgundy transition-colors mb-2">
                Car Perfumes
              </h3>
              <p className="text-xs text-taupe-dark leading-relaxed">
                Solid carved American walnut diffusers with magnetic vent clips. Opulent scenting for your journeys.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-taupe/15 flex items-center text-xs font-semibold text-walnut uppercase tracking-wider gap-1">
              <span>Diffusers</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Discipline 5: Room Fresheners */}
          <Link
            to="/products?type=ROOM_FRESHENER"
            className="group p-6 rounded-2xl bg-white/80 border border-bronze/25 hover:border-bronze shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-taupe/20 text-charcoal flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Home className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-charcoal group-hover:text-burgundy transition-colors mb-2">
                Room Fresheners
              </h3>
              <p className="text-xs text-taupe-dark leading-relaxed">
                Palatial micro-mist diffusers and black rattan reed flacons designed to gracefully scent grand interiors.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-taupe/15 flex items-center text-xs font-semibold text-charcoal uppercase tracking-wider gap-1">
              <span>Room Mists</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. CURATED BY AURA & GENDER AFFINITY (MEN, WOMEN, UNISEX, & ATTARS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase tracking-widest text-bronze font-semibold">The Persona Portfolios</span>
          <h2 className="font-serif text-3xl sm:text-5xl text-charcoal">Curated by Aura &amp; Gender Affinity</h2>
          <p className="text-sm text-taupe-dark leading-relaxed">
            Whether seeking aristocratic masculine warmth, luminous feminine floral poetry, modern shared resonance, or concentrated pure oil attars.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Persona 1: Pour Homme (Men's Collection) */}
          <div className="relative rounded-3xl overflow-hidden bg-white/90 border border-bronze/30 shadow-luxury group flex flex-col justify-between p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-bold text-walnut bg-walnut/10 px-3 py-1 rounded-full border border-walnut/20">
                  Pour Homme
                </span>
                <span className="text-xs text-taupe-dark font-serif italic">For Him</span>
              </div>

              <h3 className="font-serif text-3xl text-charcoal group-hover:text-burgundy transition-colors">
                The Men's Collection
              </h3>

              <p className="text-xs sm:text-sm text-taupe-dark leading-relaxed font-light">
                Commanding, magnetic, and impeccably structured. Charred birch tar, Russian saddle leather, smoky Bourbon vetiver, and aristocratic Atlas cedarwood designed for silent authority.
              </p>

              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2.5 py-0.5 rounded-md bg-cream text-charcoal border border-taupe/20">Saddle Leather</span>
                <span className="px-2.5 py-0.5 rounded-md bg-cream text-charcoal border border-taupe/20">Smoked Birch</span>
                <span className="px-2.5 py-0.5 rounded-md bg-cream text-charcoal border border-taupe/20">Bourbon Vetiver</span>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-taupe/15">
              <Link
                to="/products?gender=MEN"
                className="w-full py-3 bg-walnut hover:bg-walnut-dark text-cream text-xs font-semibold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow transition-all"
              >
                <span>Explore Men's Flacons</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Persona 2: Pour Femme (Women's Collection) */}
          <div className="relative rounded-3xl overflow-hidden bg-white/90 border border-bronze/30 shadow-luxury group flex flex-col justify-between p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-bold text-burgundy bg-burgundy/10 px-3 py-1 rounded-full border border-burgundy/20">
                  Pour Femme
                </span>
                <span className="text-xs text-taupe-dark font-serif italic">For Her</span>
              </div>

              <h3 className="font-serif text-3xl text-charcoal group-hover:text-burgundy transition-colors">
                The Women's Collection
              </h3>

              <p className="text-xs sm:text-sm text-taupe-dark leading-relaxed font-light">
                Velvety, poetic, and alluring. Dawn-harvested Damascena rose blossoms, sunlit Tunisian neroli, chilled white porcelain tea leaves, Florentine orris butter, and Madagascar bourbon vanilla.
              </p>

              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2.5 py-0.5 rounded-md bg-cream text-charcoal border border-taupe/20">Damask Rose</span>
                <span className="px-2.5 py-0.5 rounded-md bg-cream text-charcoal border border-taupe/20">Neroli Blossom</span>
                <span className="px-2.5 py-0.5 rounded-md bg-cream text-charcoal border border-taupe/20">Bourbon Vanilla</span>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-taupe/15">
              <Link
                to="/products?gender=WOMEN"
                className="w-full py-3 bg-burgundy hover:bg-burgundy-dark text-cream text-xs font-semibold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow transition-all"
              >
                <span>Explore Women's Flacons</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Persona 3: Unisex & Shared Resonance */}
          <div className="relative rounded-3xl overflow-hidden bg-white/90 border border-bronze/30 shadow-luxury group flex flex-col justify-between p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-bold text-bronze-dark bg-bronze/10 px-3 py-1 rounded-full border border-bronze/30">
                  Gender-Neutral
                </span>
                <span className="text-xs text-taupe-dark font-serif italic">Shared Scent</span>
              </div>

              <h3 className="font-serif text-3xl text-charcoal group-hover:text-burgundy transition-colors">
                The Unisex Collection
              </h3>

              <p className="text-xs sm:text-sm text-taupe-dark leading-relaxed font-light">
                Elegance unconstrained by tradition. Pure Mysore sandalwood, aged Cambodian agarwood, wild cardamom, and sea salt minerals designed to seamlessly adapt to individual skin chemistry.
              </p>

              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2.5 py-0.5 rounded-md bg-cream text-charcoal border border-taupe/20">Cambodian Oud</span>
                <span className="px-2.5 py-0.5 rounded-md bg-cream text-charcoal border border-taupe/20">Mysore Sandalwood</span>
                <span className="px-2.5 py-0.5 rounded-md bg-cream text-charcoal border border-taupe/20">Warm Ambergris</span>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-taupe/15">
              <Link
                to="/products?gender=UNISEX"
                className="w-full py-3 bg-bronze hover:bg-bronze-dark text-charcoal font-semibold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 shadow transition-all"
              >
                <span>Explore Unisex Flacons</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SYNCHRONIZED 3D GLASS FRAGRANCE PYRAMID — DRIVEN BY ACTIVE FLACON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SynchronizedFragrancePyramid
          product={carousel.currentProduct}
          interactive={true}
        />
      </section>

      {/* 5. FEATURED MASTERPIECES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-bronze font-semibold">Curated Cellar</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-charcoal mt-1">Featured Creations</h2>
          </div>
          <Link
            to="/products"
            className="mt-4 md:mt-0 text-xs uppercase tracking-widest font-semibold text-burgundy hover:text-burgundy-dark flex items-center gap-1 group"
          >
            <span>View All Masterpieces</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-96 rounded-xl bg-cream-warm animate-pulse border border-taupe/20" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 6. INTERACTIVE NATURAL LANGUAGE QUIZ BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-burgundy text-cream p-8 sm:p-14 lg:p-16 shadow-2xl border border-bronze/40">
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-bronze-light font-semibold">
              Proprietary Discovery Engine
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-cream leading-tight">
              Unsure Where to Begin? Describe Your Mood, Not Perfume Jargon.
            </h2>
            <p className="text-sm sm:text-base text-cream-warm/90 leading-relaxed font-light">
              Answer 4 intuitive questions regarding your atmosphere, season, and desired projection. Our recommendation engine formulates your signature olfactory profile in seconds.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/quiz"
                className="px-8 py-4 bg-bronze hover:bg-bronze-light text-charcoal font-semibold uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all"
              >
                Launch Natural Scent Quiz
              </Link>
              <Link
                to="/discover"
                className="px-8 py-4 bg-transparent border border-cream/30 hover:border-cream text-cream font-semibold uppercase tracking-widest text-xs rounded-xl transition-all"
              >
                Learn About Scent Notes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
