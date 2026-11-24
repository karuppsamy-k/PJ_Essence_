import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Trash2, Copy, Check, Sparkles } from 'lucide-react';
import { getStorageProvider } from '../../../repositories';

export function AdminMediaPage() {
  const storageProvider = getStorageProvider();
  const [copiedId, setCopiedId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [assets, setAssets] = useState([
    {
      id: 'ast_1',
      name: 'velvet_oud_flacon.jpg',
      url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      size: '1.4 MB',
      type: 'Product Hero',
      uploadedAt: '2026-01-10',
    },
    {
      id: 'ast_2',
      name: 'solaris_neroli_bottle.jpg',
      url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
      size: '980 KB',
      type: 'Product Hero',
      uploadedAt: '2026-02-14',
    },
    {
      id: 'ast_3',
      name: 'walnut_car_diffuser.jpg',
      url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      size: '1.1 MB',
      type: 'Car Perfume',
      uploadedAt: '2026-02-18',
    },
    {
      id: 'ast_4',
      name: 'winter_solstice_editorial.jpg',
      url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1600&q=85',
      size: '2.8 MB',
      type: 'Campaign Banner',
      uploadedAt: '2026-03-01',
    },
    {
      id: 'ast_5',
      name: 'santal_reserve_flacon.jpg',
      url: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80',
      size: '1.2 MB',
      type: 'Product Hero',
      uploadedAt: '2026-03-05',
    },
  ]);

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const result = await storageProvider.uploadFile(file, `media/${file.name}`);
        const newAsset = {
          id: `ast_${Date.now()}`,
          name: file.name,
          url: result.url,
          size: `${Math.round(file.size / 1024)} KB`,
          type: 'Uploaded Asset',
          uploadedAt: new Date().toISOString().split('T')[0],
        };
        setAssets([newAsset, ...assets]);
      } catch (err) {
        alert(err.message);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDelete = (id) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-bronze font-semibold">Cloud Storage Adapter</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-semibold mt-0.5">Media Asset Vault</h1>
          <p className="text-xs text-taupe-dark mt-1">
            Grasse high-resolution photography, flacon renders, and campaign imagery.
          </p>
        </div>

        <label className="px-5 py-2.5 bg-burgundy hover:bg-burgundy-dark text-cream text-xs font-semibold uppercase tracking-wider rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer">
          <Upload className="w-4 h-4 text-bronze-light" />
          <span>{uploading ? 'Transferring...' : 'Upload Asset to Cloud'}</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((ast) => (
          <div
            key={ast.id}
            className="bg-white rounded-2xl border border-bronze/25 p-4 shadow-sm hover:shadow-luxury transition-all space-y-3"
          >
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-cream-warm border border-taupe/20">
              <img src={ast.url} alt={ast.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex justify-between items-start text-xs">
              <div className="truncate pr-2">
                <span className="font-semibold text-charcoal block truncate">{ast.name}</span>
                <span className="text-taupe-dark text-[11px]">{ast.size} • {ast.type}</span>
              </div>
              <span className="text-[10px] text-taupe-dark">{ast.uploadedAt}</span>
            </div>

            <div className="pt-2 border-t border-taupe/15 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => handleCopy(ast.url, ast.id)}
                className="text-burgundy hover:underline flex items-center gap-1 font-semibold"
              >
                {copiedId === ast.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied URL</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Asset URL</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleDelete(ast.id)}
                className="text-taupe hover:text-rose-700 transition-colors p-1"
                title="Remove asset"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
