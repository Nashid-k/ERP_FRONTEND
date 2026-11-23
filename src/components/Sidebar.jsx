import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  History,
  User,
  KeyRound,
  X,
  Building,
  MapPin
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { isSuperAdmin, user } = useAuth();

  const adminNavItems = [
    { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Talkism Directory', path: '/admin/users', icon: Users },
    { name: 'Audit & Governance', path: '/admin/audit-logs', icon: History }
  ];

  const userNavItems = [
    { name: 'Staff Workspace', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Security & Password', path: '/settings', icon: KeyRound }
  ];

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6 lg:hidden">
          <span className="font-bold text-slate-900">Talkism ERP</span>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-screen justify-between p-4">
          <div className="space-y-6">
            {isSuperAdmin && (
              <div>
                <div className="px-3.5 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Super Admin Management
                </div>
                <nav className="space-y-1">
                  {adminNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink key={item.path} to={item.path} className={navLinkClass} onClick={onClose}>
                        <Icon className="w-4 h-4 shrink-0" />
                        {item.name}
                      </NavLink>
                    );
                  })}
                </nav>
              </div>
            )}

            <div>
              <div className="px-3.5 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Talkism Staff Workspace
              </div>
              <nav className="space-y-1">
                {userNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink key={item.path} to={item.path} className={navLinkClass} onClick={onClose}>
                      <Icon className="w-4 h-4 shrink-0" />
                      {item.name}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* User Footer Card & Ernakulam Office Indicator */}
          <div className="space-y-2">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.department || 'Talkism Personnel'}</p>
                </div>
              </div>
            </div>

            <div className="px-3 py-1.5 text-[10px] text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span>KC Arcade, CSEZ, Ernakulam</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
