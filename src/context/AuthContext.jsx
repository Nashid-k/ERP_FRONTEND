import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('erp_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('erp_token') || null);
  const [loading, setLoading] = useState(true);

  // Synchronize and verify session on initial mount
  const checkAuth = useCallback(async () => {
    const currentToken = localStorage.getItem('erp_token');
    if (!currentToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const data = await authService.getMe();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('erp_user', JSON.stringify(data.user));
      } else {
        throw new Error('User not found');
      }
    } catch (err) {
      console.warn('Session verification failed:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Listen for custom logout events triggered by interceptor
    const handleAuthLogout = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth_logout', handleAuthLogout);
    return () => window.removeEventListener('auth_logout', handleAuthLogout);
  }, [checkAuth]);

  // Login handler
  const login = (newToken, newUser) => {
    localStorage.setItem('erp_token', newToken);
    localStorage.setItem('erp_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  // Logout handler
  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem('erp_token');
      localStorage.removeItem('erp_user');
      setToken(null);
      setUser(null);
    }
  };

  // Update user in state and storage
  const updateUserContext = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('erp_user', JSON.stringify(updated));
      return updated;
    });
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isSuperAdmin,
        login,
        logout,
        updateUserContext,
        refreshUser: checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
