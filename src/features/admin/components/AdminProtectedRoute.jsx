import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { ShieldAlert } from 'lucide-react';

export function AdminProtectedRoute() {
  const { user, isAdmin, login } = useAuth();

  if (!user || !isAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-white border border-burgundy/30 shadow-2xl text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="font-serif text-2xl text-charcoal">Admin Portal Protected</h2>
        <p className="text-xs text-taupe-dark">
          You must possess verified Master Parfumeur administrative privileges to access this control suite.
        </p>
        <button
          type="button"
          onClick={() => login('admin@pjessence.com', 'admin_key')}
          className="w-full py-3 bg-burgundy hover:bg-burgundy-dark text-cream text-xs font-semibold uppercase tracking-widest rounded-xl transition-colors shadow"
        >
          Sign in as Master Parfumeur Admin
        </button>
      </div>
    );
  }

  return <Outlet />;
}
