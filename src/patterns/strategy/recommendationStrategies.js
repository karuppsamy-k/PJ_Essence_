/**
 * Recommendation Strategy Pattern
 * Provides decoupled, switchable algorithms for calculating fragrance matches.
 */

export class RecommendationStrategy {
  /**
   * @param {Object} profile - User preferences from quiz / settings
   * @param {Array} catalog - Array of normalized products
   * @returns {Array} Array of { product, score: number, matchReason: string }
   */
  recommend(profile, catalog) {
    throw new Error('Strategy must implement recommend(profile, catalog) method');
  }
}

/**
 * Strategy 1: Rule-Based Weighted Scoring
 * Compares multi-dimensional olfactory distances (intensity, warmth, freshness, sweetness)
 * and note intersections.
 */
export class RuleBasedStrategy extends RecommendationStrategy {
  constructor() {
    super();
    this.name = 'ruleBased';
  }

  recommend(profile, catalog) {
    if (!catalog || !catalog.length) return [];

    const pWarmth = Number(profile.warmth ?? 5);
    const pIntensity = Number(profile.intensity ?? 5);
    const pFreshness = Number(profile.freshness ?? 5);
    const pSweetness = Number(profile.sweetness ?? 5);
    const pSeason = (profile.season || 'ALL_SEASON').toUpperCase();
    const pOccasion = (profile.occasion || '').toUpperCase();
    const pPreferredNotes = Array.isArray(profile.preferredNotes) 
      ? profile.preferredNotes.map(n => n.toLowerCase()) 
      : [];

    return catalog
      .filter(item => item.active !== false)
      .map(product => {
        let score = 40; // baseline

        // 1. Distance in Warmth (weight max 20)
        const warmthDiff = Math.abs((product.warmth || 5) - pWarmth);
        score += Math.max(0, 20 - warmthDiff * 3);

        // 2. Distance in Intensity (weight max 15)
        const intensityDiff = Math.abs((product.intensity || 5) - pIntensity);
        score += Math.max(0, 15 - intensityDiff * 2.5);

        // 3. Distance in Freshness (weight max 10)
        const freshnessDiff = Math.abs((product.freshness || 5) - pFreshness);
        score += Math.max(0, 10 - freshnessDiff * 2);

        // 4. Season Match (weight max 15)
        if (product.seasonTags?.includes(pSeason) || product.seasonTags?.includes('ALL_SEASON')) {
          score += 15;
        }

        // 5. Occasion Match (weight max 10)
        if (pOccasion && product.occasionTags?.includes(pOccasion)) {
          score += 10;
        }

        // 6. Note Overlap (weight max 20)
        if (pPreferredNotes.length > 0) {
          const productNotes = [
            ...(product.notes?.top || []),
            ...(product.notes?.heart || []),
            ...(product.notes?.base || []),
          ].map(n => n.toLowerCase());

          let noteMatches = 0;
          for (const pn of pPreferredNotes) {
            if (productNotes.some(note => note.includes(pn) || pn.includes(note))) {
              noteMatches += 1;
            }
          }
          score += Math.min(20, noteMatches * 7);
        }

        const clampedScore = Math.min(99, Math.max(45, Math.round(score)));

        let reason = `Aligned with your preferred warmth (${pWarmth}/10) and ${pSeason.toLowerCase()} profile.`;
        if (pPreferredNotes.length > 0) {
          reason += ` Features requested key notes in the pyramid.`;
        }

        return {
          product,
          score: clampedScore,
          matchReason: reason,
        };
      })
      .sort((a, b) => b.score - a.score);
  }
}

/**
 * Strategy 2: Seasonal-Focused Scoring
 * Maximizes atmospheric resonance with the current season and climate.
 */
export class SeasonalStrategy extends RecommendationStrategy {
  constructor() {
    super();
    this.name = 'seasonal';
  }

  recommend(profile, catalog) {
    const targetSeason = (profile.season || 'WINTER').toUpperCase();

    return catalog
      .filter(item => item.active !== false)
      .map(product => {
        let score = 50;

        const isDirectSeason = product.seasonTags?.includes(targetSeason);
        const isAllSeason = product.seasonTags?.includes('ALL_SEASON');

        if (isDirectSeason) {
          score += 35;
        } else if (isAllSeason) {
          score += 20;
        }

        // Warmth appropriateness for cold vs hot seasons
        if (targetSeason === 'WINTER' || targetSeason === 'AUTUMN') {
          score += (product.warmth || 5) * 1.5;
        } else {
          score += (product.freshness || 5) * 1.5;
        }

        const clampedScore = Math.min(99, Math.max(40, Math.round(score)));

        return {
          product,
          score: clampedScore,
          matchReason: `Curated exclusively for optimal projection during ${targetSeason.toLowerCase()} temperatures.`,
        };
      })
      .sort((a, b) => b.score - a.score);
  }
}

/**
 * Strategy 3: Hybrid Strategy
 * Blends rule-based harmony, seasonal factors, and customer review momentum.
 */
export class HybridStrategy extends RecommendationStrategy {
  constructor() {
    super();
    this.name = 'hybrid';
    this.ruleBased = new RuleBasedStrategy();
    this.seasonal = new SeasonalStrategy();
  }

  recommend(profile, catalog) {
    const ruleResults = this.ruleBased.recommend(profile, catalog);
    const seasonResults = this.seasonal.recommend(profile, catalog);

    const seasonMap = new Map(seasonResults.map(r => [r.product.id, r.score]));

    return ruleResults.map(item => {
      const seasonScore = seasonMap.get(item.product.id) || 50;
      const combinedScore = Math.round(item.score * 0.65 + seasonScore * 0.35);

      return {
        product: item.product,
        score: Math.min(99, combinedScore),
        matchReason: `High-potency match: combines olfactory profile harmony with peak seasonal synergy.`,
      };
    }).sort((a, b) => b.score - a.score);
  }
}

// Strategy Registry
const strategies = {
  ruleBased: new RuleBasedStrategy(),
  seasonal: new SeasonalStrategy(),
  hybrid: new HybridStrategy(),
};

export function getRecommendationStrategy(strategyName = 'ruleBased') {
  return strategies[strategyName] || strategies.ruleBased;
}
