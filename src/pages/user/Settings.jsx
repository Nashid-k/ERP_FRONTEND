import React, { useState } from 'react';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { KeyRound, Shield, Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (form.newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }

    if (form.newPassword !== form.confirmNewPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await userService.changePassword(form);
      toast.success(res.message);
      setForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Security & Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your password credentials and inspect authentication session status.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Security summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Security Snapshot</h3>
              <p className="text-xs text-slate-500">ERP Authentication Layer</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Authentication Mode</span>
              <p className="font-semibold text-slate-800">Email & Salted Hashed Password</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Session Security</span>
              <p className="font-semibold text-slate-800">Encrypted JWT Token (7-day validity)</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Last Successful Login</span>
              <p className="font-semibold text-slate-800">
                {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'This Session'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Password Change Form */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Change Authentication Password</h2>
              <p className="text-xs text-slate-500">Provide your current password to choose a new one</p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800 font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={form.currentPassword}
                  onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                New Password (min 8 characters)
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  placeholder="Create new password"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={form.confirmNewPassword}
                onChange={(e) => setForm({ ...form, confirmNewPassword: e.target.value })}
                placeholder="Confirm new password"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
              />
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
