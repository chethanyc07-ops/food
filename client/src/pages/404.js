import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function Custom404() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl mb-4 shadow-lg shadow-emerald-500/10">
        🍱
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight">404</h1>
      <p className="text-base font-semibold text-slate-700 dark:text-slate-300 mt-2">Page Not Found</p>
      <p className="text-xs text-slate-500 max-w-sm mt-1">
        The requested resource or food packaging module could not be found.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Link
          href="/"
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center space-x-1.5 shadow-md shadow-emerald-500/20"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <Link
          href="/dashboard"
          className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl text-xs transition flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
