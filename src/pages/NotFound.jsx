import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 text-center">
      <div className="p-4 bg-slate-800 rounded-3xl border border-slate-700 mb-6">
        <FileQuestion className="w-16 h-16 text-slate-400" />
      </div>
      <h1 className="text-3xl font-black text-white tracking-tight">404 - Page Not Found</h1>
      <p className="mt-3 text-slate-400 max-w-md text-sm leading-relaxed">
        The requested ERP route does not exist or may have been relocated.
      </p>
      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </Link>
      </div>
    </div>
  );
};
