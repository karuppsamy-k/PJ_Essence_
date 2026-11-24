import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

  const login = async (email, password) => {
    const loggedIn = await authService.login(email, password);
    setUser(loggedIn);
    setIsAuthModalOpen(false);
    return loggedIn;
  };

  const signup = async (name, email, password) => {
    const signedUp = await authService.signup(name, email, password);
    setUser(signedUp);
    setIsAuthModalOpen(false);
    return signedUp;
  };

  const logout = async () => {
    await authService.logout();
    setUser(authService.getCurrentUser());
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuth = () => {
    setIsAuthModalOpen(false);
  };

  const isAdmin = authService.isAdmin(user);

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, signup, logout, openAuth, closeAuth, isAuthModalOpen, authMode, setAuthMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
