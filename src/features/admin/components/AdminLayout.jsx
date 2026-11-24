import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Compass,
  Calendar,
  Image as ImageIcon,
  ArrowLeft,
  Shield,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

export function AdminLayout() {
  const { user } = useAuth();

  const links = [
    { label: 'Overview Metrics', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Products & Stock', path: '/admin/products', icon: Package },
    { label: 'Orders & State Machine', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Client Profiles', path: '/admin/customers', icon: Users },
    { label: 'Quiz & Logic Rules', path: '/admin/quiz', icon: Compass },
    { label: 'Seasonal Campaigns', path: '/admin/seasonal', icon: Calendar },
    { label: 'Media Asset Vault', path: '/admin/media', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-cream/50 flex flex-col">
      {/* Admin Top Navigation */}
      <header className="bg-charcoal text-cream border-b border-bronze/30 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-cream hover:text-bronze-light transition-colors flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span>Storefront</span>
          </Link>
          <span className="text-taupe-dark">|</span>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-bronze" />
            <span className="font-serif text-lg tracking-wider text-cream font-semibold">
              PJ ESSENCE ATELIER ADMIN
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-taupe-light">
          <span>Logged in as: <strong className="text-cream">{user?.name || 'Administrator'}</strong></span>
          <Link
            to="/products"
            target="_blank"
            className="hidden sm:flex items-center gap-1 text-bronze hover:underline"
          >
            <span>Live Catalog</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white/70 border-r border-taupe/20 p-6 space-y-6 flex-shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-bronze font-bold block mb-3">
              Management Suite
            </span>
            <nav className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.exact}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                        isActive
                          ? 'bg-burgundy text-cream shadow-sm'
                          : 'text-charcoal hover:bg-cream-warm hover:text-burgundy'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-taupe/20">
            <div className="p-3.5 rounded-xl bg-cream-warm/70 border border-bronze/20 text-[11px] text-taupe-dark space-y-1">
              <span className="font-bold text-charcoal block">Repository Mode:</span>
              <p>Active In-Memory / LocalStorage Mock with Firebase Adapter Architecture</p>
            </div>
          </div>
        </aside>

        {/* Main Admin View Content */}
        <main className="flex-1 p-6 sm:p-10 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
