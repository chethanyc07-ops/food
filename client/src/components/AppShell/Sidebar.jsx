import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  Sparkles,
  Columns3,
  Apple,
  Layers,
  MessageSquareCode,
  History,
  Settings,
  X,
  ShieldCheck,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Recommender', href: '/recommend', icon: Sparkles },
  { name: 'Compare Materials', href: '/compare', icon: Columns3 },
  { name: 'Food Commodities', href: '/commodities', icon: Apple },
  { name: 'Packaging Materials', href: '/materials', icon: Layers },
  { name: 'AI Scientific Chat', href: '/chat', icon: MessageSquareCode },
  { name: 'Evaluation History', href: '/history', icon: History },
  { name: 'Settings & Security', href: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const router = useRouter();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-200 ease-in-out lg:translate-x-0 flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Top Wordmark */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
            <Link href="/" className="flex items-center space-x-2.5">
              <span className="text-xl">🍱</span>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                FoodPack AI
              </span>
            </Link>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Ministry Context Header */}
          <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Regulatory Framework
            </p>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
              MoFPI & FSSAI Standards
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Modules
            </p>

            {navigation.map((item) => {
              const isActive =
                router.pathname === item.href ||
                (item.href !== '/dashboard' && router.pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-emerald-400 dark:text-emerald-600'
                          : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quiet Scientific Footer Card */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="truncate">IS 9845 Migration Certified</span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
            OTR · WVTR · Kinetics Engine
          </p>
        </div>
      </aside>
    </>
  );
}
