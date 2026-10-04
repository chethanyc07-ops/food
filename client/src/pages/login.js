import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck, UserCheck, Sun, Moon } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, token, initialized, login, loading, error, clearError } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setMounted(true);
    if (initialized && token && router.isReady) {
      const redirect = router.query.redirect || '/dashboard';
      router.replace(redirect);
    }
  }, [initialized, token, router.isReady, router.query.redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    if (!email || !password) {
      setValidationError('Please enter both email and password.');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      const redirect = router.query.redirect || '/dashboard';
      router.replace(redirect);
    }
  };

  const handleInstantLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setValidationError('');
    const result = await login(demoEmail, demoPassword);
    if (result.success) {
      const redirect = router.query.redirect || '/dashboard';
      router.replace(redirect);
    }
  };

  const isDark = mounted ? theme === 'dark' : true;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-emerald-500 selection:text-slate-950 transition-colors relative">
      {/* Top Bar with Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition shadow-sm"
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2.5 mb-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl shadow-sm">
              🍱
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              FoodPack AI
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sign In to Intelligence Portal
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ministry of Food Processing Industries (MoFPI) Research Platform
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
          {/* Errors */}
          {(error || validationError) && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {error || validationError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                WORK EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@mofpi.gov.in"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-sm transition active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Instant Demo Authentication */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] uppercase font-semibold text-slate-400 font-mono mb-2.5 tracking-wider text-center">
              1-Click Demo Evaluation Profiles
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleInstantLogin('admin@mofpi.gov.in', 'Password@123')}
                disabled={loading}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-left transition"
              >
                <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">Admin MoFPI</span>
                </div>
                <span className="text-[10px] text-slate-400 block truncate font-mono">admin@mofpi.gov.in</span>
              </button>

              <button
                type="button"
                onClick={() => handleInstantLogin('priya@foodpack.org', 'Password@123')}
                disabled={loading}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-left transition"
              >
                <div className="flex items-center space-x-1.5 text-teal-600 dark:text-teal-400 mb-0.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">Scientist Demo</span>
                </div>
                <span className="text-[10px] text-slate-400 block truncate font-mono">priya@foodpack.org</span>
              </button>
            </div>
          </div>
        </div>

        {/* Register Footer */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          Don't have an account yet?{' '}
          <Link href="/register" className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
