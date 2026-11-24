import { INITIAL_QUIZ_QUESTIONS, INITIAL_CUSTOMERS, INITIAL_SEASONAL_CAMPAIGNS } from './mockData';

const QUIZ_STORAGE_KEY = 'pj_essence_mock_quiz_v1';
const SEASONAL_STORAGE_KEY = 'pj_essence_mock_seasonal_v1';

function getStoredQuiz() {
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [...INITIAL_QUIZ_QUESTIONS];
}

function saveQuiz(questions) {
  try {
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(questions));
  } catch (e) {}
}

export function createMockQuizRepository() {
  let questions = getStoredQuiz();

  return {
    async list() {
      await new Promise(r => setTimeout(r, 30));
      return questions.filter(q => q.active !== false).sort((a, b) => a.order - b.order);
    },

    async listAll() {
      await new Promise(r => setTimeout(r, 30));
      return [...questions].sort((a, b) => a.order - b.order);
    },

    async getById(id) {
      return questions.find(q => q.id === id) || null;
    },

    async create(questionData) {
      const newQuestion = {
        id: `q_${Date.now()}`,
        order: questions.length + 1,
        active: true,
        ...questionData,
      };
      questions.push(newQuestion);
      saveQuiz(questions);
      return newQuestion;
    },

    async update(id, patch) {
      const idx = questions.findIndex(q => q.id === id);
      if (idx === -1) throw new Error(`Question ${id} not found`);
      questions[idx] = { ...questions[idx], ...patch };
      saveQuiz(questions);
      return questions[idx];
    },

    async remove(id) {
      questions = questions.filter(q => q.id !== id);
      saveQuiz(questions);
      return { success: true };
    },
  };
}

export function createMockCustomerRepository() {
  let customers = [...INITIAL_CUSTOMERS];

  return {
    async list() {
      await new Promise(r => setTimeout(r, 30));
      return [...customers];
    },
    async getById(id) {
      return customers.find(c => c.id === id) || null;
    },
  };
}

export function createMockSeasonalRepository() {
  let campaigns = [...INITIAL_SEASONAL_CAMPAIGNS];

  return {
    async list() {
      await new Promise(r => setTimeout(r, 30));
      return [...campaigns];
    },
    async getActive() {
      return campaigns.find(c => c.active) || campaigns[0];
    },
    async update(id, patch) {
      const idx = campaigns.findIndex(c => c.id === id);
      if (idx === -1) throw new Error('Campaign not found');
      campaigns[idx] = { ...campaigns[idx], ...patch };
      return campaigns[idx];
    },
  };
}
