import React from 'react';
import { useAuth } from '../context/AuthContext';
import { RoleBadge } from './RoleBadge';
import { StatusBadge } from './StatusBadge';
import { LogOut, Menu, Building2, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          title="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
            T
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
              TALKISM
              <span className="hidden sm:inline-block text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded">
                Pvt Ltd
              </span>
            </div>
            <div className="text-[11px] font-medium text-slate-500 tracking-wider uppercase mt-0.5 flex items-center gap-1">
              <span>Internal Portal</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400">Ernakulam</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-900 leading-tight">{user.name}</span>
              <span className="text-xs text-slate-500 leading-tight">{user.email}</span>
            </div>
            <RoleBadge role={user.role} />
            <StatusBadge status={user.status} />

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
