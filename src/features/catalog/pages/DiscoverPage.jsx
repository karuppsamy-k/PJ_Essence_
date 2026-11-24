import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Sparkles, Droplets, BookOpen, Clock, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { FragrancePyramid } from '../../../components/shared/FragrancePyramid';

export function DiscoverPage() {
  const masterNotes = {
    top: ['Tunisian Neroli', 'Calabrian Bergamot', 'Guatemalan Cardamom', 'Pink Peppercorn'],
    heart: ['Damask Rose', 'Smoked Amber', 'Florentine Orris', 'White Tea Leaves', 'Dark Cacao'],
    base: ['Cambodian Agarwood (Oud)', 'Bourbon Vanilla', 'Australian Sandalwood', 'Atlas Cedar'],
  };

  const fragranceFamilies = [
    {
      name: 'Woody (Les Boisés)',
      subtitle: 'Aristocratic & Grounded',
      description: 'Sandalwood, cedarwood, agarwood, vetiver, and cypress. Conveys quiet authority, warmth, and enduring calm.',
      signatureNotes: ['Mysore Sandalwood', 'Atlas Cedar', 'Aged Oud'],
      idealSeason: 'Autumn & Winter',
    },
    {
      name: 'Oriental (Les Orientaux)',
      subtitle: 'Sensual, Opulent & Mysterious',
      description: 'Smoked amber resins, warm spices, balsam, and Madagascar vanilla. Unapologetic, magnetic nocturnal presence.',
      signatureNotes: ['Smoked Amber', 'Incense Tears', 'Bourbon Vanilla'],
      idealSeason: 'Winter & Cool Evenings',
    },
    {
      name: 'Fresh & Hesperidic (Les Hespéridés)',
      subtitle: 'Luminous, Uplifting & Vital',
      description: 'Sun-drenched neroli, bergamot zest, sea spray, and green fig leaves. Invigorating and effortlessly clean.',
      signatureNotes: ['Tunisian Neroli', 'Calabrian Bergamot', 'Sea Salt'],
      idealSeason: 'Spring & Summer',
    },
    {
      name: 'Floral (Les Floraux)',
      subtitle: 'Intimate, Poetic & Velvety',
      description: 'Midnight damask rose, white freesia, and powdery orris root. Ethereal romance without cloying sweetness.',
      signatureNotes: ['Turkish Damask Rose', 'Florentine Orris', 'Cyclamen'],
      idealSeason: 'Spring & All-Season',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-bronze font-semibold">The PJ Essence Codex</span>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-charcoal">The Art of Olfactory Harmony</h1>
        <p className="text-sm sm:text-base text-taupe-dark leading-relaxed font-light">
          Perfume is invisible architecture. It evokes memory faster than sight or sound. Here is how our master distillers compose every bottle.
        </p>
      </div>

      {/* Fragrance Pyramid Section */}
      <section className="bg-white/80 rounded-3xl p-8 sm:p-12 border border-bronze/30 shadow-luxury">
        <FragrancePyramid notes={masterNotes} interactive={true} />
      </section>

      {/* Fragrance Families Guide */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-bronze font-semibold">Classification</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal">The Primary Fragrance Families</h2>
          <p className="text-xs sm:text-sm text-taupe-dark">
            Discover the personality contours that harmonize with your character.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {fragranceFamilies.map((fam, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-white/70 border border-bronze/25 hover:border-bronze shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-xs uppercase tracking-wider text-bronze font-semibold block mb-1">
                  {fam.subtitle}
                </span>
                <h3 className="font-serif text-2xl text-charcoal mb-3">{fam.name}</h3>
                <p className="text-xs text-taupe-dark leading-relaxed mb-6">{fam.description}</p>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-taupe-dark font-medium">Signature Accords:</span>
                    <span className="text-charcoal font-semibold">{fam.signatureNotes.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-taupe-dark font-medium">Optimal Resonance:</span>
                    <span className="text-burgundy font-semibold">{fam.idealSeason}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-taupe/15">
                <Link
                  to={`/products?search=${encodeURIComponent(fam.name.split(' ')[0])}`}
                  className="text-xs font-semibold uppercase tracking-wider text-burgundy hover:text-burgundy-dark flex items-center gap-1 group"
                >
                  <span>Explore {fam.name.split(' ')[0]} Creations</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Natural Language Translator */}
      <section className="bg-gradient-to-r from-cream via-cream-warm to-cream rounded-3xl p-8 sm:p-12 border border-bronze/35 shadow-sm">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-bronze font-semibold">Zero Jargon Promise</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal">We Speak Your Language</h2>
          <p className="text-xs sm:text-sm text-taupe-dark leading-relaxed">
            You don't need to know the molecular difference between aldehydes and coumarin. Tell us what you want to experience, and our natural-language discovery quiz translates your desire into liquid art.
          </p>
          <div className="pt-4">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-burgundy hover:bg-burgundy-dark text-cream font-semibold uppercase tracking-widest text-xs rounded-xl shadow-luxury transition-all"
            >
              <Compass className="w-4 h-4 text-bronze-light" />
              <span>Begin Natural-Language Quiz</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
