import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Upload, Plus, Trash2 } from 'lucide-react';
import { catalogService } from '../../../services/catalogService';
import { PRODUCT_TYPES, GENDER_TYPES } from '../../../patterns/factory/productFactory';
import { getStorageProvider } from '../../../repositories';

export function AdminProductFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const storageProvider = getStorageProvider();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: PRODUCT_TYPES.PERFUME,
    gender: GENDER_TYPES.UNISEX,
    tagline: '',
    description: '',
    price: 185,
    originalPrice: '',
    inventory: 35,
    active: true,
    featured: false,
    images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'],
    seasonTags: ['WINTER'],
    fragranceFamilies: ['Oriental'],
    intensity: 7,
    warmth: 8,
    freshness: 4,
    sweetness: 5,
    notes: {
      top: ['Cardamom', 'Bergamot'],
      heart: ['Damask Rose', 'Smoked Amber'],
      base: ['Cambodian Oud', 'Bourbon Vanilla'],
    },
    attributes: {
      volume: '50ml / 1.7 fl.oz',
      concentration: 'Extrait de Parfum (25%)',
      mountType: 'Solid Walnut Magnetic AC Vent Clip',
      diffusionDuration: '60 Days Active Release',
      dispenserType: 'Fine Mist Atomizer',
      coverageArea: 'Up to 750 sq. ft.',
    },
  });

  const [topNotesInput, setTopNotesInput] = useState('Cardamom, Bergamot');
  const [heartNotesInput, setHeartNotesInput] = useState('Damask Rose, Smoked Amber');
  const [baseNotesInput, setBaseNotesInput] = useState('Cambodian Oud, Bourbon Vanilla');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      async function load() {
        setLoading(true);
        try {
          const product = await catalogService.getProductById(id);
          if (product) {
            setFormData(product);
            setTopNotesInput(product.notes?.top?.join(', ') || '');
            setHeartNotesInput(product.notes?.heart?.join(', ') || '');
            setBaseNotesInput(product.notes?.base?.join(', ') || '');
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
      load();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      price: Number(formData.price),
      inventory: Number(formData.inventory),
      intensity: Number(formData.intensity),
      warmth: Number(formData.warmth),
      freshness: Number(formData.freshness),
      sweetness: Number(formData.sweetness),
      notes: {
        top: topNotesInput.split(',').map(s => s.trim()).filter(Boolean),
        heart: heartNotesInput.split(',').map(s => s.trim()).filter(Boolean),
        base: baseNotesInput.split(',').map(s => s.trim()).filter(Boolean),
      },
    };

    try {
      if (isEditing) {
        await catalogService.updateProduct(id, payload);
      } else {
        await catalogService.createProduct(payload);
      }
      navigate('/admin/products');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const res = await storageProvider.uploadFile(file, `products/${file.name}`);
      setFormData(prev => ({ ...prev, images: [res.url, ...prev.images] }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-taupe/20 pb-4">
        <div className="flex items-center gap-3">
          <Link to="/admin/products" className="p-2 rounded-lg border border-taupe/30 hover:bg-cream-warm text-charcoal">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-bronze font-bold">Catalog Formulator</span>
            <h1 className="font-serif text-2xl sm:text-3xl text-charcoal font-semibold">
              {isEditing ? `Edit: ${formData.name}` : 'Formulate New Fragrance Creation'}
            </h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Type Selection (Now Including Pure Attars) */}
        <div className="bg-white rounded-2xl border border-bronze/25 p-6 shadow-sm space-y-4">
          <label className="block text-xs uppercase tracking-wider text-taupe-dark font-semibold">
            Product Archetype (Factory Normalized)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: PRODUCT_TYPES.PERFUME, label: 'Haute Parfumerie' },
              { id: PRODUCT_TYPES.ATTAR, label: 'Pure Artisanal Attar' },
              { id: PRODUCT_TYPES.CAR_PERFUME, label: 'Artisanal Car Diffuser' },
              { id: PRODUCT_TYPES.ROOM_FRESHENER, label: 'Palatial Room Mist' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFormData({ ...formData, type: t.id })}
                className={`py-3 px-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all text-center ${
                  formData.type === t.id
                    ? 'border-burgundy bg-burgundy text-cream shadow'
                    : 'border-taupe/30 bg-cream/30 text-charcoal hover:border-bronze'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Basic Metadata & Gender Affinity */}
        <div className="bg-white rounded-2xl border border-bronze/25 p-6 shadow-sm space-y-4">
          <h3 className="font-serif text-lg text-charcoal font-semibold border-b border-taupe/15 pb-2">
            Nomenclature, Persona &amp; Storytelling
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Velvet Oud & Smoked Amber"
                className="w-full px-3 py-2 rounded-lg border border-taupe/30 bg-cream/20 text-xs focus:ring-burgundy"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1">
                Gender Persona Affinity
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-taupe/30 bg-cream/20 text-xs focus:ring-burgundy font-medium"
              >
                <option value={GENDER_TYPES.UNISEX}>Unisex (Shared / Gender-Neutral)</option>
                <option value={GENDER_TYPES.MEN}>Pour Homme (Men's)</option>
                <option value={GENDER_TYPES.WOMEN}>Pour Femme (Women's)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1">
                Slug (URL Identifier)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="velvet-oud-smoked-amber"
                className="w-full px-3 py-2 rounded-lg border border-taupe/30 bg-cream/20 text-xs focus:ring-burgundy"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1">
                Tagline (One-sentence essence hint)
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="A nocturnal whisper of Cambodian oud and dark resin."
                className="w-full px-3 py-2 rounded-lg border border-taupe/30 bg-cream/20 text-xs focus:ring-burgundy"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1">
              Full Editorial Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe distillation origin, feeling, and atmosphere..."
              className="w-full px-3 py-2 rounded-lg border border-taupe/30 bg-cream/20 text-xs focus:ring-burgundy"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1">
                Price (USD) *
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-taupe/30 bg-cream/20 text-xs focus:ring-burgundy font-serif font-bold text-base"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1">
                Original Price (Optional)
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-taupe/30 bg-cream/20 text-xs focus:ring-burgundy"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1">
                Inventory Stock (Flacons) *
              </label>
              <input
                type="number"
                required
                value={formData.inventory}
                onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-taupe/30 bg-cream/20 text-xs focus:ring-burgundy font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Fragrance Pyramid Notes */}
        <div className="bg-white rounded-2xl border border-bronze/25 p-6 shadow-sm space-y-4">
          <h3 className="font-serif text-lg text-charcoal font-semibold border-b border-taupe/15 pb-2">
            The Fragrance Note Pyramid
          </h3>

          <div>
            <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1">
              Top Notes (Comma separated)
            </label>
            <input
              type="text"
              value={topNotesInput}
              onChange={(e) => setTopNotesInput(e.target.value)}
              placeholder="Cardamom, Bergamot Zest, Pink Peppercorn"
              className="w-full px-3 py-2 rounded-lg border border-taupe/30 bg-cream/20 text-xs focus:ring-burgundy"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1">
              Heart Notes (Comma separated)
            </label>
            <input
              type="text"
              value={heartNotesInput}
              onChange={(e) => setHeartNotesInput(e.target.value)}
              placeholder="Damask Rose, Smoked Amber, Dark Cacao"
              className="w-full px-3 py-2 rounded-lg border border-taupe/30 bg-cream/20 text-xs focus:ring-burgundy"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1">
              Base Notes (Comma separated)
            </label>
            <input
              type="text"
              value={baseNotesInput}
              onChange={(e) => setBaseNotesInput(e.target.value)}
              placeholder="Cambodian Oud, Bourbon Vanilla, Atlas Cedarwood"
              className="w-full px-3 py-2 rounded-lg border border-taupe/30 bg-cream/20 text-xs focus:ring-burgundy"
            />
          </div>
        </div>

        {/* Step 4: Images & Media */}
        <div className="bg-white rounded-2xl border border-bronze/25 p-6 shadow-sm space-y-4">
          <h3 className="font-serif text-lg text-charcoal font-semibold border-b border-taupe/15 pb-2">
            Flacon Imagery
          </h3>

          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-burgundy file:text-cream hover:file:bg-burgundy-dark"
            />
            <span className="text-xs text-taupe-dark">Backed by StorageProvider Adapter</span>
          </div>

          <div className="flex gap-3 pt-2">
            {formData.images?.map((img, i) => (
              <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-taupe/20">
                <img src={img} alt="Product view" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            to="/admin/products"
            className="px-6 py-3 border border-taupe/30 text-xs font-semibold uppercase tracking-wider text-charcoal rounded-xl hover:bg-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-burgundy hover:bg-burgundy-dark text-cream font-semibold uppercase tracking-widest text-xs rounded-xl shadow-luxury flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-bronze-light" />
            <span>{isEditing ? 'Commit Changes' : 'Formulate & Save Creation'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
