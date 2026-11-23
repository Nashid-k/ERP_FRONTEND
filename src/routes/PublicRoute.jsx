import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, isSuperAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={isSuperAdmin ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return children;
};
