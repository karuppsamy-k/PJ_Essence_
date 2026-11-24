import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Sparkles, Menu, X, Shield, Search, Compass, ChevronDown } from 'lucide-react';
import { useCart } from '../../features/cart/CartContext';
import { useAuth } from '../../features/auth/AuthContext';

export function Header() {
  const { itemCount, setIsCartOpen } = useCart();
  const { user, isAdmin, openAuth } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Discover Notes', path: '/discover' },
    { label: 'Scent Quiz', path: '/quiz', highlight: true },
    { label: 'Winter Edition', path: '/collection/winter' },
    { label: 'Pure Attars', path: '/products?type=ATTAR' },
    { label: 'Creations', path: '/products' },
    { label: 'Bespoke Atelier', path: '/custom-perfume', badge: 'Custom' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-cream/90 backdrop-blur-md border-b border-bronze/20 transition-all">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-charcoal text-cream-light py-1.5 px-4 text-[11px] tracking-widest uppercase flex items-center justify-between border-b border-bronze/20">
        <div className="hidden sm:flex items-center gap-2 mx-auto">
          <Sparkles className="w-3 h-3 text-bronze" />
          <span>Complimentary White-Glove Courier on Orders Over ₹150</span>
          <span className="text-bronze">•</span>
          <Link to="/products?type=ATTAR" className="text-bronze hover:text-bronze-light transition-colors underline underline-offset-2">
            Explore 100% Pure Artisanal Attars
          </Link>
        </div>
        <div className="sm:hidden mx-auto flex items-center gap-1.5 text-center">
          <Sparkles className="w-3 h-3 text-bronze" />
          <span>Haute Parfumerie &amp; Pure Attars</span>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-charcoal hover:text-burgundy transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Brand Crest & Logo */}
        <div className="flex flex-col items-center lg:items-start">
          <Link to="/" className="group flex flex-col items-center lg:items-start text-center lg:text-left">
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.2em] font-semibold text-charcoal group-hover:text-burgundy transition-colors">
              PJ ESSENCE
            </span>
            <span className="text-[9px] uppercase tracking-[0.35em] text-bronze font-medium -mt-1">
              Haute Parfumerie &amp; Attars • Paris &amp; Grasse
            </span>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-xs uppercase tracking-widest font-medium transition-all relative py-1.5 ${
                  isActive
                    ? 'text-burgundy font-semibold'
                    : 'text-charcoal hover:text-burgundy'
                } ${link.highlight ? 'text-bronze font-semibold flex items-center gap-1' : ''}`
              }
            >
              {link.highlight && <Compass className="w-3.5 h-3.5 text-bronze animate-pulse" />}
              {link.label}
              {link.badge && (
                <span className="ml-1 text-[9px] bg-burgundy/10 text-burgundy border border-burgundy/20 px-1.5 py-0.2 rounded font-semibold uppercase">
                  {link.badge}
                </span>
              )}
            </NavLink>
          ))}

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-1 text-xs uppercase tracking-widest font-semibold px-2.5 py-1 rounded-md border ${
                  isActive
                    ? 'bg-burgundy text-cream border-burgundy'
                    : 'bg-burgundy/10 text-burgundy border-burgundy/30 hover:bg-burgundy hover:text-cream transition-colors'
                }`
              }
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </NavLink>
          )}
        </nav>

        {/* Right Tools: Search, Account, Cart */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-charcoal hover:text-burgundy transition-colors rounded-full hover:bg-cream-dark/50"
            title="Search fragrances"
          >
            <Search className="w-5 h-5" />
          </button>

          {user && !user.isGuest ? (
            <Link
              to="/account"
              className="p-2 text-charcoal hover:text-burgundy transition-colors rounded-full hover:bg-cream-dark/50 flex items-center gap-1 text-xs"
              title="Your Account"
            >
              <User className="w-5 h-5 text-burgundy" />
              <span className="hidden xl:inline text-xs font-medium text-charcoal">
                {user.name?.split(' ')[0]}
              </span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => openAuth('login')}
              className="p-2 text-charcoal hover:text-burgundy transition-colors rounded-full hover:bg-cream-dark/50"
              title="Sign in"
            >
              <User className="w-5 h-5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 bg-burgundy hover:bg-burgundy-dark text-cream-light rounded-full shadow-luxury transition-all active:scale-95 flex items-center justify-center"
            title="View Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-bronze text-charcoal text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-cream">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Search Drawer */}
      {searchOpen && (
        <div className="bg-white/95 backdrop-blur-md border-b border-bronze/25 px-4 py-3 shadow-luxury transition-all">
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
            <Search className="w-4 h-4 text-bronze flex-shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by notes (e.g. oud, attar, rose, neroli) or title..."
              className="w-full bg-transparent border-none text-xs sm:text-sm text-charcoal placeholder-taupe focus:ring-0"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-burgundy text-cream text-[11px] uppercase tracking-wider rounded font-medium hover:bg-burgundy-dark"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-1 text-taupe-dark hover:text-charcoal"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cream-light border-b border-taupe/20 px-6 py-6 space-y-4 shadow-xl">
          <div className="space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm uppercase tracking-wider font-medium text-charcoal hover:text-burgundy py-1.5"
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm uppercase tracking-wider font-semibold text-burgundy py-1.5"
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}

            <div className="pt-4 border-t border-taupe/20 flex flex-col gap-2">
              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-wider text-charcoal py-1"
              >
                Account &amp; Orders
              </Link>
              <Link
                to="/quiz"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-burgundy text-cream text-xs font-semibold uppercase tracking-widest rounded-lg shadow"
              >
                Take Natural Scent Quiz
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
