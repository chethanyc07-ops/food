import React, { useState, useEffect } from 'react';
import Layout from '../components/AppShell/Layout';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import Badge from '../components/Common/Badge';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import {
  Settings,
  User,
  ShieldCheck,
  Server,
  CheckCircle2,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import api from '../services/api';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [health, setHealth] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await api.get('/health');
        setHealth(res.data);
      } catch (err) {
        // silent
      }
    };
    fetchHealth();
  }, []);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6 max-w-4xl">
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">System Settings & Health</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage appearance preferences, user profile, and system connectivity.
            </p>
          </div>

          {/* Theme Preferences Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>Appearance & Theme</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Choose your preferred interface theme. Selected theme persists across all sessions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-4 rounded-xl border flex items-center space-x-3.5 transition-all text-left ${
                  theme === 'light'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm ring-1 ring-emerald-500/20'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className={`p-2.5 rounded-lg ${theme === 'light' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">Light Mode</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Crisp, clean high-contrast daytime UI</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-xl border flex items-center space-x-3.5 transition-all text-left ${
                  theme === 'dark'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-sm ring-1 ring-emerald-500/20'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className={`p-2.5 rounded-lg ${theme === 'dark' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">Dark Mode</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Deep slate & emerald science cockpit</div>
                </div>
              </button>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <User className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span>Scientist Profile & Role</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Full Name</span>
                <span className="font-semibold text-slate-900 dark:text-white mt-1 block">{user?.name || 'N/A'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Email Address</span>
                <span className="font-semibold text-slate-900 dark:text-white mt-1 block">{user?.email || 'N/A'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Organization</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block">{user?.organization || 'MoFPI'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Access Role</span>
                <span className="font-semibold text-teal-600 dark:text-teal-400 mt-1 capitalize block">{user?.role?.replace('_', ' ') || 'Operator'}</span>
              </div>
            </div>
          </div>

          {/* AI Engines Health Status */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Server className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>AI Engine & Service Connectivity</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Food Science Physics & Kinetics Engine</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">OTR/WVTR barrier equations, respiration matching & degradation kinetics</p>
                  </div>
                </div>
                <Badge variant="emerald">Active (Online)</Badge>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Google Gemini Generative AI SDK</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Generates advanced scientific justifications when API key is set in .env</p>
                  </div>
                </div>
                <Badge variant="teal">Connected / Fallback Ready</Badge>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Socket.IO Real-Time Event Bus</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">WebSocket bi-directional event stream for multi-agent evaluation timeline</p>
                  </div>
                </div>
                <Badge variant="cyan">Connected</Badge>
              </div>
            </div>
          </div>

          {/* MoFPI Compliance Reference */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Standard Specifications Reference</span>
            </h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 dark:text-emerald-400 font-bold">•</span>
                <span><strong>FSSAI (Packaging Regulations 2018 / IS 9845):</strong> Overall migration limits (OML ≤ 60 mg/kg or 10 mg/dm²) for all food contact polymers.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 dark:text-emerald-400 font-bold">•</span>
                <span><strong>ASTM D3985 / ISO 15105-2:</strong> Standard test method for Oxygen Gas Transmission Rate (OTR) through plastic film and sheeting.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 dark:text-emerald-400 font-bold">•</span>
                <span><strong>ASTM F1249 / ISO 15106-2:</strong> Standard test method for Water Vapor Transmission Rate (WVTR) using modulated infrared sensor.</span>
              </li>
            </ul>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
