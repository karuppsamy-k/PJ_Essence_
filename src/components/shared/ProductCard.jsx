import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Sparkles, Wind, Home, Droplets } from 'lucide-react';
import { useCart } from '../../features/cart/CartContext';
import { PRODUCT_TYPES } from '../../patterns/factory/productFactory';

export function ProductCard({ product, showQuickAdd = true }) {
  const { addItem } = useCart();

  const typeConfig = {
    [PRODUCT_TYPES.PERFUME]: {
      label: 'Haute Parfumerie',
      icon: Sparkles,
      badgeClass: 'bg-burgundy/10 text-burgundy border-burgundy/20',
    },
    [PRODUCT_TYPES.ATTAR]: {
      label: 'Artisanal Pure Attar',
      icon: Droplets,
      badgeClass: 'bg-amber-600/10 text-amber-900 border-amber-600/30',
    },
    [PRODUCT_TYPES.CAR_PERFUME]: {
      label: 'Car Diffuser',
      icon: Wind,
      badgeClass: 'bg-walnut/10 text-walnut border-walnut/20',
    },
    [PRODUCT_TYPES.ROOM_FRESHENER]: {
      label: 'Palatial Room Mist',
      icon: Home,
      badgeClass: 'bg-bronze/10 text-bronze-dark border-bronze/30',
    },
  };

  const currentType = typeConfig[product.type] || typeConfig[PRODUCT_TYPES.PERFUME];
  const TypeIcon = currentType.icon;

  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80';

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const genderLabel = product.gender === 'MEN' 
    ? 'Pour Homme' 
    : product.gender === 'WOMEN' 
    ? 'Pour Femme' 
    : 'Unisex';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white/80 backdrop-blur-sm rounded-xl border border-bronze/20 overflow-hidden shadow-sm hover:shadow-luxury hover:border-bronze/40 transition-all flex flex-col h-full"
    >
      <Link to={`/products/${product.slug}`} className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-[4/5] bg-cream-warm overflow-hidden">
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Type Badge */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border backdrop-blur-md ${currentType.badgeClass}`}>
              <TypeIcon className="w-3 h-3" />
              {currentType.label}
            </span>
          </div>

          {/* Gender & Season Badges */}
          <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1">
            {product.gender && (
              <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-charcoal/80 text-cream backdrop-blur-sm">
                {genderLabel}
              </span>
            )}
            {product.seasonTags && product.seasonTags[0] && (
              <span className="text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded bg-cream/90 text-charcoal backdrop-blur-sm border border-taupe/20">
                {product.seasonTags[0]}
              </span>
            )}
          </div>

          {/* Hover Overlay with Quick Add Action */}
          {showQuickAdd && (
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <button
                type="button"
                onClick={handleQuickAdd}
                className="w-full py-2.5 px-4 bg-burgundy hover:bg-burgundy-dark text-cream-light text-xs font-semibold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Add to Cart • ₹{product.price}
              </button>
            </div>
          )}
        </div>

        {/* Product Meta */}
        <div className="p-5 flex flex-col flex-grow justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-taupe-dark mb-1.5">
              <div className="flex items-center text-bronze">
                <Star className="w-3 h-3 fill-bronze text-bronze" />
              </div>
              <span className="font-semibold text-charcoal">{product.rating || '4.9'}</span>
              <span>({product.reviewCount || 24})</span>
              <span className="text-taupe">•</span>
              <span className="text-[11px] text-bronze uppercase tracking-wider">{product.fragranceFamilies?.[0] || 'Oriental'}</span>
            </div>

            <h3 className="font-serif text-lg font-semibold text-charcoal group-hover:text-burgundy transition-colors line-clamp-1">
              {product.name}
            </h3>

            <p className="text-xs text-taupe-dark line-clamp-2 mt-1 leading-relaxed">
              {product.tagline || product.description}
            </p>
          </div>

          <div className="pt-4 border-t border-taupe/15 mt-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-taupe-dark block">Format</span>
              <span className="text-xs font-medium text-charcoal">
                {product.attributes?.volume || product.attributes?.mountType || '50ml Parfum'}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-taupe-dark block">Investment</span>
              <span className="font-serif text-lg font-bold text-burgundy">
                ₹{product.price}
                <span className="text-xs font-normal text-taupe-dark ml-0.5">{product.currency}</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
