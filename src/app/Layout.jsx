import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../features/cart/components/CartDrawer';
import { AuthModal } from '../components/shared/AuthModal';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-charcoal font-sans antialiased">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <AuthModal />
    </div>
  );
}
