/**
 * Authentication & Identity Service
 * Seamlessly interfaces with Firebase Auth or Mock Auth.
 */

const AUTH_STORAGE_KEY = 'pj_essence_auth_user_v1';

export const authService = {
  getCurrentUser() {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}

    // Default guest session
    return {
      id: 'usr_guest_demo',
      email: 'guest@pjessence.com',
      name: 'Guest Client',
      role: 'CUSTOMER',
      isGuest: true,
    };
  },

  async login(email, password) {
    await new Promise(r => setTimeout(r, 120));

    // Admin backdoor demo credential
    if (email.toLowerCase().includes('admin')) {
      const adminUser = {
        id: 'usr_admin_master',
        email: 'admin@pjessence.com',
        name: 'Master Parfumeur Admin',
        role: 'ADMIN',
        token: 'mock_admin_jwt_token',
        isGuest: false,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
      return adminUser;
    }

    // Standard customer user
    const customerUser = {
      id: `usr_${Date.now()}`,
      email: email.trim(),
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      role: 'CUSTOMER',
      token: 'mock_customer_jwt_token',
      isGuest: false,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(customerUser));
    return customerUser;
  },

  async signup(name, email, password) {
    await new Promise(r => setTimeout(r, 120));
    const user = {
      id: `usr_${Date.now()}`,
      email: email.trim(),
      name: name.trim(),
      role: 'CUSTOMER',
      token: 'mock_customer_jwt_token',
      isGuest: false,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  async logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return true;
  },

  isAdmin(user) {
    return user && user.role === 'ADMIN';
  }
};
