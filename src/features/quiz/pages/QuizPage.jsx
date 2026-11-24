import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, Check, ArrowRight, RotateCcw, Sliders, Star, ShoppingBag, Eye } from 'lucide-react';
import { quizService } from '../../../services/quizService';
import { ProductCard } from '../../../components/shared/ProductCard';
import { useCart } from '../../cart/CartContext';
import { Link } from 'react-router-dom';

export function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [activeStrategy, setActiveStrategy] = useState('ruleBased');
  const [calculating, setCalculating] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    async function loadQuiz() {
      try {
        const loadedQuestions = await quizService.getActiveQuestions();
        setQuestions(loadedQuestions);
        if (loadedQuestions.length > 0) {
          setCurrentQuestion(loadedQuestions[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, []);

  const handleSelectOption = async (option) => {
    const updatedAnswers = [
      ...answers.filter(a => a.questionId !== currentQuestion.id),
      { questionId: currentQuestion.id, questionText: currentQuestion.question, option },
    ];
    setAnswers(updatedAnswers);

    // Save history for back navigation
    setHistory([...history, currentQuestion]);

    // Check next conditional question
    const nextQ = quizService.getNextQuestion(currentQuestion, option.id, questions);

    if (nextQ) {
      setCurrentQuestion(nextQ);
    } else {
      // Completed! Formulate recommendations
      await finalizeQuiz(updatedAnswers, activeStrategy);
    }
  };

  const finalizeQuiz = async (userAnswers, strategyName) => {
    setCalculating(true);
    try {
      const outcome = await quizService.submitQuizAnswers(userAnswers, strategyName);
      setResults(outcome);
      setIsCompleted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setCalculating(false);
    }
  };

  const handleStrategyChange = async (newStrategy) => {
    setActiveStrategy(newStrategy);
    if (results && answers.length > 0) {
      setCalculating(true);
      try {
        const outcome = await quizService.submitQuizAnswers(answers, newStrategy);
        setResults(outcome);
      } finally {
        setCalculating(false);
      }
    }
  };

  const handleRestart = () => {
    setAnswers([]);
    setHistory([]);
    setIsCompleted(false);
    setResults(null);
    if (questions.length > 0) {
      setCurrentQuestion(questions[0]);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentQuestion(prev);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <Sparkles className="w-8 h-8 text-bronze animate-pulse mb-4" />
        <p className="font-serif text-xl text-charcoal">Preparing Fragrance Discovery Engine...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Top Banner Header */}
      <div className="text-center mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-bronze font-semibold">
          <Compass className="w-4 h-4 text-bronze" />
          <span>Natural-Language Scent Profiler</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal">Discover Your Olfactory Signature</h1>
        <p className="text-xs sm:text-sm text-taupe-dark max-w-lg mx-auto leading-relaxed">
          No chemistry or perfumery knowledge needed. Simply describe how you want to feel, your seasonal world, and the aura you wish to radiate.
        </p>
      </div>

      {!isCompleted ? (
        /* QUIZ STEPPER */
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-bronze/30 shadow-luxury p-6 sm:p-10">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs text-taupe-dark mb-8 border-b border-taupe/15 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-burgundy text-base">Step {currentQuestion?.order || 1}</span>
              <span>of estimated 4</span>
            </div>

            {history.length > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="text-taupe-dark hover:text-burgundy underline underline-offset-4 text-xs transition-colors"
              >
                ← Back to previous question
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion?.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-semibold">
                  {currentQuestion?.question}
                </h2>
                {currentQuestion?.helperText && (
                  <p className="text-xs sm:text-sm text-taupe-dark mt-1">
                    {currentQuestion.helperText}
                  </p>
                )}
              </div>

              {/* Options Cards */}
              <div className="space-y-3 pt-2">
                {currentQuestion?.options?.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelectOption(option)}
                    className="w-full text-left p-5 rounded-xl border border-taupe/30 hover:border-bronze bg-cream-light/60 hover:bg-white shadow-sm hover:shadow-luxury transition-all group flex items-start justify-between"
                  >
                    <div className="pr-4 space-y-1">
                      <span className="font-serif text-lg font-medium text-charcoal group-hover:text-burgundy transition-colors block">
                        {option.label}
                      </span>
                      <p className="text-xs text-taupe-dark leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full border border-taupe/40 group-hover:border-burgundy flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-burgundy/10 transition-colors">
                      <ArrowRight className="w-3 h-3 text-taupe-dark group-hover:text-burgundy transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Calculating Overlay */}
          {calculating && (
            <div className="mt-8 text-center p-6 bg-cream-warm/70 rounded-xl border border-bronze/30">
              <Sparkles className="w-6 h-6 text-bronze animate-spin mx-auto mb-2" />
              <p className="font-serif text-base text-charcoal">Harmonizing note profiles against master catalog...</p>
            </div>
          )}
        </div>
      ) : (
        /* RESULTS & RECOMMENDATIONS */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-10"
        >
          {/* Persona Card */}
          <div className="bg-gradient-to-br from-cream via-white to-cream-warm rounded-3xl p-8 sm:p-12 border border-bronze/35 shadow-luxury relative overflow-hidden">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bronze/10 border border-bronze/30 text-xs font-semibold uppercase tracking-widest text-bronze-dark">
                <Sparkles className="w-3.5 h-3.5 text-bronze" />
                <span>Your Synthesized Scent Profile</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl text-burgundy font-normal">
                {results?.persona?.title}
              </h2>

              <p className="text-sm sm:text-base text-charcoal leading-relaxed font-light">
                {results?.persona?.description}
              </p>

              {/* Profile Metrics Pills */}
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-lg bg-white border border-taupe/20 text-charcoal font-medium">
                  Warmth Affinity: <span className="text-burgundy font-bold">{results?.persona?.warmthIndex}</span>
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-white border border-taupe/20 text-charcoal font-medium">
                  Intensity Projection: <span className="text-bronze-dark font-bold">{results?.persona?.intensityIndex}</span>
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-white border border-taupe/20 text-charcoal font-medium">
                  Seasonal Resonance: <span className="font-bold">{results?.persona?.seasonAlignment}</span>
                </span>
              </div>
            </div>

            {/* Strategy Switcher Bar */}
            <div className="mt-8 pt-6 border-t border-taupe/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-bronze" />
                <span className="text-xs uppercase tracking-wider font-semibold text-charcoal">
                  Recommendation Algorithm:
                </span>
                <select
                  value={activeStrategy}
                  onChange={(e) => handleStrategyChange(e.target.value)}
                  className="text-xs py-1 px-2.5 rounded-lg border border-bronze/40 bg-white font-medium text-burgundy focus:ring-burgundy"
                >
                  <option value="ruleBased">Rule-Based Weighted Scoring (Default)</option>
                  <option value="seasonal">Seasonal Climate Synergy</option>
                  <option value="hybrid">Hybrid Multi-Factor Strategy</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5 text-xs text-taupe-dark hover:text-burgundy font-medium underline underline-offset-4"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Discovery Quiz</span>
              </button>
            </div>
          </div>

          {/* Recommended Products Grid */}
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-bronze font-semibold">Matched Creations</span>
              <h3 className="font-serif text-3xl text-charcoal">Your Top Scent Recommendations</h3>
              <p className="text-xs text-taupe-dark mt-1">
                Calculated using algorithmic olfactory harmony scoring.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results?.recommendations?.map(({ product, score, matchReason }) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-bronze/25 p-5 shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Score Ribbon */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-taupe-dark">
                        {product.type.replace('_', ' ')}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                        {score}% Match
                      </span>
                    </div>

                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-cream-warm mb-4">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h4 className="font-serif text-xl font-semibold text-charcoal">
                      {product.name}
                    </h4>

                    <p className="text-xs text-taupe-dark mt-1 line-clamp-2">
                      {product.tagline || product.description}
                    </p>

                    <div className="my-3 p-2.5 rounded-lg bg-cream/70 border border-bronze/20 text-[11px] text-charcoal leading-relaxed">
                      <span className="font-semibold text-bronze-dark">Why it matched: </span>
                      {matchReason}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-taupe/15 flex items-center justify-between mt-3">
                    <span className="font-serif text-lg font-bold text-burgundy">
                      ₹{product.price}
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/products/${product.slug}`}
                        className="p-2 border border-taupe/30 hover:border-burgundy rounded-lg text-taupe-dark hover:text-burgundy transition-colors text-xs"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => addItem(product, 1)}
                        className="px-3.5 py-2 bg-burgundy hover:bg-burgundy-dark text-cream text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
