// Vercel Serverless Function: POST /api/quiz/recommendations
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } });
  }

  const payload = req.body || {};
  const season = payload.season || 'WINTER';
  const warmth = Number(payload.warmth || 8);
  const intensity = Number(payload.intensity || 8);

  const profile = {
    title: warmth >= 8 ? 'The Nocturnal Alchemist' : 'The Solaris Purist',
    description: warmth >= 8
      ? 'Drawn to deep resiny depths, smoldering woods, and decadent spiced warmth.'
      : 'Drawn to luminous citrus blossoms and morning dew.',
    warmth,
    intensity,
    dominantSeason: season,
  };

  const recommendations = [
    {
      productId: 'prod_velvet_oud',
      productName: 'Velvet Oud & Smoked Amber',
      score: 96,
      matchReason: `Flawless alignment with your nocturnal ${season.toLowerCase()} warmth index (${warmth}/10).`,
    },
    {
      productId: 'prod_car_walnut_tobacco',
      productName: 'Atelier Car Vent Diffuser — Cuban Tobacco & Walnut',
      score: 91,
      matchReason: 'Harmonious woods profile suited for daily personal sanctum.',
    },
  ];

  return res.status(200).json({
    profile,
    recommendations,
  });
}
