// Vercel Serverless Function: GET /api/products
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } });
  }

  const { type, season, search, sort, page = 1, limit = 20 } = req.query;

  // In production, queries Firestore securely with admin SDK
  // Here we serve standard normalized response conforming to API.md
  const sampleProducts = [
    {
      id: 'prod_velvet_oud',
      type: 'PERFUME',
      name: 'Velvet Oud & Smoked Amber',
      slug: 'velvet-oud-smoked-amber',
      description: 'An opulent evening composition featuring rich Cambodian agarwood, charred amber resin, and Madagascar bourbon vanilla.',
      price: 195,
      currency: 'USD',
      active: true,
      inventory: 34,
      seasonTags: ['WINTER', 'AUTUMN'],
      intensity: 9,
      warmth: 10,
      freshness: 2,
      sweetness: 6,
      notes: {
        top: ['Wild Guatemalan Cardamom', 'Pink Peppercorn', 'Bergamot Zest'],
        heart: ['Smoked Turkish Damask Rose', 'Incense Tears', 'Dark Raw Cacao'],
        base: ['Aged Cambodian Oud', 'Bourbon Vanilla Pod', 'Atlas Cedarwood'],
      },
    },
    {
      id: 'prod_solaris_neroli',
      type: 'PERFUME',
      name: 'Solaris Neroli & White Tea',
      slug: 'solaris-neroli-white-tea',
      description: 'Sun-drenched Mediterranean citrus over chilled porcelain white tea leaves.',
      price: 165,
      currency: 'USD',
      active: true,
      inventory: 48,
      seasonTags: ['SUMMER', 'SPRING'],
      intensity: 6,
      warmth: 3,
      freshness: 9,
      sweetness: 4,
      notes: {
        top: ['Tunisian Neroli', 'Calabrian Bergamot', 'Mandarin Leaf'],
        heart: ['Silver Needle White Tea', 'Freesia Blossom', 'Sea Salt Accord'],
        base: ['White Cedar', 'Ambrette Seed', 'Luminous Cashmere'],
      },
    },
  ];

  return res.status(200).json({
    products: sampleProducts,
    total: sampleProducts.length,
    page: Number(page),
    totalPages: 1,
  });
}
