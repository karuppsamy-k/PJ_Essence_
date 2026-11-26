import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Heart, Anchor, Eye, Layers, Sparkles } from 'lucide-react';

export function FragrancePyramid({ 
  notes, 
  product,
  interactive = true, 
  className = '', 
  title = "The Classical Fragrance Pyramid" 
}) {
  const [activeTier, setActiveTier] = useState('heart');
  const [viewMode, setViewMode] = useState(product?.pyramidImage ? 'photorealistic' : 'schematic');

  // Dynamic notes resolution
  const topNotes = product?.notes?.top?.length > 0
    ? product.notes.top
    : notes?.top?.length > 0
    ? notes.top
    : ['Crushed Wild Fig Leaf', 'Bitter Orange'];

  const heartNotes = product?.notes?.middle?.length > 0
    ? product.notes.middle
    : product?.notes?.heart?.length > 0
    ? product.notes.heart
    : notes?.heart?.length > 0
    ? notes.heart
    : ['Ripe Fig Milk', 'Cyclamen Flower', 'Green Tea'];

  const baseNotes = product?.notes?.base?.length > 0
    ? product.notes.base
    : notes?.base?.length > 0
    ? notes.base
    : ['Dry Cedar Bark', 'Sheer Musk'];

  const pyramidImage = product?.pyramidImage || '/public/images/perfume-pyramid-3d.jpg';

  const tiers = [
    {
      id: 'top',
      title: 'Top notes:',
      label: 'Head Chamber Accord',
      notes: topNotes,
      duration: '15 – 30 min',
      evolution: 'Volatile First Impression',
    },
    {
      id: 'heart',
      title: 'Middle Notes:',
      label: 'Heart Chamber Accord',
      notes: heartNotes,
      duration: '2 – 4 hrs',
      evolution: 'Core Personality & Warmth',
    },
    {
      id: 'base',
      title: 'Base notes:',
      label: 'Base Foundation Accord',
      notes: baseNotes,
      duration: '6 – 24+ hrs',
      evolution: 'Fixative Sillage & Lasting Trail',
    },
  ];

  const selectedTier = tiers.find((t) => t.id === activeTier) || tiers[1];

  // Note pill
  const NotePill = ({ label }) => (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '5px 14px',
        borderRadius: '7px',
        fontSize: '13px',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontWeight: 500,
        color: '#E8D8C4',
        background: 'rgba(30, 20, 18, 0.75)',
        border: '1.5px solid #6B1E2B',
        backdropFilter: 'blur(4px)',
        letterSpacing: '0.01em',
        margin: '4px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );

  const ChamberLabel = ({ text }) => (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 18px',
        borderRadius: '6px',
        border: '1.5px solid #B68A4C',
        color: '#D4A843',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.18em',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        marginBottom: '10px',
        background: 'rgba(0,0,0,0.3)',
      }}
    >
      {text}
    </div>
  );

  const GoldSeparator = () => (
    <div
      style={{
        width: '100%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent 0%, #B68A4C 20%, #D4A843 50%, #B68A4C 80%, transparent 100%)',
        flexShrink: 0,
      }}
    />
  );

  return (
    <div
      id="fragrance-pyramid-section"
      className={`relative bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 lg:p-12 border border-bronze/35 shadow-luxury ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-taupe/20 pb-6 mb-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-bronze font-semibold block">
            Olfactory Architecture {product ? `· ${product.name}` : ''}
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal mt-0.5">
            {title}
          </h3>
        </div>

        {/* View Switcher if product image available */}
        <div className="flex items-center gap-2">
          {product?.pyramidImage && (
            <div className="inline-flex p-1 rounded-xl bg-cream-warm border border-bronze/25 text-xs font-medium">
              <button
                type="button"
                onClick={() => setViewMode('photorealistic')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'photorealistic'
                    ? 'bg-burgundy text-cream font-semibold shadow-sm'
                    : 'text-charcoal hover:text-burgundy'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-bronze-light" />
                <span>3D Glass Atelier View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('schematic')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'schematic'
                    ? 'bg-burgundy text-cream font-semibold shadow-sm'
                    : 'text-charcoal hover:text-burgundy'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-bronze-light" />
                <span>Chamber Breakdown</span>
              </button>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-4 text-xs text-taupe-dark">
            <span className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-bronze" /> Top · 15–30m</span>
            <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-burgundy" /> Heart · 2–4h</span>
            <span className="flex items-center gap-1.5"><Anchor className="w-3.5 h-3.5 text-walnut" /> Base · 6–24h</span>
          </div>
        </div>
      </div>

      {/* Main 2-column or centered pyramid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Callout notes */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8">
          {tiers.map((tier) => {
            const isSelected = activeTier === tier.id;

            return (
              <motion.div
                key={`${product?.id || 'static'}-${tier.id}`}
                whileHover={interactive ? { x: 3 } : {}}
                onClick={() => interactive && setActiveTier(tier.id)}
                className={`cursor-pointer transition-all duration-300 rounded-2xl p-5 border ${
                  isSelected
                    ? 'bg-cream-warm/80 border-bronze shadow-md ring-1 ring-bronze/40'
                    : 'bg-white/60 border-taupe/20 hover:border-bronze/40 hover:bg-cream-light'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-serif text-2xl font-medium text-bronze-dark tracking-wide whitespace-nowrap">
                    {tier.title}
                  </span>
                  <div className="h-[1.5px] flex-grow bg-gradient-to-r from-bronze-dark via-bronze to-bronze-light/60 rounded-full" />
                  <span className="text-[11px] font-semibold text-taupe-dark tracking-wider uppercase bg-cream px-2 py-0.5 rounded border border-taupe/20">
                    {tier.duration}
                  </span>
                </div>

                <p className="font-serif text-lg sm:text-xl text-charcoal leading-relaxed font-normal tracking-wide pl-0.5">
                  {tier.notes.join(', ')}
                </p>

                <div className="mt-2.5 pt-2 border-t border-taupe/15 flex items-center justify-between text-xs text-taupe-dark">
                  <span className="italic font-serif">{tier.evolution}</span>
                  {isSelected && (
                    <span className="text-burgundy font-semibold flex items-center gap-1 text-[11px]">
                      <Sparkles className="w-3 h-3 text-bronze animate-pulse" />
                      Inspecting Chamber
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Column: Visual Pyramid */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          {viewMode === 'photorealistic' && product?.pyramidImage ? (
            <div className="relative w-full max-w-lg aspect-square rounded-3xl overflow-hidden border border-bronze/35 bg-charcoal shadow-2xl p-2 group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={product.pyramidImage}
                  src={product.pyramidImage}
                  alt={`${product.name} 3D Glass Fragrance Pyramid`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-contain rounded-2xl drop-shadow-2xl"
                />
              </AnimatePresence>

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-bronze/35 shadow-luxury">
                <div className="flex items-center justify-between text-xs text-taupe-dark mb-1">
                  <span className="uppercase tracking-widest text-bronze font-semibold">
                    {selectedTier.label}
                  </span>
                  <span className="font-semibold text-charcoal">{selectedTier.duration}</span>
                </div>
                <h4 className="font-serif text-lg font-semibold text-charcoal">
                  {selectedTier.notes.join(', ')}
                </h4>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-lg" style={{ position: 'relative' }}>
              <div
                style={{
                  width: '100%',
                  position: 'relative',
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <motion.div
                    onClick={() => setActiveTier('top')}
                    style={{
                      width: '100%',
                      minHeight: 180,
                      background: activeTier === 'top'
                        ? 'linear-gradient(180deg, #2E221B 0%, #1E1410 100%)'
                        : 'linear-gradient(180deg, #281D17 0%, #1A1210 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      padding: '20px 10% 24px',
                      cursor: 'pointer',
                      transition: 'background 0.3s',
                    }}
                  >
                    <ChamberLabel text="TOP CHAMBER" />
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {topNotes.map((n, i) => <NotePill key={i} label={n} />)}
                    </div>
                  </motion.div>

                  <GoldSeparator />

                  <motion.div
                    onClick={() => setActiveTier('heart')}
                    style={{
                      width: '100%',
                      minHeight: 180,
                      background: activeTier === 'heart'
                        ? 'linear-gradient(180deg, #291E18 0%, #1B130F 100%)'
                        : 'linear-gradient(180deg, #221910 0%, #17110C 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '20px 6% 24px',
                      cursor: 'pointer',
                      transition: 'background 0.3s',
                    }}
                  >
                    <ChamberLabel text="MIDDLE CHAMBER" />
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {heartNotes.map((n, i) => <NotePill key={i} label={n} />)}
                    </div>
                  </motion.div>

                  <GoldSeparator />

                  <motion.div
                    onClick={() => setActiveTier('base')}
                    style={{
                      width: '100%',
                      minHeight: 180,
                      background: activeTier === 'base'
                        ? 'linear-gradient(180deg, #221812 0%, #16100A 100%)'
                        : 'linear-gradient(180deg, #1C1409 0%, #120E07 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '20px 2% 24px',
                      cursor: 'pointer',
                      transition: 'background 0.3s',
                    }}
                  >
                    <ChamberLabel text="BASE FOUNDATION CHAMBER" />
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {baseNotes.map((n, i) => <NotePill key={i} label={n} />)}
                    </div>
                  </motion.div>
                </div>
              </div>

              <div
                style={{
                  width: '100%',
                  height: 44,
                  background: 'linear-gradient(90deg, #8A6520 0%, #C9A84C 25%, #E8C97A 50%, #C9A84C 75%, #8A6520 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '0 0 8px 8px',
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.3em',
                    color: '#1E1410',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                  }}
                >
                  GILDED MIRROR PLINTH
                </span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Sensory timeline footer */}
      <div className="mt-8 pt-6 border-t border-taupe/20 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-taupe-dark">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-amber-800 font-bold uppercase tracking-wider">
            <Sun className="w-3.5 h-3.5 text-bronze" />
            <span>Top Accord (Head Phase)</span>
          </div>
          <p className="leading-relaxed">
            Initial 15–30 minutes. Volatile first impressions that awaken the senses before yielding to the heart.
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-burgundy font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5" />
            <span>Middle Accord (Heart Phase)</span>
          </div>
          <p className="leading-relaxed">
            2 to 4 hours. The opulent core body defining the signature contour of the fragrance.
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-walnut font-bold uppercase tracking-wider">
            <Anchor className="w-3.5 h-3.5 text-walnut" />
            <span>Base Accord (Soul Phase)</span>
          </div>
          <p className="leading-relaxed">
            6 to 24+ hours. Deep resonant woods, balsams, and fixatives anchoring the lasting sillage trail.
          </p>
        </div>
      </div>
    </div>
  );
}
