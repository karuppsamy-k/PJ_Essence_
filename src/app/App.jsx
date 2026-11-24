import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, useRoutes, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { AuthProvider } from '../features/auth/AuthContext';
import { CartProvider } from '../features/cart/CartContext';
import { routes } from './routes';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        <Sparkles className="w-10 h-10 text-bronze animate-pulse" />
      </div>
      <span className="font-serif text-3xl font-normal text-charcoal tracking-wide">
        PJ ESSENCE
      </span>
      <span className="text-[10px] uppercase tracking-[0.3em] text-bronze mt-1 font-semibold">
        Macerating Bespoke Formula...
      </span>
    </div>
  );
}

function AppContent() {
  const element = useRoutes(routes);
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ScrollToTop />
      {element}
    </Suspense>
  );
}

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
