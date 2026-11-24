import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, Compass, ArrowRight } from 'lucide-react';
import { catalogService } from '../../../services/catalogService';
import { ProductCard } from '../../../components/shared/ProductCard';

export function SeasonalPage() {
  const { season = 'winter' } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const formattedSeason = season.toUpperCase();

  const seasonMeta = {
    WINTER: {
      title: 'The Winter Solstice Atelier',
      subtitle: 'Warm Ambers, Smoky Resins & Aged Agarwoods',
      description: 'When the frost descends and temperatures plummet, delicate notes vanish into the cold. Our winter compositions are anchored in deep, opulent base resins that blossom into radiant personal halos through chilly air.',
      bannerUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1600&q=85',
      signatureNotes: ['Aged Cambodian Oud', 'Bourbon Vanilla Pod', 'Smoked Amber', 'Wild Cardamom'],
      accentColor: 'text-burgundy',
    },
    SUMMER: {
      title: 'Solaris Côte d\'Azur Edition',
      subtitle: 'Sun-Drenched Neroli, White Tea & Saline Mists',
      description: 'Effervescent citrus blossoms, sparkling Mediterranean sea salt, and mountain petrichor calibrated to remain crisp and revitalizing even under the peak summer sun.',
      bannerUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
      signatureNotes: ['Tunisian Neroli', 'Calabrian Bergamot', 'Silver Needle Tea', 'Sea Salt'],
      accentColor: 'text-bronze',
    },
    AUTUMN: {
      title: 'Golden Foliage & Suede Woods',
      subtitle: 'Charred Cedar, Spiced Tobacco & Mysore Sandalwood',
      description: 'An atmospheric study of falling leaves, crackling wood hearths, and soft cashmere. Designed for contemplative evening warmth.',
      bannerUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
      signatureNotes: ['Mysore Sandalwood', 'Cuban Tobacco', 'Blond Suede', 'Orris Butter'],
      accentColor: 'text-walnut',
    },
    SPRING: {
      title: 'Botanical Rebirth & Dewy Petals',
      subtitle: 'Wild Fig Leaves, Damask Rose & Crisp Cyclamen',
      description: 'Delicate botanical stems and clean morning dew reviving the senses after winter dormancy.',
      bannerUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1600&q=85',
      signatureNotes: ['Wild Fig Leaf', 'Turkish Rose', 'Freesia Blossom', 'Clean Musk'],
      accentColor: 'text-emerald-800',
    },
  };

  const currentMeta = seasonMeta[formattedSeason] || seasonMeta.WINTER;

  useEffect(() => {
    async function loadSeasonal() {
      setLoading(true);
      try {
        const { products: seasonalProducts } = await catalogService.getProducts({
          season: formattedSeason,
          limit: 12,
        });
        setProducts(seasonalProducts);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSeasonal();
  }, [formattedSeason]);

  return (
    <div className="space-y-16">
      {/* Hero Banner */}
      <section className="relative min-h-[48vh] flex items-center justify-center overflow-hidden bg-charcoal text-cream">
        <img
          src={currentMeta.bannerUrl}
          alt={currentMeta.title}
          className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream/15 border border-bronze/40 text-xs font-semibold uppercase tracking-widest text-bronze-light">
            <Sparkles className="w-3.5 h-3.5 text-bronze" />
            <span>Seasonal Harvest Curations</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-cream font-normal">
            {currentMeta.title}
          </h1>

          <p className="text-sm sm:text-base text-cream-warm/90 max-w-2xl mx-auto leading-relaxed font-light">
            {currentMeta.description}
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-2 text-xs">
            {currentMeta.signatureNotes.map((note, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-cream/10 border border-cream/20 text-cream">
                {note}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Season Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="inline-flex p-1.5 rounded-xl bg-cream-warm border border-bronze/25 space-x-1">
          {['winter', 'spring', 'summer', 'autumn'].map((s) => (
            <Link
              key={s}
              to={`/collection/${s}`}
              className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                season.toLowerCase() === s
                  ? 'bg-burgundy text-cream shadow-sm'
                  : 'text-charcoal hover:text-burgundy'
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest text-bronze font-semibold">Seasonal Vault</span>
          <h2 className="font-serif text-3xl text-charcoal">
            {formattedSeason} Curated Formulations
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-96 rounded-xl bg-cream-warm animate-pulse border border-taupe/20" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white/70 rounded-2xl border border-bronze/20 p-8">
            <p className="font-serif text-xl text-charcoal mb-2">No active formulations cataloged for this season.</p>
            <Link to="/products" className="text-xs uppercase tracking-wider text-burgundy font-semibold underline">
              Browse All Fragrances
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
