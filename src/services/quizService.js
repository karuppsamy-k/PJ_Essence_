import { getQuizRepository } from '../repositories';
import { recommendationService } from './recommendationService';

export const quizService = {
  async getActiveQuestions() {
    const repo = getQuizRepository();
    return await repo.list();
  },

  async getAllQuestionsForAdmin() {
    const repo = getQuizRepository();
    return await repo.listAll();
  },

  async createQuestion(questionData) {
    const repo = getQuizRepository();
    return await repo.create(questionData);
  },

  async updateQuestion(id, patch) {
    const repo = getQuizRepository();
    return await repo.update(id, patch);
  },

  async deleteQuestion(id) {
    const repo = getQuizRepository();
    return await repo.remove(id);
  },

  /**
   * Evaluates answers and determines the next question ID based on conditional rules.
   */
  getNextQuestion(currentQuestion, selectedOptionId, questions) {
    if (!currentQuestion) return null;
    const selectedOption = currentQuestion.options?.find(o => o.id === selectedOptionId);

    if (selectedOption?.nextQuestionId) {
      const explicitNext = questions.find(q => q.id === selectedOption.nextQuestionId && q.active !== false);
      if (explicitNext) return explicitNext;
    }

    // Default sequential fallback: find the next question by order with matching season context
    const remaining = questions
      .filter(q => q.order > currentQuestion.order && q.active !== false)
      .sort((a, b) => a.order - b.order);

    return remaining[0] || null;
  },

  /**
   * Aggregates answers into a synthesized profile and calculates recommendations.
   */
  async submitQuizAnswers(answers, preferredStrategy = 'ruleBased') {
    const aggregated = {
      warmth: 5,
      intensity: 5,
      freshness: 5,
      sweetness: 5,
      season: 'ALL_SEASON',
      preferredNotes: [],
      rawAnswers: answers,
    };

    answers.forEach(ans => {
      const opt = ans.option;
      if (!opt || !opt.scoring) return;

      if (opt.scoring.warmth !== undefined) aggregated.warmth = opt.scoring.warmth;
      if (opt.scoring.intensity !== undefined) aggregated.intensity = opt.scoring.intensity;
      if (opt.scoring.freshness !== undefined) aggregated.freshness = opt.scoring.freshness;
      if (opt.scoring.sweetness !== undefined) aggregated.sweetness = opt.scoring.sweetness;
      if (opt.scoring.season) aggregated.season = opt.scoring.season;
      if (Array.isArray(opt.scoring.notes)) {
        aggregated.preferredNotes.push(...opt.scoring.notes);
      }
    });

    // Remove duplicates
    aggregated.preferredNotes = Array.from(new Set(aggregated.preferredNotes));

    // Save session in local storage
    try {
      localStorage.setItem('pj_essence_last_scent_profile', JSON.stringify(aggregated));
    } catch (e) {}

    // Get recommendations
    const results = await recommendationService.getRecommendations(aggregated, preferredStrategy);

    return {
      profile: aggregated,
      ...results,
    };
  },

  getLastSavedProfile() {
    try {
      const raw = localStorage.getItem('pj_essence_last_scent_profile');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }
};
