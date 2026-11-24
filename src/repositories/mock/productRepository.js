import { INITIAL_PRODUCTS } from './mockData';
import { createProduct } from '../../patterns/factory/productFactory';

const STORAGE_KEY = 'pj_essence_mock_products_v1';

function getStoredProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    // In SSR or non-browser fallback
  }
  return [...INITIAL_PRODUCTS];
}

function saveProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (e) {}
}

export function createMockProductRepository() {
  let products = getStoredProducts();

  return {
    async list({ type, season, gender, search, minPrice, maxPrice, sort, page = 1, limit = 24 } = {}) {
      // Simulate micro-latency
      await new Promise(r => setTimeout(r, 40));

      let result = [...products];

      if (type && type !== 'ALL') {
        result = result.filter(p => p.type === type);
      }

      if (gender && gender !== 'ALL') {
        result = result.filter(p => p.gender === gender || p.gender === 'UNISEX');
      }

      if (season && season !== 'ALL') {
        result = result.filter(p => p.seasonTags?.includes(season) || p.seasonTags?.includes('ALL_SEASON'));
      }

      if (search && search.trim()) {
        const q = search.toLowerCase().trim();
        result = result.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          [...(p.notes?.top || []), ...(p.notes?.heart || []), ...(p.notes?.base || [])].some(n => n.toLowerCase().includes(q))
        );
      }

      if (minPrice !== undefined) {
        result = result.filter(p => p.price >= Number(minPrice));
      }

      if (maxPrice !== undefined) {
        result = result.filter(p => p.price <= Number(maxPrice));
      }

      // Sort
      if (sort === 'price_asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (sort === 'price_desc') {
        result.sort((a, b) => b.price - a.price);
      } else if (sort === 'intensity_desc') {
        result.sort((a, b) => b.intensity - a.intensity);
      } else if (sort === 'warmth_desc') {
        result.sort((a, b) => b.warmth - a.warmth);
      } else {
        // default featured / rating
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
      }

      const total = result.length;
      const startIndex = (page - 1) * limit;
      const paginated = result.slice(startIndex, startIndex + limit);

      return {
        products: paginated,
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      };
    },

    async getById(id) {
      await new Promise(r => setTimeout(r, 30));
      return products.find(p => p.id === id) || null;
    },

    async getBySlug(slug) {
      await new Promise(r => setTimeout(r, 30));
      return products.find(p => p.slug === slug || p.id === slug) || null;
    },

    async create(productData) {
      await new Promise(r => setTimeout(r, 60));
      const normalized = createProduct(productData);
      products.unshift(normalized);
      saveProducts(products);
      return normalized;
    },

    async update(id, patch) {
      await new Promise(r => setTimeout(r, 60));
      const index = products.findIndex(p => p.id === id);
      if (index === -1) throw new Error(`Product ${id} not found`);

      const updated = {
        ...products[index],
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      products[index] = updated;
      saveProducts(products);
      return updated;
    },

    async remove(id) {
      await new Promise(r => setTimeout(r, 60));
      products = products.filter(p => p.id !== id);
      saveProducts(products);
      return { success: true };
    },

    async resetToDefault() {
      products = [...INITIAL_PRODUCTS];
      saveProducts(products);
      return products;
    }
  };
}
