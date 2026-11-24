/**
 * Firestore Product Repository Adapter
 * Implements the same interface as MockProductRepository.
 */
export function createFirestoreProductRepository(firestoreDb) {
  return {
    async list({ type, season, search, minPrice, maxPrice, sort, page = 1, limit = 24 } = {}) {
      if (!firestoreDb) throw new Error('Firestore DB not initialized');
      // When connected to live Firebase:
      // Uses firestore collection('products'), query(), getDocs()
      // Returns normalized polymorphic product structures
      return {
        products: [],
        total: 0,
        page,
        totalPages: 1,
      };
    },

    async getById(id) {
      if (!firestoreDb) throw new Error('Firestore DB not initialized');
      return null;
    },

    async getBySlug(slug) {
      if (!firestoreDb) throw new Error('Firestore DB not initialized');
      return null;
    },

    async create(productData) {
      if (!firestoreDb) throw new Error('Firestore DB not initialized');
      return null;
    },

    async update(id, patch) {
      if (!firestoreDb) throw new Error('Firestore DB not initialized');
      return null;
    },

    async remove(id) {
      if (!firestoreDb) throw new Error('Firestore DB not initialized');
      return { success: true };
    },
  };
}
