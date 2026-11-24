import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Heart, Anchor } from 'lucide-react';

export function FragrancePyramid({ notes, interactive = true, className = '', title = "The Classical Fragrance Pyramid" }) {
  const [activeTier, setActiveTier] = useState(null);

  // Dynamic notes with authentic fallback defaults
  const topNotes = notes?.top?.length > 0
    ? notes.top
    : ['Crushed Wild Fig Leaf', 'Bitter Orange'];

  const heartNotes = notes?.heart?.length > 0
    ? notes.heart
    : ['Ripe Fig Milk', 'Cyclamen Flower', 'Green Tea'];

  const baseNotes = notes?.base?.length > 0
    ? notes.base
    : ['Dry Cedar Bark', 'Sheer Musk'];

  // ─── Tier data ────────────────────────────────────────────────────────────
  const tiers = [
    {
      id: 'top',
      chamber: 'TOP CHAMBER',
      notes: topNotes,
      duration: '15 – 30 min',
      desc: 'Volatile First Impression',
      // pyramid clip: narrow at top
      clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
      widthClass: 'w-full',
      minH: 180,
      labelColor: '#B68A4C',   // bronze
      borderColor: '#B68A4C',
    },
    {
      id: 'heart',
      chamber: 'MIDDLE CHAMBER',
      notes: heartNotes,
      duration: '2 – 4 hrs',
      desc: 'Core Personality & Warmth',
      clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)',
      widthClass: 'w-full',
      minH: 180,
      labelColor: '#B68A4C',
      borderColor: '#B68A4C',
    },
    {
      id: 'base',
      chamber: 'BASE FOUNDATION CHAMBER',
      notes: baseNotes,
      duration: '6 – 24+ hrs',
      desc: 'Fixative Sillage & Lasting Trail',
      clipPath: 'polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%)',
      widthClass: 'w-full',
      minH: 180,
      labelColor: '#B68A4C',
      borderColor: '#B68A4C',
    },
  ];

  // ─── Shared note pill style ────────────────────────────────────────────────
  // Matches image 2: dark charcoal bg, burgundy/wine border, light text
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
        background: 'rgba(30, 20, 18, 0.72)',
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

  // ─── Chamber label box (gold border, gold text) ────────────────────────────
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
        marginBottom: '12px',
        background: 'rgba(0,0,0,0.25)',
      }}
    >
      {text}
    </div>
  );

  // ─── Gold separator line ───────────────────────────────────────────────────
  const GoldSeparator = () => (
    <div style={{
      width: '100%',
      height: '2px',
      background: 'linear-gradient(90deg, transparent 0%, #B68A4C 20%, #D4A843 50%, #B68A4C 80%, transparent 100%)',
      flexShrink: 0,
    }} />
  );

  // The pyramid is built as three stacked trapezoid divs inside a full-width container.
  // The whole assembly is clipped to a triangle via an outer wrapper.
  // We use a flex column; each tier has its own trapezoid clip.

  return (
    <div className={`relative bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 lg:p-12 border border-bronze/30 shadow-luxury ${className}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-taupe/20 pb-6 mb-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-bronze font-semibold block">
            Olfactory Architecture
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal mt-0.5">
            {title}
          </h3>
        </div>
        {/* Duration legend */}
        <div className="flex items-center gap-4 text-xs text-taupe-dark">
          <span className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-bronze" /> Top · 15–30 min</span>
          <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-burgundy" /> Heart · 2–4 hrs</span>
          <span className="flex items-center gap-1.5"><Anchor className="w-3.5 h-3.5 text-walnut" /> Base · 6–24+ hrs</span>
        </div>
      </div>

      {/* ── THE PYRAMID ─────────────────────────────────────────────────────── */}
      {/*
        Strategy: Each tier is a full-width rectangle. We use CSS clip-path on
        each to carve a trapezoid. Stacked top-to-bottom they form a triangle.
        No outer clip needed – the math lines up naturally.
        
        Top tier clip:    polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)
        Middle tier clip: polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)  ← wider top edge
        Base tier clip:   polygon(2%  0%, 98% 0%, 100% 100%, 0% 100%)  ← widest

        Wait – for a true triangle stacked, the bottom-left and bottom-right of
        tier N must match the top-left and top-right of tier N+1. 

        Top tier (height H1):
          top-left=30%, top-right=70%, bot-left=0%, bot-right=100%
        Middle tier starts at 100% width, so top edge must be 0%–100%:
          top-left=0%, top-right=100%, bot-left=0%, bot-right=100% → rectangle
          
        That doesn't form a pyramid visually. Better approach: use a *single*
        large container clipped to triangle, divided into 3 bands by absolute
        positioned rows, separated by gold lines.
      */}
      <div
        className="mx-auto"
        style={{ maxWidth: 520, position: 'relative' }}
      >
        {/* Outer pyramid shape - single triangle clip */}
        <div
          style={{
            width: '100%',
            position: 'relative',
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
            // We need enough height; tiers are % of this
          }}
        >
          {/* Inner container that fills the triangle – flex column */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            {/* ── TOP CHAMBER ── */}
            <motion.div
              whileHover={interactive ? { brightness: 1.05 } : {}}
              onClick={() => interactive && setActiveTier(a => a === 'top' ? null : 'top')}
              style={{
                width: '100%',
                minHeight: 180,
                background: activeTier === 'top'
                  ? 'linear-gradient(180deg, #2A1F1A 0%, #1E1410 100%)'
                  : 'linear-gradient(180deg, #2C2018 0%, #1A1210 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '20px 10% 24px',
                cursor: interactive ? 'pointer' : 'default',
                transition: 'background 0.3s',
              }}
            >
              <ChamberLabel text="TOP CHAMBER" />
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {topNotes.map((n, i) => <NotePill key={i} label={n} />)}
              </div>
            </motion.div>

            {/* Gold separator 1 */}
            <GoldSeparator />

            {/* ── MIDDLE CHAMBER ── */}
            <motion.div
              onClick={() => interactive && setActiveTier(a => a === 'heart' ? null : 'heart')}
              style={{
                width: '100%',
                minHeight: 180,
                background: activeTier === 'heart'
                  ? 'linear-gradient(180deg, #251B16 0%, #1A120E 100%)'
                  : 'linear-gradient(180deg, #221910 0%, #17110C 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 6% 24px',
                cursor: interactive ? 'pointer' : 'default',
                transition: 'background 0.3s',
              }}
            >
              <ChamberLabel text="MIDDLE CHAMBER" />
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {heartNotes.map((n, i) => <NotePill key={i} label={n} />)}
              </div>
            </motion.div>

            {/* Gold separator 2 */}
            <GoldSeparator />

            {/* ── BASE FOUNDATION CHAMBER ── */}
            <motion.div
              onClick={() => interactive && setActiveTier(a => a === 'base' ? null : 'base')}
              style={{
                width: '100%',
                minHeight: 180,
                background: activeTier === 'base'
                  ? 'linear-gradient(180deg, #1E1510 0%, #150F09 100%)'
                  : 'linear-gradient(180deg, #1C1409 0%, #120E07 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 2% 24px',
                cursor: interactive ? 'pointer' : 'default',
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

        {/* ── GILDED MIRROR PLINTH ── */}
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

      {/* ── BOTTOM SENSORY TIMELINE ─────────────────────────────────────────── */}
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
