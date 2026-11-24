import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Sparkles, Check, Edit, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { getSeasonalRepository } from '../../../repositories';

export function AdminSeasonalPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const seasonalRepo = getSeasonalRepository();

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const all = await seasonalRepo.list();
      setCampaigns(all);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleSetActive = async (id) => {
    for (const c of campaigns) {
      await seasonalRepo.update(c.id, { active: c.id === id });
    }
    loadCampaigns();
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase tracking-widest text-bronze font-semibold">Atmospheric Curation</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-semibold mt-0.5">Seasonal Campaign Manager</h1>
        <p className="text-xs text-taupe-dark mt-1">
          Activate seasonal campaigns, banners, and curated note showcases on the public storefront.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 p-8 text-center text-xs text-taupe-dark">Loading campaigns...</div>
        ) : (
          campaigns.map((camp) => (
            <div
              key={camp.id}
              className={`rounded-2xl border p-6 space-y-4 shadow-sm transition-all ${
                camp.active
                  ? 'bg-white border-bronze ring-2 ring-bronze/20'
                  : 'bg-white/70 border-taupe/20'
              }`}
            >
              <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-charcoal">
                <img
                  src={camp.bannerUrl}
                  alt={camp.title}
                  className="w-full h-full object-cover opacity-75"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-charcoal/80 text-cream px-2.5 py-1 rounded border border-cream/20">
                    {camp.season}
                  </span>
                </div>
                {camp.active && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider bg-emerald-700 text-cream px-2.5 py-1 rounded shadow">
                      <Check className="w-3 h-3" /> Active Campaign
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-serif text-xl font-semibold text-charcoal">{camp.title}</h3>
                <p className="text-xs text-taupe-dark mt-1 leading-relaxed">{camp.tagline}</p>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-taupe-dark font-medium">Curated Fragrance Notes:</span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {camp.curatedNoteFocus?.map((note, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-cream text-charcoal border border-taupe/20 text-[10px]">
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-taupe/15 flex items-center justify-between">
                <Link
                  to={`/collection/${camp.season.toLowerCase()}`}
                  target="_blank"
                  className="text-xs font-semibold text-burgundy hover:underline flex items-center gap-1"
                >
                  <span>Preview Storefront</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                {!camp.active ? (
                  <button
                    type="button"
                    onClick={() => handleSetActive(camp.id)}
                    className="px-4 py-1.5 bg-burgundy hover:bg-burgundy-dark text-cream text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
                  >
                    Activate on Store
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-800">
                    Currently Featured
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
