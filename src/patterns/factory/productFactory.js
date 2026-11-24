/**
 * Factory Pattern for Polymorphic Product Creation
 * Supports: PERFUME, ATTAR, CAR_PERFUME, ROOM_FRESHENER
 */

export const PRODUCT_TYPES = {
  PERFUME: 'PERFUME',
  ATTAR: 'ATTAR',
  CAR_PERFUME: 'CAR_PERFUME',
  ROOM_FRESHENER: 'ROOM_FRESHENER',
};

export const GENDER_TYPES = {
  UNISEX: 'UNISEX',
  MEN: 'MEN',
  WOMEN: 'WOMEN',
};

export function createProduct(input) {
  if (!input || !input.name) {
    throw new Error('Product must have at least a name.');
  }

  const baseProduct = {
    id: input.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: input.name.trim(),
    slug: input.slug || input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    tagline: input.tagline || '',
    description: input.description || '',
    price: Number(input.price) || 0,
    originalPrice: input.originalPrice ? Number(input.originalPrice) : null,
    currency: input.currency || 'USD',
    active: input.active !== undefined ? Boolean(input.active) : true,
    inventory: input.inventory !== undefined ? Number(input.inventory) : 25,
    gender: input.gender || GENDER_TYPES.UNISEX,
    images: Array.isArray(input.images) && input.images.length > 0 ? input.images : [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
    ],
    seasonTags: Array.isArray(input.seasonTags) ? input.seasonTags : ['ALL_SEASON'],
    occasionTags: Array.isArray(input.occasionTags) ? input.occasionTags : ['DAILY'],
    fragranceFamilies: Array.isArray(input.fragranceFamilies) ? input.fragranceFamilies : ['Oriental'],
    intensity: Math.min(10, Math.max(1, Number(input.intensity) || 5)),
    warmth: Math.min(10, Math.max(1, Number(input.warmth) || 5)),
    freshness: Math.min(10, Math.max(1, Number(input.freshness) || 5)),
    sweetness: Math.min(10, Math.max(1, Number(input.sweetness) || 5)),
    notes: {
      top: Array.isArray(input.notes?.top) ? input.notes.top : [],
      heart: Array.isArray(input.notes?.heart) ? input.notes.heart : [],
      base: Array.isArray(input.notes?.base) ? input.notes.base : [],
    },
    featured: Boolean(input.featured),
    rating: Number(input.rating) || 4.9,
    reviewCount: Number(input.reviewCount) || 18,
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  switch (input.type) {
    case PRODUCT_TYPES.PERFUME:
      return {
        ...baseProduct,
        type: PRODUCT_TYPES.PERFUME,
        attributes: {
          concentration: input.attributes?.concentration || 'Extrait de Parfum (25% Oil Concentration)',
          volume: input.attributes?.volume || '50ml / 1.7 fl.oz',
          bottleType: input.attributes?.bottleType || 'Heavy Crystal Flacon with Hand-Turned Bronze Stopper',
          sillage: input.attributes?.sillage || 'Intimate & Long-lasting (8-12 hours)',
          gender: input.gender || 'Unisex',
        },
      };

    case PRODUCT_TYPES.ATTAR:
      return {
        ...baseProduct,
        type: PRODUCT_TYPES.ATTAR,
        attributes: {
          concentration: '100% Pure Concentrated Perfume Oil (Alcohol-Free)',
          volume: input.attributes?.volume || '6ml / 0.2 fl.oz (1/2 Tola)',
          bottleType: input.attributes?.bottleType || 'Hand-Cut Faceted Crystal Tola Flacon with Glass Dip Wand',
          sillage: 'Profound Skin Scent (24+ hours longevity)',
          distillation: 'Traditional Hydro-Distilled in Copper Degs',
          alcoholFree: true,
          gender: input.gender || 'Unisex',
        },
      };

    case PRODUCT_TYPES.CAR_PERFUME:
      return {
        ...baseProduct,
        type: PRODUCT_TYPES.CAR_PERFUME,
        attributes: {
          mountType: input.attributes?.mountType || 'Solid Walnut Magnetic AC Vent Clip',
          diffusionDuration: input.attributes?.diffusionDuration || '45 to 60 Days',
          refillable: input.attributes?.refillable !== false,
          refillType: input.attributes?.refillType || 'Ceramic Fragrance Core',
          includedRefills: Number(input.attributes?.includedRefills || 2),
        },
      };

    case PRODUCT_TYPES.ROOM_FRESHENER:
      return {
        ...baseProduct,
        type: PRODUCT_TYPES.ROOM_FRESHENER,
        attributes: {
          dispenserType: input.attributes?.dispenserType || 'Ultra-Fine Micro-Mist Room Diffuser',
          coverageArea: input.attributes?.coverageArea || 'Up to 750 sq. ft.',
          volume: input.attributes?.volume || '200ml / 6.8 fl.oz',
          recommendedRooms: input.attributes?.recommendedRooms || ['Living Room', 'Master Sanctuary', 'Executive Office'],
          naturalIngredients: input.attributes?.naturalIngredients !== false,
        },
      };

    default:
      throw new Error(`Unsupported product type: ${input.type}. Expected PERFUME, ATTAR, CAR_PERFUME, or ROOM_FRESHENER.`);
  }
}
