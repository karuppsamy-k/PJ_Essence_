import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';
import { catalogService } from '../../../services/catalogService';
import { ProductCard } from '../../../components/shared/ProductCard';
import { PRODUCT_TYPES, GENDER_TYPES } from '../../../patterns/factory/productFactory';

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'ALL';
  const initialGender = searchParams.get('gender') || 'ALL';
  const initialSearch = searchParams.get('search') || '';
  const initialSeason = searchParams.get('season') || 'ALL';

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedGender, setSelectedGender] = useState(initialGender);
  const [selectedSeason, setSelectedSeason] = useState(initialSeason);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [minWarmth, setMinWarmth] = useState(0);

  // Sync state if URL query params change (e.g. clicking Men or Women from home)
  useEffect(() => {
    if (searchParams.get('type')) setSelectedType(searchParams.get('type'));
    if (searchParams.get('gender')) setSelectedGender(searchParams.get('gender'));
    if (searchParams.get('search')) setSearchQuery(searchParams.get('search'));
  }, [searchParams]);

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load products when filters change
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const result = await catalogService.getProducts({
          type: selectedType === 'ALL' ? undefined : selectedType,
          gender: selectedGender === 'ALL' ? undefined : selectedGender,
          season: selectedSeason === 'ALL' ? undefined : selectedSeason,
          search: debouncedSearch,
          sort: sortBy,
        });

        let filtered = result.products;
        if (minWarmth > 0) {
          filtered = filtered.filter(p => (p.warmth || 5) >= minWarmth);
        }

        setProducts(filtered);
        setTotal(filtered.length);
      } catch (err) {
        console.error('Failed to fetch catalog', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedType, selectedGender, selectedSeason, debouncedSearch, sortBy, minWarmth]);

  const resetFilters = () => {
    setSelectedType('ALL');
    setSelectedGender('ALL');
    setSelectedSeason('ALL');
    setSearchQuery('');
    setSortBy('featured');
    setMinWarmth(0);
    setSearchParams({});
  };

  const categories = [
    { id: 'ALL', label: 'All Masterpieces' },
    { id: PRODUCT_TYPES.PERFUME, label: 'Haute Parfumerie' },
    { id: PRODUCT_TYPES.ATTAR, label: 'Pure Artisanal Attars (Oils)' },
    { id: PRODUCT_TYPES.CAR_PERFUME, label: 'Artisanal Car Diffusers' },
    { id: PRODUCT_TYPES.ROOM_FRESHENER, label: 'Palatial Room Mists' },
  ];

  const genderOptions = [
    { id: 'ALL', label: 'All Genders' },
    { id: GENDER_TYPES.MEN, label: 'Pour Homme (Men)' },
    { id: GENDER_TYPES.WOMEN, label: 'Pour Femme (Women)' },
    { id: GENDER_TYPES.UNISEX, label: 'Unisex (Shared)' },
  ];

  const seasons = [
    { id: 'ALL', label: 'All Seasons' },
    { id: 'WINTER', label: 'Winter' },
    { id: 'AUTUMN', label: 'Autumn' },
    { id: 'SUMMER', label: 'Summer' },
    { id: 'SPRING', label: 'Spring' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-bronze font-semibold">The Permanent Cellar</span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal">Complete Fragrance Archive</h1>
        <p className="text-xs sm:text-sm text-taupe-dark leading-relaxed font-light">
          Discover small-batch extrait de parfums, pure artisanal non-alcoholic attars, solid walnut car diffusers, and palatial room essences.
        </p>
      </div>

      {/* Category Pills (Including Attar) */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedType(cat.id)}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
              selectedType === cat.id
                ? 'bg-burgundy text-cream border-burgundy shadow-sm'
                : 'bg-white/80 text-charcoal border-taupe/30 hover:border-bronze hover:bg-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-bronze/25 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-taupe-dark" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes (e.g. oud, vanilla, rose)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-taupe/30 bg-cream/30 text-xs focus:ring-1 focus:ring-burgundy focus:border-burgundy"
            />
          </div>

          {/* Gender Filter (Men, Women, Unisex) */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-taupe-dark uppercase tracking-wider font-medium flex-shrink-0">Persona:</span>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-taupe/30 bg-cream/30 text-xs font-medium text-charcoal focus:ring-burgundy"
            >
              {genderOptions.map((g) => (
                <option key={g.id} value={g.id}>{g.label}</option>
              ))}
            </select>
          </div>

          {/* Season Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-taupe-dark uppercase tracking-wider font-medium flex-shrink-0">Season:</span>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-taupe/30 bg-cream/30 text-xs font-medium text-charcoal focus:ring-burgundy"
            >
              {seasons.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-taupe-dark uppercase tracking-wider font-medium flex-shrink-0">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-taupe/30 bg-cream/30 text-xs font-medium text-charcoal focus:ring-burgundy"
            >
              <option value="featured">Featured Curations</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="intensity_desc">Highest Intensity</option>
              <option value="warmth_desc">Highest Warmth</option>
            </select>
          </div>

          {/* Reset Action */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-taupe-dark hover:text-burgundy transition-colors font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Count & Product Grid */}
      <div>
        <div className="flex items-center justify-between text-xs text-taupe-dark mb-6">
          <span>Showing <strong className="text-charcoal font-semibold">{total}</strong> bespoke creations</span>
          <span className="text-[11px] uppercase tracking-wider text-bronze font-semibold">Grasse Macerated &amp; Hydro-Distilled</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="h-96 rounded-xl bg-cream-warm animate-pulse border border-taupe/20" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white/70 rounded-2xl border border-bronze/20 p-8 space-y-3">
            <Sparkles className="w-8 h-8 text-bronze mx-auto opacity-70" />
            <h3 className="font-serif text-2xl text-charcoal">No Formulations Matched Your Criteria</h3>
            <p className="text-xs text-taupe-dark max-w-sm mx-auto">
              Try adjusting your persona filter or search query to explore our complete fragrance portfolio.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-2 px-6 py-2.5 bg-burgundy text-cream text-xs font-semibold uppercase tracking-widest rounded-lg"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
