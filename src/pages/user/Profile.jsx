import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { RoleBadge } from '../../components/RoleBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { Lock, Save, CheckCircle2 } from 'lucide-react';

export const Profile = () => {
  const { user, updateUserContext } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: '',
    bio: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userService.getMyProfile();
        if (res.success && res.user) {
          setFormData({
            name: res.user.name || '',
            phone: res.user.phone || '',
            department: res.user.department || '',
            bio: res.user.bio || ''
          });
        }
      } catch (err) {
        toast.error('Failed to load profile data');
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await userService.updateMyProfile(formData);
      toast.success(res.message);
      updateUserContext(res.user);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          View your authorized account credentials and update permitted personal details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Account Identity Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-3xl mx-auto shadow-lg shadow-blue-500/20">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{user?.name}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{user?.email}</p>
            </div>
            <div className="flex justify-center gap-2 pt-1">
              <RoleBadge role={user?.role} />
              <StatusBadge status={user?.status} />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-400">Email Verification:</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-400">Account ID:</span>
              <span className="font-mono text-[11px] text-slate-700">{user?._id?.slice(-8)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-400">Registered On:</span>
              <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed">
            <Lock className="w-3.5 h-3.5 text-slate-400 inline mr-1 -mt-0.5" />
            Email and role allocations are governed by Talkism Private Limited Administration, Ernakulam.
          </div>
        </div>

        {/* Right Column: Editable Permitted Profile Form */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-5">Edit Profile Information</h2>

          {isFetching ? (
            <div className="py-12 text-center text-slate-400 text-xs">Loading profile fields...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Authorized Email Address (Locked)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-mono cursor-not-allowed"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Assigned Role (Locked)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled
                      value={user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Regular User'}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 555-0123"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Department / Office
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Sales & Logistics"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Professional Bio / Notes
                </label>
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief note about your role or specialization"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                />
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
