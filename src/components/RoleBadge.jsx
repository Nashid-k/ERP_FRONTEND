import React from 'react';
import { ShieldCheck, User } from 'lucide-react';

export const RoleBadge = ({ role }) => {
  if (role === 'SUPER_ADMIN') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
        <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
        Super Admin
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      <User className="w-3.5 h-3.5 text-slate-500" />
      Regular User
    </span>
  );
};
