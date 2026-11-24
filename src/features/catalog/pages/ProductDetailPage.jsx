import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, ShieldCheck, Truck, RefreshCw, Heart, Sparkles, Check, ArrowRight, Eye } from 'lucide-react';
import { catalogService } from '../../../services/catalogService';
import { useCart } from '../../cart/CartContext';
import { FragrancePyramid } from '../../../components/shared/FragrancePyramid';
import { OlfactoryProfileMetrics } from '../../../components/shared/IntensityMeter';
import { ProductCard } from '../../../components/shared/ProductCard';

export function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const found = await catalogService.getProductBySlug(slug);
        setProduct(found);
        setSelectedImage(0);

        if (found) {
          const { products: all } = await catalogService.getProducts({ limit: 4 });
          setRelatedProducts(all.filter(p => p.id !== found.id).slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Sparkles className="w-8 h-8 text-bronze animate-pulse mx-auto mb-4" />
        <p className="font-serif text-2xl text-charcoal">Retrieving Master Formula Record...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl text-charcoal">Creation Not Found</h2>
        <p className="text-xs text-taupe-dark">The requested fragrance flacon may have completed its limited seasonal run.</p>
        <Link to="/products" className="inline-block px-6 py-2.5 bg-burgundy text-cream text-xs font-semibold uppercase tracking-widest rounded-lg">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Top Breadcrumb */}
      <div className="flex items-center text-xs text-taupe-dark gap-2">
        <Link to="/" className="hover:text-charcoal transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-charcoal transition-colors">Creations</Link>
        <span>/</span>
        <span className="text-burgundy font-medium truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-cream-warm border border-bronze/30 shadow-2xl">
            <img
              src={product.images?.[selectedImage] || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.seasonTags && product.seasonTags[0] && (
              <span className="absolute top-4 right-4 text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded bg-cream/90 text-charcoal border border-taupe/20 backdrop-blur-sm">
                {product.seasonTags[0]}
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images?.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-burgundy ring-2 ring-burgundy/20 scale-105' : 'border-taupe/30 hover:border-bronze opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Purchasing */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-taupe-dark mb-2">
              <span className="uppercase tracking-widest text-bronze font-semibold">
                {product.type.replace('_', ' ')}
              </span>
              <span>•</span>
              <div className="flex items-center text-bronze">
                <Star className="w-3.5 h-3.5 fill-bronze text-bronze" />
                <span className="ml-1 font-semibold text-charcoal">{product.rating}</span>
                <span className="ml-0.5">({product.reviewCount} master reviews)</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl text-charcoal font-normal leading-tight">
              {product.name}
            </h1>

            <p className="text-sm sm:text-base text-taupe-dark mt-2 font-serif italic">
              {product.tagline}
            </p>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-burgundy">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-taupe-dark line-through">
                  ₹{product.originalPrice}
                </span>
              )}
              <span className="text-xs text-taupe-dark uppercase tracking-wider">
                {product.currency} • Complimentary Global White-Glove Courier
              </span>
            </div>
          </div>

          <p className="text-sm text-charcoal-muted leading-relaxed font-light">
            {product.description}
          </p>

          {/* Olfactory Dimensional Metrics */}
          <div className="p-5 rounded-2xl bg-white/70 border border-bronze/25 shadow-sm space-y-3">
            <span className="text-xs uppercase tracking-widest text-bronze font-semibold block">
              Olfactory Dimensional Profile
            </span>
            <OlfactoryProfileMetrics
              intensity={product.intensity}
              warmth={product.warmth}
              freshness={product.freshness}
              sweetness={product.sweetness}
            />
          </div>

          {/* Specific Attributes */}
          <div className="grid grid-cols-2 gap-4 text-xs border-y border-taupe/20 py-4">
            <div>
              <span className="text-taupe-dark uppercase tracking-wider block">Flacon Format</span>
              <span className="font-medium text-charcoal mt-0.5 block">
                {product.attributes?.volume || product.attributes?.mountType || '50ml Crystal Flacon'}
              </span>
            </div>
            <div>
              <span className="text-taupe-dark uppercase tracking-wider block">Maceration Longevity</span>
              <span className="font-medium text-charcoal mt-0.5 block">
                {product.attributes?.sillage || product.attributes?.diffusionDuration || '8-12 Hours Projection'}
              </span>
            </div>
          </div>

          {/* Stock / Purchase Action */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {/* Quantity */}
              <div className="flex items-center border border-taupe/30 rounded-xl bg-white px-3 py-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 text-charcoal hover:text-burgundy font-bold text-sm"
                >
                  -
                </button>
                <span className="px-3 text-sm font-semibold text-charcoal">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 text-charcoal hover:text-burgundy font-bold text-sm"
                >
                  +
                </button>
              </div>

              {/* Add Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-burgundy hover:bg-burgundy-dark text-cream font-semibold uppercase tracking-widest text-xs rounded-xl shadow-luxury-hover flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 text-bronze-light" />
                    Added to Fragrance Vault
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-bronze-light" />
                    Acquire Flacon • ₹{product.price * quantity}
                  </>
                )}
              </button>
            </div>

            {/* Inventory Status */}
            <div className="flex items-center justify-between text-xs text-taupe-dark">
              <span className="flex items-center gap-1.5 text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                In Stock ({product.inventory} flacons remaining from current batch)
              </span>
              <span>Hand-sealed in Grasse, France</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fragrance Pyramid Section */}
      <section className="bg-white/80 rounded-3xl p-8 sm:p-12 border border-bronze/30 shadow-luxury">
        <FragrancePyramid notes={product.notes} interactive={true} />
      </section>

      {/* Paired Fragrances Cross-Sells */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-bronze font-semibold">Harmonic Pairings</span>
            <h3 className="font-serif text-3xl text-charcoal">Complete the Olfactory Suite</h3>
            <p className="text-xs text-taupe-dark mt-1">
              Curated car diffusers and room mists that share complementary botanical resins.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
