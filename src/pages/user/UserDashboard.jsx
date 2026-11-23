import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../../components/RoleBadge';
import { StatusBadge } from '../../components/StatusBadge';
import {
  User,
  Shield,
  KeyRound,
  CheckCircle2,
  Calendar,
  Building2,
  Phone,
  Mail,
  ArrowRight,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">
              <Building2 className="w-3.5 h-3.5 text-blue-200" />
              Talkism Private Limited • Staff Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome, {user?.name}!
            </h1>
            <p className="text-blue-100 text-sm max-w-xl leading-relaxed">
              Your authorized Talkism staff profile is active. You are assigned to the <strong>{user?.department || 'General'}</strong> team at our Ernakulam Hub.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <div className="w-12 h-12 rounded-xl bg-white text-blue-700 flex items-center justify-center font-bold text-xl">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="pr-2">
              <div className="text-xs font-semibold">{user?.email}</div>
              <div className="mt-1 flex items-center gap-1.5">
                <RoleBadge role={user?.role} />
                <StatusBadge status={user?.status} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Status</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Active & Authorized
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Email verified on activation. Your login credentials are valid.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Department</span>
            <Building2 className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">
              {user?.department || 'General'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Phone: {user?.phone || 'Not configured'}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Member Since</span>
            <Calendar className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Last Login: {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Current Session'}
            </p>
          </div>
        </div>
      </div>

      {/* Policy and Access Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong>Access Governance Notice:</strong> In accordance with corporate ERP security policies, your role, authorization scope, and account lifecycle are centrally managed by the Super Admin. You may update your profile details and change your password, but administrative actions (user creation, deletion, and role reassignment) are restricted.
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link
          to="/profile"
          className="group p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Manage Profile</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your display name, contact phone, and bio notes.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/settings"
          className="group p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Security & Password</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your authentication password and view session security.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
};
