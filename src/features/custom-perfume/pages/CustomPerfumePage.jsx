import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, ShoppingBag, Eye, Sliders, Shield, Info } from 'lucide-react';
import { useCart } from '../../cart/CartContext';
import { PRODUCT_TYPES } from '../../../patterns/factory/productFactory';

const AVAILABLE_BASE_NOTES = [
  { id: 'base_oud', name: 'Aged Cambodian Oud', descriptor: 'Nocturnal, animalic, smokey resin', priceWeight: 20 },
  { id: 'base_vanilla', name: 'Madagascar Bourbon Vanilla', descriptor: 'Rich, comforting, sweet woody warmth', priceWeight: 10 },
  { id: 'base_sandalwood', name: 'Australian Sandalwood', descriptor: 'Creamy, noble, velvety soft', priceWeight: 15 },
  { id: 'base_cedar', name: 'Atlas Cedarwood', descriptor: 'Dry aromatic wood shavings, aristocratic', priceWeight: 10 },
  { id: 'base_ambergris', name: 'Ambergris Accord', descriptor: 'Saline skin warmth, infinite fixative longevity', priceWeight: 25 },
];

const AVAILABLE_HEART_NOTES = [
  { id: 'heart_rose', name: 'Smoked Damask Rose', descriptor: 'Deep velvety petals kissed by incense embers' },
  { id: 'heart_amber', name: 'Warm Amber Tears', descriptor: 'Golden balsamic resin, honeyed and radiant' },
  { id: 'heart_orris', name: 'Florentine Orris Butter', descriptor: 'Powdered aristocratic iris, luxurious silk feel' },
  { id: 'heart_cacao', name: 'Raw Dark Cacao Pod', descriptor: 'Bitter roasted cocoa with a sensual gourmand edge' },
  { id: 'heart_tea', name: 'Silver Needle White Tea', descriptor: 'Subtle contemplative clarity and zen peace' },
];

const AVAILABLE_TOP_NOTES = [
  { id: 'top_cardamom', name: 'Wild Guatemalan Cardamom', descriptor: 'Cold spicy spark that opens the mind' },
  { id: 'top_bergamot', name: 'Calabrian Bergamot', descriptor: 'Luminous sparkling green citrus zest' },
  { id: 'top_neroli', name: 'Tunisian Neroli Blossom', descriptor: 'Sun-drenched honeyed floral vibrancy' },
  { id: 'top_pepper', name: 'Pink Peppercorn', descriptor: 'Effervescent rosy spice and gentle warmth' },
  { id: 'top_fig', name: 'Crushed Wild Fig Leaf', descriptor: 'Crisp botanical green sap and Mediterranean sunshine' },
];

