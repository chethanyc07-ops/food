import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../../store/authStore';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles }) {
  const router = useRouter();
  const { user, token, initialized } = useAuthStore();

  useEffect(() => {
    // Only evaluate redirect after initial auth determination has finished
    if (!initialized || !router.isReady) return;

    if (!token && router.pathname !== '/login') {
      const redirectUrl = `/login?redirect=${encodeURIComponent(router.asPath || '/dashboard')}`;
      router.replace(redirectUrl);
    }
  }, [initialized, token, router.isReady, router.pathname]);

  // While checking auth, show clean loading UI
  if (!initialized || (!token && typeof window !== 'undefined')) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4 transition-colors">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Authenticating MoFPI Portal Session...</p>
      </div>
    );
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center transition-colors">
        <div className="p-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl max-w-md shadow-lg">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Access Restricted</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">You do not have the required permissions ({allowedRoles.join(', ')}) to view this section.</p>
          <button
            onClick={() => router.replace('/dashboard')}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-sm font-medium transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
}
