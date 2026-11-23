import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { PublicRoute } from './PublicRoute';
import { Layout } from '../components/Layout';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { AcceptInvitation } from '../pages/auth/AcceptInvitation';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { UserManagement } from '../pages/admin/UserManagement';
import { AuditLogs } from '../pages/admin/AuditLogs';

// User Pages
import { UserDashboard } from '../pages/user/UserDashboard';
import { Profile } from '../pages/user/Profile';
import { Settings } from '../pages/user/Settings';

// Fallback Pages
import { Unauthorized } from '../pages/Unauthorized';
import { NotFound } from '../pages/NotFound';

export const AppRoutes = () => {
  const { isAuthenticated, isSuperAdmin } = useAuth();

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={isSuperAdmin ? '/admin/dashboard' : '/dashboard'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route path="/accept-invitation" element={<AcceptInvitation />} />
      <Route path="/verify-email" element={<AcceptInvitation />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected ERP Shell */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Super Admin Restricted Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <AdminRoute>
              <AuditLogs />
            </AdminRoute>
          }
        />

        {/* Regular User & Shared Workspace Routes */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Access Denied and Catch-all */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
