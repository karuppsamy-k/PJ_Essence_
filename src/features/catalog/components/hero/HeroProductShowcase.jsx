import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Sparkles, 
  Droplets, 
  ArrowRight, 
  ShoppingBag, 
  Check, 
  Clock, 
  Wind,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../../../cart/CartContext';

export function HeroProductShowcase({
  carousel,
  onScrollToPyramid,
}) {
  const {
    currentProduct,
    currentIndex,
    total,
    direction,
    progress,
    isPaused,
    goToIndex,
    nextProduct,
    prevProduct,
    pause,
    resume,
    handleTouchStart,
    handleTouchEnd,
  } = carousel;

  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  const handleQuickAdd = () => {
    if (!currentProduct) return;
    addToCart({
      id: `prod_${currentProduct.id}`,
      name: currentProduct.name,
      price: currentProduct.price,
      currency: 'INR',
      image: currentProduct.image,
      volume: '100ml',
      concentration: currentProduct.concentration,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  // Luxury transition variants
  const bottleVariants = {
    initial: (dir) => ({
      opacity: 0,
      scale: 0.95,
      y: dir > 0 ? 15 : -15,
      filter: 'blur(6px)',
    }),
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (dir) => ({
      opacity: 0,
      scale: 0.97,
      y: dir > 0 ? -15 : 15,
      filter: 'blur(4px)',
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  };

  const textVariants = {
    initial: {
      opacity: 0,
      y: 12,
      filter: 'blur(3px)',
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.65,
        delay: 0.1,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -8,
      filter: 'blur(2px)',
      transition: {
        duration: 0.4,
      },
    },
  };

  if (!currentProduct) return null;

  return (
    <div
      className="relative w-full lg:h-[calc(100vh-5.5rem)] lg:max-h-[820px] min-h-[580px] flex flex-col justify-center overflow-hidden bg-gradient-to-b from-cream via-cream-warm/70 to-cream select-none py-4 sm:py-6"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="PJ Essence Featured Perfumes Showcase"
      aria-roledescription="carousel"
    >
      {/* Background ambient lighting halo matched to current product accent */}
      <motion.div
        key={`halo-${currentProduct.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.18 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.0 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${currentProduct.accentColor} 0%, rgba(182, 138, 76, 0.2) 50%, transparent 80%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col justify-between h-full py-1">
        
        {/* Top Campaign Bar: Sequential Counter & Atelier Tabs */}
        <div className="flex items-center justify-between gap-3 mb-2 sm:mb-4 border-b border-taupe/15 pb-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/85 border border-bronze/35 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: currentProduct.accentColor }} />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold text-charcoal">
              Haute Atelier Sequence · {currentProduct.number} of 0{total}
            </span>
          </div>

          {/* Quick Tab Switcher for all 8 perfumes */}
          <div className="hidden md:flex items-center gap-1 bg-white/70 p-1 rounded-xl border border-bronze/20 backdrop-blur-sm shadow-inner-soft">
            {carousel.products?.map((p, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => goToIndex(idx)}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-serif transition-all duration-300 relative ${
                    isActive
                      ? 'bg-burgundy text-cream font-semibold shadow-sm'
                      : 'text-charcoal-muted hover:text-charcoal hover:bg-white/80'
                  }`}
                  aria-label={`View ${p.name}`}
                  aria-selected={isActive}
                >
                  <span>{p.name}</span>
                  {isActive && !isPaused && (
                    <motion.div
                      className="absolute bottom-0 left-1 right-1 h-[2px] bg-bronze-light rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 2-Column Hero: Perfectly Balanced to Fit in 1 View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center flex-grow">
          
          {/* LEFT COLUMN: Editorial Presentation & Identity */}
          <div className="lg:col-span-6 space-y-3.5 sm:space-y-4 text-center lg:text-left order-2 lg:order-1">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentProduct.id}
                custom={direction}
                variants={textVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-2.5 sm:space-y-3"
              >
                {/* French Collection Subtitle & Gender Badges */}
                <div className="flex items-center justify-center lg:justify-start gap-2.5">
                  <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-bronze-dark">
                    {currentProduct.title}
                  </span>
                  <span className="h-3 w-[1px] bg-taupe/40" />
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-cream-warm border border-bronze/30 text-charcoal">
                    {currentProduct.gender}
                  </span>
                  <span className="text-[10px] font-semibold text-burgundy bg-burgundy/10 px-2 py-0.5 rounded border border-burgundy/20">
                    {currentProduct.concentration}
                  </span>
                </div>

                {/* Primary Editorial Title */}
                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-charcoal leading-[1.0] tracking-tight">
                  {currentProduct.name}
                </h1>

                {/* Iconic Campaign Tagline */}
                <p className="font-serif italic text-lg sm:text-xl text-burgundy font-medium tracking-wide">
                  "{currentProduct.tagline}"
                </p>

                {/* Narrative Description (Compact, Editorial) */}
                <p className="text-xs sm:text-sm text-charcoal-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-light line-clamp-3">
                  {currentProduct.description}
                </p>

                {/* Olfactory Summary Pill Row */}
                <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-1.5 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-charcoal font-medium border border-bronze/30 shadow-sm flex items-center gap-1.5 text-[11px]">
                    <Droplets className="w-3 h-3 text-bronze" />
                    <span>Top: {currentProduct.notes.top.slice(0, 2).join(', ')}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-charcoal font-medium border border-bronze/30 shadow-sm flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="w-3 h-3 text-burgundy" />
                    <span>Heart: {currentProduct.notes.middle[0]}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-charcoal font-medium border border-bronze/30 shadow-sm flex items-center gap-1.5 text-[11px]">
                    <Wind className="w-3 h-3 text-walnut" />
                    <span>Base: {currentProduct.notes.base.slice(0, 2).join(', ')}</span>
                  </span>
                </div>

                {/* Price & Primary Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                  <button
                    type="button"
                    onClick={handleQuickAdd}
                    className="w-full sm:w-auto px-6 py-3 bg-burgundy hover:bg-burgundy-dark text-cream font-semibold uppercase tracking-widest text-[11px] rounded-xl shadow-luxury-hover flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 group"
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-bronze-light group-hover:scale-110 transition-transform" />
                        <span>Acquire Flacon • ₹{currentProduct.price}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onScrollToPyramid}
                    className="w-full sm:w-auto px-6 py-3 bg-white/90 hover:bg-white text-charcoal border border-bronze/40 hover:border-bronze font-semibold uppercase tracking-widest text-[11px] rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>View Note Pyramid</span>
                    <ArrowRight className="w-3.5 h-3.5 text-bronze" />
                  </button>
                </div>

                {/* Reassurance Footer */}
                <div className="pt-1 flex items-center justify-center lg:justify-start gap-5 text-[11px] text-taupe-dark">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{currentProduct.volume}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-bronze" />
                    <span>{currentProduct.tester}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-burgundy" />
                    <span>{currentProduct.traits[0]}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: Flacon Presentation Scaled to Fully Fit in View */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center order-1 lg:order-2 h-full">
            
            {/* Constrained container preventing any vertical overflow */}
            <div className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[430px] max-h-[460px] sm:max-h-[500px] lg:max-h-[530px] aspect-[3/4] flex items-center justify-center">
              
              {/* Outer Luxury Plinth Shadow */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-6 bg-charcoal/20 blur-lg rounded-full pointer-events-none" />

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentProduct.id}
                  custom={direction}
                  variants={bottleVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border border-bronze/35 bg-gradient-to-b from-white/90 via-cream-warm/60 to-cream shadow-xl p-2.5 sm:p-3 group flex flex-col"
                >
                  {/* Flacon Campaign Portrait Artwork */}
                  <img
                    src={currentProduct.image}
                    alt={`${currentProduct.name} — PJ Essence Luxury Extrait de Parfum`}
                    className="w-full h-full object-cover rounded-xl sm:rounded-2xl shadow-inner transition-transform duration-700 group-hover:scale-[1.02]"
                    loading="eager"
                  />

                  {/* Floating Gold Label Cartouche Plaque */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/90 backdrop-blur-md border border-bronze/40 shadow-luxury flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentProduct.accentColor }} />
                        <span className="text-[9px] uppercase tracking-widest text-bronze font-bold">
                          {currentProduct.motto}
                        </span>
                      </div>
                      <h3 className="font-serif text-base font-bold text-charcoal">
                        {currentProduct.name} • {currentProduct.concentration}
                      </h3>
                    </div>

                    <span className="font-serif text-base font-bold text-burgundy">
                      ₹{currentProduct.price}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows positioned on bottle sides */}
              <button
                type="button"
                onClick={prevProduct}
                className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-charcoal border border-bronze/40 hover:border-bronze shadow-luxury flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 z-20 group"
                aria-label="Previous perfume"
              >
                <ChevronLeft className="w-4 h-4 text-bronze-dark group-hover:text-burgundy transition-colors" />
              </button>

              <button
                type="button"
                onClick={nextProduct}
                className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-charcoal border border-bronze/40 hover:border-bronze shadow-luxury flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 z-20 group"
                aria-label="Next perfume"
              >
                <ChevronRight className="w-4 h-4 text-bronze-dark group-hover:text-burgundy transition-colors" />
              </button>
            </div>

            {/* Bottom Progress Bar & Pause / Play Controller */}
            <div className="mt-3 sm:mt-4 w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[430px] flex items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-charcoal">
                <span className="text-burgundy">{currentProduct.number}</span>
                <span className="text-taupe">/</span>
                <span className="text-taupe-dark">0{total}</span>
              </div>

              {/* Continuous Luxury Progress Track */}
              <div className="flex-grow h-1 bg-taupe/20 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-bronze via-burgundy to-bronze-light rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Pause / Play Toggle */}
              <button
                type="button"
                onClick={() => (isPaused ? resume() : pause())}
                className="p-1 rounded-lg text-charcoal-muted hover:text-burgundy hover:bg-white/80 transition-colors"
                aria-label={isPaused ? 'Resume auto-play sequence' : 'Pause auto-play sequence'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
