import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';

export function AuthModal() {
  const { isAuthModalOpen, closeAuth, authMode, setAuthMode, login, signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await signup(fullName, email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    try {
      await login('admin@pjessence.com', 'admin_secure_key');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCustomer = async () => {
    setLoading(true);
    try {
      await login('genevieve@luxury.fr', 'client_password');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuth}
          className="fixed inset-0 bg-charcoal/65 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-cream-light rounded-2xl shadow-2xl border border-bronze/30 p-8 z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={closeAuth}
            className="absolute top-5 right-5 p-1.5 text-taupe-dark hover:text-charcoal rounded-full hover:bg-cream-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Crest */}
          <div className="text-center mb-6">
            <span className="text-[10px] uppercase tracking-widest text-bronze font-semibold">PJ Essence Atelier</span>
            <h3 className="font-serif text-3xl text-charcoal mt-1">
              {authMode === 'login' ? 'Client Access' : 'Create Sanctuary Account'}
            </h3>
            <p className="text-xs text-taupe-dark mt-1">
              {authMode === 'login'
                ? 'Welcome back to your personal fragrance portfolio.'
                : 'Join our haute parfumerie circle for bespoke formulation access.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-taupe-dark" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Lady Eleanor Vance"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-taupe/30 bg-white text-xs focus:ring-1 focus:ring-burgundy focus:border-burgundy"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-taupe-dark" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="eleanor@vance-estate.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-taupe/30 bg-white text-xs focus:ring-1 focus:ring-burgundy focus:border-burgundy"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-taupe-dark font-medium mb-1.5">
                Passphrase
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-taupe-dark" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-taupe/30 bg-white text-xs focus:ring-1 focus:ring-burgundy focus:border-burgundy"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-burgundy hover:bg-burgundy-dark text-cream-light font-semibold uppercase tracking-widest text-xs rounded-xl shadow-luxury transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : authMode === 'login' ? 'Enter Sanctuary' : 'Register Account'}
            </button>
          </form>

          {/* Quick Demo Credentials for Fast Evaluation */}
          <div className="mt-6 pt-5 border-t border-taupe/20">
            <span className="text-[10px] uppercase tracking-wider text-taupe-dark font-semibold block text-center mb-3">
              Fast Demo Switcher
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoCustomer}
                className="p-2 rounded-lg border border-taupe/30 bg-white/70 hover:bg-white text-[11px] font-medium text-charcoal flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-bronze" /> Demo Customer
              </button>
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="p-2 rounded-lg border border-burgundy/30 bg-burgundy/5 hover:bg-burgundy/10 text-[11px] font-medium text-burgundy flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-burgundy" /> Master Admin
              </button>
            </div>
          </div>

          {/* Switch Mode */}
          <div className="mt-5 text-center text-xs text-taupe-dark">
            {authMode === 'login' ? (
              <>
                New to the Atelier?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="font-semibold text-burgundy hover:underline ml-1"
                >
                  Create bespoke account
                </button>
              </>
            ) : (
              <>
                Already possess an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="font-semibold text-burgundy hover:underline ml-1"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
