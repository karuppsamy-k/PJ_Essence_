import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, RotateCcw, AlertTriangle, Check } from 'lucide-react';
import { catalogService } from '../../../services/catalogService';

export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { products: all } = await catalogService.getProducts({
        type: typeFilter === 'ALL' ? undefined : typeFilter,
        search,
        limit: 100,
      });
      setProducts(all);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [typeFilter, search]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you certain you wish to retire "${name}" from the catalog?`)) {
      await catalogService.deleteProduct(id);
      loadProducts();
    }
  };

  const handleToggleActive = async (product) => {
    await catalogService.updateProduct(product.id, { active: !product.active });
    loadProducts();
  };

  const handleReset = async () => {
    if (window.confirm('Reset all catalog items to factory seed data?')) {
      await catalogService.resetCatalog();
      loadProducts();
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-bronze font-semibold">Catalog Control</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-semibold mt-0.5">Product &amp; Inventory Suite</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2.5 border border-taupe/30 text-xs font-semibold uppercase tracking-wider text-charcoal hover:bg-white rounded-xl transition-colors flex items-center gap-1.5"
            title="Reset catalog"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Seed</span>
          </button>

          <Link
            to="/admin/products/new"
            className="px-5 py-2.5 bg-burgundy hover:bg-burgundy-dark text-cream text-xs font-semibold uppercase tracking-wider rounded-xl shadow transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-bronze-light" />
            <span>Formulate New Product</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-bronze/25 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-taupe-dark" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, notes, or slug..."
            className="w-full pl-10 pr-4 py-1.5 rounded-lg border border-taupe/30 bg-cream/30 text-xs focus:ring-burgundy"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['ALL', 'PERFUME', 'CAR_PERFUME', 'ROOM_FRESHENER'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${
                typeFilter === t
                  ? 'bg-burgundy text-cream font-semibold'
                  : 'bg-cream-warm/70 text-charcoal hover:bg-white border border-taupe/20'
              }`}
            >
              {t === 'ALL' ? 'All Types' : t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-bronze/25 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-warm/80 text-taupe-dark uppercase tracking-wider text-[10px] border-b border-taupe/20">
              <tr>
                <th className="p-4">Product Flacon</th>
                <th className="p-4">Type</th>
                <th className="p-4">Investment</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-taupe/10">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-taupe-dark">
                    Loading catalog inventory...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-taupe-dark">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-cream/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover bg-cream-warm border border-taupe/20"
                        />
                        <div>
                          <span className="font-serif font-bold text-charcoal text-sm block">{p.name}</span>
                          <span className="text-taupe-dark text-[11px]">{p.tagline || p.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cream border border-taupe/20 text-charcoal">
                        {p.type.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-4 font-serif font-bold text-burgundy text-sm">
                      ₹{p.price}
                    </td>

                    <td className="p-4">
                      <span className={`font-semibold ${p.inventory < 25 ? 'text-amber-700' : 'text-charcoal'}`}>
                        {p.inventory} flacons
                      </span>
                      {p.inventory < 25 && (
                        <span className="block text-[10px] text-amber-800 font-medium">Low stock</span>
                      )}
                    </td>

                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(p)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border transition-colors ${
                          p.active !== false
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-zinc-100 text-zinc-600 border-zinc-300'
                        }`}
                      >
                        {p.active !== false ? 'Active' : 'Archived'}
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-taupe-dark hover:text-charcoal transition-colors"
                          title="View live"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/admin/products/${p.id}/edit`}
                          className="p-1.5 text-taupe-dark hover:text-burgundy transition-colors"
                          title="Edit creation"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 text-taupe hover:text-rose-700 transition-colors"
                          title="Retire product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
