import { getProductRepository } from '../repositories';

export const catalogService = {
  async getProducts(filters) {
    const repo = getProductRepository();
    return await repo.list(filters);
  },

  async getProductBySlug(slug) {
    const repo = getProductRepository();
    return await repo.getBySlug(slug);
  },

  async getProductById(id) {
    const repo = getProductRepository();
    return await repo.getById(id);
  },

  async getSeasonalProducts(season) {
    const repo = getProductRepository();
    return await repo.list({ season, limit: 12 });
  },

  async getAllFragranceNotes() {
    const repo = getProductRepository();
    const { products } = await repo.list({ limit: 100 });
    const top = new Set();
    const heart = new Set();
    const base = new Set();

    products.forEach(p => {
      p.notes?.top?.forEach(n => top.add(n));
      p.notes?.heart?.forEach(n => heart.add(n));
      p.notes?.base?.forEach(n => base.add(n));
    });

    return {
      top: Array.from(top),
      heart: Array.from(heart),
      base: Array.from(base),
    };
  },

  async createProduct(productData) {
    const repo = getProductRepository();
    return await repo.create(productData);
  },

  async updateProduct(id, patch) {
    const repo = getProductRepository();
    return await repo.update(id, patch);
  },

  async deleteProduct(id) {
    const repo = getProductRepository();
    return await repo.remove(id);
  },

  async resetCatalog() {
    const repo = getProductRepository();
    return await repo.resetToDefault();
  }
};