export function CustomPerfumePage() {
  const [selectedBase, setSelectedBase] = useState([AVAILABLE_BASE_NOTES[0].name]);
  const [selectedHeart, setSelectedHeart] = useState([AVAILABLE_HEART_NOTES[0].name]);
  const [selectedTop, setSelectedTop] = useState([AVAILABLE_TOP_NOTES[0].name]);
  const [intensity, setIntensity] = useState(8);
  const [bottleColor, setBottleColor] = useState('amber');
  const [capColor, setCapColor] = useState('bronze');
  const [engravedLabel, setEngravedLabel] = useState('NOCTURNE I');
  const [formulaName, setFormulaName] = useState('Bespoke Private Blend');
  const { addItem } = useCart();

  const toggleSelection = (item, currentList, setList, max = 2) => {
    if (currentList.includes(item)) {
      if (currentList.length > 1) {
        setList(currentList.filter(n => n !== item));
      }
    } else {
      if (currentList.length < max) {
        setList([...currentList, item]);
      } else {
        setList([currentList[1], item]); // rotate
      }
    }
  };

  const basePrice = 240;
  const totalPrice = basePrice + (intensity > 7 ? 20 : 0);

  const handleAddToCart = () => {
    const customProduct = {
      id: `custom_${Date.now()}`,
      name: `${formulaName} (${engravedLabel.trim() || 'Signature'})`,
      slug: `custom-formula-${Date.now()}`,
      type: PRODUCT_TYPES.PERFUME,
      price: totalPrice,
      currency: 'USD',
      images: [
        bottleColor === 'amber'
          ? 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80'
      ],
      notes: {
        top: selectedTop,
        heart: selectedHeart,
        base: selectedBase,
      },
      attributes: {
        volume: '50ml / 1.7 fl.oz Extrait de Parfum',
        bottleType: `${bottleColor.toUpperCase()} Crystal with Hand-Turned ${capColor.toUpperCase()} Stopper`,
        sillage: 'Custom Calibrated (8-14 hours)',
      },
    };

    const customData = {
      formulaName,
      engravedLabel,
      bottleColor,
      capColor,
      intensity,
      notes: {
        top: selectedTop,
        heart: selectedHeart,
        base: selectedBase,
      },
    };

    addItem(customProduct, 1, customData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-xs uppercase tracking-widest text-bronze font-semibold">Haute Parfumerie Lab</span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal">The Bespoke Perfume Atelier</h1>
        <p className="text-xs sm:text-sm text-taupe-dark leading-relaxed">
          Formulate your one-of-a-kind olfactory masterpiece. Select pure fractions, choose crystal flacon finishes, and personalize the hand-engraved bronze crest.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Formulator Controls */}
        <div className="lg:col-span-7 space-y-10">
          {/* 1. Base Notes */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-bronze/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest font-semibold text-walnut">Step 1: The Foundation</span>
              <span className="text-[11px] text-taupe-dark">Select up to 2 Base Notes</span>
            </div>
            <h3 className="font-serif text-2xl text-charcoal mb-4">Base Notes &amp; Resins (Soul)</h3>
            <div className="space-y-2.5">
              {AVAILABLE_BASE_NOTES.map(note => {
                const isSelected = selectedBase.includes(note.name);
                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => toggleSelection(note.name, selectedBase, setSelectedBase, 2)}
                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-walnut bg-walnut/5 ring-1 ring-walnut shadow-sm'
                        : 'border-taupe/30 hover:border-bronze bg-cream-light/40'
                    }`}
                  >
                    <div>
                      <span className="font-serif font-semibold text-charcoal text-base block">{note.name}</span>
                      <span className="text-xs text-taupe-dark">{note.descriptor}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-walnut border-walnut text-white' : 'border-taupe/40'}`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Heart Notes */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-bronze/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest font-semibold text-burgundy">Step 2: The Heart</span>
              <span className="text-[11px] text-taupe-dark">Select up to 2 Heart Notes</span>
            </div>
            <h3 className="font-serif text-2xl text-charcoal mb-4">Heart Notes (Core Character)</h3>
            <div className="space-y-2.5">
              {AVAILABLE_HEART_NOTES.map(note => {
                const isSelected = selectedHeart.includes(note.name);
                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => toggleSelection(note.name, selectedHeart, setSelectedHeart, 2)}
                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-burgundy bg-burgundy/5 ring-1 ring-burgundy shadow-sm'
                        : 'border-taupe/30 hover:border-bronze bg-cream-light/40'
                    }`}
                  >
                    <div>
                      <span className="font-serif font-semibold text-charcoal text-base block">{note.name}</span>
                      <span className="text-xs text-taupe-dark">{note.descriptor}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-burgundy border-burgundy text-white' : 'border-taupe/40'}`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Top Notes */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-bronze/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest font-semibold text-bronze-dark">Step 3: The Greeting</span>
              <span className="text-[11px] text-taupe-dark">Select up to 2 Top Notes</span>
            </div>
            <h3 className="font-serif text-2xl text-charcoal mb-4">Top Notes (First Impression)</h3>
            <div className="space-y-2.5">
              {AVAILABLE_TOP_NOTES.map(note => {
                const isSelected = selectedTop.includes(note.name);
                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => toggleSelection(note.name, selectedTop, setSelectedTop, 2)}
                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-bronze bg-bronze/10 ring-1 ring-bronze shadow-sm'
                        : 'border-taupe/30 hover:border-bronze bg-cream-light/40'
                    }`}
                  >
                    <div>
                      <span className="font-serif font-semibold text-charcoal text-base block">{note.name}</span>
                      <span className="text-xs text-taupe-dark">{note.descriptor}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-bronze border-bronze text-white' : 'border-taupe/40'}`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Bottle Aesthetics & Engraving */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-bronze/30 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-bronze">Step 4: Atelier Flacon</span>
              <h3 className="font-serif text-2xl text-charcoal mt-1">Crystal &amp; Engraving Details</h3>
            </div>

            {/* Bottle Style */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-2">
                Crystal Flacon Hue
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'amber', label: 'Cognac Amber' },
                  { id: 'smoke', label: 'Smoked Obsidian' },
                  { id: 'clear', label: 'Pure Crystalline' },
                  { id: 'frosted', label: 'Frosted Opal' },
                ].map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBottleColor(b.id)}
                    className={`py-2 px-3 text-xs rounded-lg border font-medium transition-all ${
                      bottleColor === b.id
                        ? 'border-burgundy bg-burgundy/10 text-burgundy font-semibold'
                        : 'border-taupe/30 bg-white text-charcoal hover:border-bronze'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stopper Style */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-2">
                Stopper Finish
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'bronze', label: 'Hand-Turned Bronze' },
                  { id: 'walnut', label: 'American Walnut' },
                  { id: 'gold', label: 'Polished Brass' },
                ].map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCapColor(c.id)}
                    className={`py-2 px-3 text-xs rounded-lg border font-medium transition-all ${
                      capColor === c.id
                        ? 'border-bronze bg-bronze/10 text-bronze-dark font-semibold'
                        : 'border-taupe/30 bg-white text-charcoal hover:border-bronze'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Label Text */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1.5">
                Personalized Crest Engraving (Max 24 Characters)
              </label>
              <input
                type="text"
                maxLength={24}
                value={engravedLabel}
                onChange={(e) => setEngravedLabel(e.target.value.toUpperCase())}
                placeholder="E.G. NOCTURNE XVII"
                className="w-full px-4 py-2.5 rounded-lg border border-taupe/30 bg-white text-xs font-serif tracking-widest uppercase focus:ring-1 focus:ring-burgundy focus:border-burgundy"
              />
              <span className="text-[11px] text-taupe-dark mt-1 block">
                Etched via precision diamond tipped stylus into the flacon’s bronze cartouche.
              </span>
            </div>

            {/* Formula Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1.5">
                Formula Title in Lab Archive
              </label>
              <input
                type="text"
                value={formulaName}
                onChange={(e) => setFormulaName(e.target.value)}
                placeholder="Bespoke Private Blend"
                className="w-full px-4 py-2.5 rounded-lg border border-taupe/30 bg-white text-xs focus:ring-1 focus:ring-burgundy focus:border-burgundy"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Sticky Flacon & Cart Summary */}
        <div className="lg:col-span-5 sticky top-28 space-y-6">
          <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-bronze/35 p-6 sm:p-8 shadow-luxury text-center">
            <span className="text-[10px] uppercase tracking-widest text-bronze font-semibold block mb-1">
              Atelier Preview
            </span>
            <h3 className="font-serif text-2xl text-charcoal font-semibold">{formulaName}</h3>

            {/* Visual Flacon Rendering with Engraved Plate */}
            <div className="relative mx-auto my-6 w-60 aspect-[3/4] rounded-2xl bg-gradient-to-b from-cream via-cream-warm to-taupe-light/30 border border-bronze/40 p-4 shadow-inner flex flex-col items-center justify-between overflow-hidden">
              {/* Stopper Cap */}
              <div className="w-16 h-8 rounded-t-lg bg-gradient-to-r from-bronze-dark via-bronze-light to-bronze shadow-md flex items-center justify-center">
                <span className="text-[8px] font-bold uppercase tracking-widest text-charcoal">PJ</span>
              </div>

              {/* Glass Bottle Body */}
              <div className="w-44 h-52 rounded-xl bg-gradient-to-b from-burgundy/20 via-burgundy/10 to-amber-900/30 border border-bronze/30 shadow-2xl flex flex-col items-center justify-center p-3 relative">
                {/* Simulated Engraved Metal Cartouche */}
                <div className="w-36 py-3 px-2 rounded bg-gold-foil border border-bronze-dark shadow-md text-charcoal text-center space-y-0.5">
                  <span className="text-[7px] uppercase tracking-[0.2em] font-bold block text-charcoal-muted">PJ ESSENCE ATELIER</span>
                  <span className="font-serif text-[11px] font-bold tracking-widest text-charcoal block truncate">
                    {engravedLabel || 'NOCTURNE I'}
                  </span>
                  <span className="text-[6px] uppercase tracking-widest text-charcoal-muted block">GRASSE • FORMULE PRIVÉE</span>
                </div>
              </div>

              <span className="text-[10px] text-taupe-dark tracking-wider">50ml / 1.7 fl.oz • Extrait</span>
            </div>

            {/* Formula Accord Breakdown */}
            <div className="space-y-3 text-left text-xs border-t border-taupe/15 pt-4">
              <div className="flex justify-between">
                <span className="text-taupe-dark">Top Accord:</span>
                <span className="font-medium text-charcoal">{selectedTop.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-taupe-dark">Heart Accord:</span>
                <span className="font-medium text-charcoal">{selectedHeart.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-taupe-dark">Base Accord:</span>
                <span className="font-medium text-charcoal">{selectedBase.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-taupe-dark">Flacon Style:</span>
                <span className="font-medium text-charcoal capitalize">{bottleColor} Glass • {capColor} Cap</span>
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div className="pt-6 border-t border-taupe/20 mt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-taupe-dark">Atelier Formulation</span>
                <span className="font-serif text-3xl font-bold text-burgundy">₹{totalPrice}</span>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-4 bg-burgundy hover:bg-burgundy-dark text-cream font-semibold uppercase tracking-widest text-xs rounded-xl shadow-luxury-hover flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <ShoppingBag className="w-4 h-4 text-bronze-light" />
                Add Bespoke Creation to Vault
              </button>

              <span className="text-[11px] text-taupe-dark mt-3 block">
                Includes handwritten perfumer formulation certificate and complimentary white-glove delivery.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
