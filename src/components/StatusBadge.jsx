import React from 'react';
import { CheckCircle2, Clock, Ban, Trash2 } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'ACTIVE':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Active
        </span>
      );
    case 'INACTIVE':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <Ban className="w-3.5 h-3.5 text-amber-600" />
          Inactive
        </span>
      );
    case 'INVITED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
          <Clock className="w-3.5 h-3.5 text-sky-600" />
          Invited
        </span>
      );
    case 'BLOCKED':
    case 'DELETED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
          <Ban className="w-3.5 h-3.5 text-rose-600" />
          Blocked
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
          {status}
        </span>
      );
  }
};
