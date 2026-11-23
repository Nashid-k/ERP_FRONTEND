import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 text-center">
      <div className="p-4 bg-rose-500/10 rounded-3xl border border-rose-500/20 mb-6">
        <ShieldAlert className="w-16 h-16 text-rose-500" />
      </div>
      <h1 className="text-3xl font-black text-white tracking-tight">403 - Access Prohibited</h1>
      <p className="mt-3 text-slate-400 max-w-md text-sm leading-relaxed">
        You do not possess the required Super Admin privileges to view this section of the ERP system.
      </p>
      <div className="mt-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Return to My Dashboard
        </Link>
      </div>
    </div>
  );
};
