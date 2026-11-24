import { getRecommendationStrategy } from '../patterns/strategy/recommendationStrategies';
import { getProductRepository } from '../repositories';

export const recommendationService = {
  /**
   * Generates recommendations based on the customer's quiz responses or saved profile.
   * @param {Object} profile - User's scent preferences
   * @param {string} [strategyName='ruleBased'] - Strategy algorithm key
   */
  async getRecommendations(profile, strategyName = 'ruleBased') {
    const productRepo = getProductRepository();
    const { products } = await productRepo.list({ limit: 100 });
    const strategy = getRecommendationStrategy(strategyName);

    const matches = strategy.recommend(profile, products);

    // Profile Persona Synthesis
    const persona = this.synthesizePersona(profile);

    return {
      persona,
      strategyUsed: strategy.name,
      recommendations: matches.slice(0, 6),
      totalMatches: matches.length,
    };
  },

  /**
   * Translates numerical parameters into evocative luxury editorial fragrance personas.
   */
  synthesizePersona(profile) {
    const warmth = Number(profile.warmth ?? 5);
    const intensity = Number(profile.intensity ?? 5);
    const season = (profile.season || 'Winter').toUpperCase();

    let title = 'The Timeless Classicist';
    let description = 'You command presence through poise, refined proportions, and impeccable nuance.';

    if (warmth >= 8 && intensity >= 7) {
      title = 'The Nocturnal Alchemist';
      description = 'You are magnetically pulled toward midnight shadows, smoldering amber resins, rare oud, and decadent warm spice.';
    } else if (warmth <= 4 && intensity <= 6) {
      title = 'The Solaris Purist';
      description = 'You gravitate toward luminous morning breezes, crystalline white blossoms, effervescent citrus, and clean linen serenity.';
    } else if (warmth >= 6 && profile.preferredNotes?.some(n => n.includes('sandalwood') || n.includes('walnut') || n.includes('cedar'))) {
      title = 'The Aristocratic Connoisseur';
      description = 'Drawn to creamy Mysore woods, aged paper archives, Florentine leather, and understated authority.';
    } else if (season === 'WINTER') {
      title = 'The Winter Solstice Enchanter';
      description = 'Seeking cocooning warmth, spiced resins, and intoxicating base notes that radiate through the winter air.';
    }

    return {
      title,
      description,
      warmthIndex: `${warmth}/10`,
      intensityIndex: `${intensity}/10`,
      seasonAlignment: season,
      signatureVibe: profile.atmosphere || 'Sophisticated & Intimate',
    };
  }
};
