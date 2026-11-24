import React, { useEffect, useState } from 'react';
import { Compass, Plus, Edit, Trash2, Check, ArrowRight, Sparkles, Sliders } from 'lucide-react';
import { quizService } from '../../../services/quizService';

export function AdminQuizPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New question form state
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    helperText: '',
    order: 5,
    seasonContext: 'ALL',
    options: [
      {
        id: 'opt_1',
        label: 'Aura of Night Mystique',
        description: 'Deep incense and smoked wood.',
        scoring: { warmth: 9, intensity: 8, notes: ['oud', 'amber'] },
        nextQuestionId: '',
      },
      {
        id: 'opt_2',
        label: 'Morning Sun Vitality',
        description: 'Sparkling citrus and blossoms.',
        scoring: { warmth: 3, intensity: 5, notes: ['neroli', 'bergamot'] },
        nextQuestionId: '',
      },
    ],
  });

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const all = await quizService.getAllQuestionsForAdmin();
      setQuestions(all);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleToggleActive = async (q) => {
    await quizService.updateQuestion(q.id, { active: !q.active });
    loadQuestions();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this questionnaire step?')) {
      await quizService.deleteQuestion(id);
      loadQuestions();
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    await quizService.createQuestion(newQuestion);
    setShowCreateModal(false);
    loadQuestions();
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-bronze font-semibold">Algorithm Engine</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-semibold mt-0.5">Quiz &amp; Conditional Rules</h1>
          <p className="text-xs text-taupe-dark mt-1">
            Administer the natural-language question tree, session-aware branching, and scoring vectors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-burgundy hover:bg-burgundy-dark text-cream text-xs font-semibold uppercase tracking-wider rounded-xl shadow transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-bronze-light" />
          <span>Add Conditional Question</span>
        </button>
      </div>

      {/* Questions Tree List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-taupe-dark">Loading quiz logic tree...</div>
        ) : (
          questions.map((q) => (
            <div
              key={q.id}
              className={`p-6 rounded-2xl border transition-all ${
                q.active !== false
                  ? 'bg-white border-bronze/25 shadow-sm'
                  : 'bg-zinc-50 border-zinc-200 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-taupe/15 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-burgundy text-base">Step #{q.order}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cream border border-taupe/20 text-charcoal">
                      Context: {q.seasonContext || 'ALL'}
                    </span>
                    <span className="text-xs text-taupe-dark">ID: {q.id}</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-charcoal">{q.question}</h3>
                  {q.helperText && <p className="text-xs text-taupe-dark italic">{q.helperText}</p>}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(q)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                      q.active !== false
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-zinc-100 text-zinc-600 border-zinc-300'
                    }`}
                  >
                    {q.active !== false ? 'Active' : 'Inactive'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(q.id)}
                    className="p-1.5 text-taupe hover:text-rose-700"
                    title="Delete question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Options & Branching Rules Display */}
              <div className="mt-4 space-y-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-taupe-dark block">
                  Options &amp; Conditional Logic:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {q.options?.map((opt) => (
                    <div key={opt.id} className="p-3 rounded-xl bg-cream/40 border border-taupe/20 space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-charcoal">{opt.label}</span>
                        {opt.nextQuestionId && (
                          <span className="text-[10px] uppercase font-bold text-burgundy bg-burgundy/10 px-2 py-0.5 rounded">
                            Branches to: {opt.nextQuestionId}
                          </span>
                        )}
                      </div>
                      <p className="text-taupe-dark text-[11px]">{opt.description}</p>
                      {opt.scoring && (
                        <div className="pt-1 text-[10px] text-bronze font-mono">
                          Scoring: {JSON.stringify(opt.scoring)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Question Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-bronze/35 p-8 max-w-xl w-full shadow-2xl space-y-4">
            <h3 className="font-serif text-2xl text-charcoal font-semibold">Add New Scent Question</h3>

            <form onSubmit={handleCreateQuestion} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-taupe-dark font-medium mb-1">
                  Question Text *
                </label>
                <input
                  type="text"
                  required
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  placeholder="Which evening atmosphere comforts your soul?"
                  className="w-full px-3 py-2 rounded-lg border border-taupe/30 bg-cream/20 text-xs focus:ring-burgundy"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-taupe-dark font-medium mb-1">
                  Helper Subtitle
                </label>
                <input
                  type="text"
                  value={newQuestion.helperText}
                  onChange={(e) => setNewQuestion({ ...newQuestion, helperText: e.target.value })}
                  placeholder="Think of your ideal nocturnal refuge."
                  className="w-full px-3 py-2 rounded-lg border border-taupe/30 bg-cream/20 text-xs focus:ring-burgundy"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-taupe-dark font-medium mb-1">
                    Season Context
                  </label>
                  <select
                    value={newQuestion.seasonContext}
                    onChange={(e) => setNewQuestion({ ...newQuestion, seasonContext: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-taupe/30 bg-cream/20 text-xs"
                  >
                    <option value="ALL">All Seasons</option>
                    <option value="WINTER">Winter Only</option>
                    <option value="SUMMER">Summer Only</option>
                    <option value="AUTUMN">Autumn Only</option>
                    <option value="SPRING">Spring Only</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-taupe-dark font-medium mb-1">
                    Order Sequence
                  </label>
                  <input
                    type="number"
                    value={newQuestion.order}
                    onChange={(e) => setNewQuestion({ ...newQuestion, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-taupe/30 bg-cream/20 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-taupe/20">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-taupe/30 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-burgundy text-cream text-xs font-semibold uppercase tracking-wider rounded-lg"
                >
                  Add Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
