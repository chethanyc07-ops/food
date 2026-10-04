import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  Sparkles,
  Scale,
  Apple,
  Layers,
  MessageSquareCode,
  History,
  Settings,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import NotificationDrawer from '../AppShell/NotificationDrawer';
import api from '../../services/api';

const NAV_SECTIONS = [
  {
    title: 'Advisory Engine',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'AI Recommender', href: '/recommend', icon: Sparkles },
      { name: 'Compare Materials', href: '/compare', icon: Scale },
    ],
  },
  {
    title: 'Knowledge Base',
    items: [
      { name: 'Food Commodities', href: '/commodities', icon: Apple },
      { name: 'Packaging Materials', href: '/materials', icon: Layers },
      { name: 'Scientific AI Chat', href: '/chat', icon: MessageSquareCode },
    ],
  },
  {
    title: 'Management',
    items: [
      { name: 'Evaluation History', href: '/history', icon: History },
      { name: 'Settings & Security', href: '/settings', icon: Settings },
    ],
  },
];

export default function DashboardLayout({
  children,
  title,
  subtitle,
  actions,
  breadcrumbs,
}) {
  const router = useRouter();
  const { user, logout, initAuth } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setUnreadCount(res.data?.unreadCount || 0);
      } catch (err) {
        // silent
      }
    };
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/commodities?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isDark = mounted ? theme === 'dark' : true;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ========================================================================= */}
      {/* SIDEBAR NAVIGATION (Desktop Fixed & Mobile Off-Canvas Drawer)            */}
      {/* ========================================================================= */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-200 ease-in-out flex flex-col justify-between ${
          mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Sidebar Brand Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
            <Link
              href="/"
              className={`flex items-center space-x-3 transition-opacity ${
                collapsed ? 'justify-center w-full' : ''
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0 shadow-sm">
                🍱
              </div>
              {!collapsed && (
                <div className="overflow-hidden">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white block leading-tight">
                    FoodPack AI
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono block leading-tight">
                    MoFPI Platform
                  </span>
                </div>
              )}
            </Link>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links List */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-5 no-scrollbar">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title} className="space-y-1">
                {!collapsed && (
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                    {section.title}
                  </p>
                )}
                {section.items.map((item) => {
                  const isActive =
                    router.pathname === item.href ||
                    (item.href !== '/dashboard' && router.pathname.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      title={collapsed ? item.name : undefined}
                      className={`group flex items-center rounded-xl text-xs font-medium transition-all duration-150 ${
                        collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5 space-x-3'
                      } ${
                        isActive
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-semibold shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-emerald-400 dark:text-emerald-600'
                            : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                        }`}
                      />
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Zone */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-2">
          {!collapsed && (
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="truncate">
                <p className="font-semibold text-slate-800 dark:text-slate-200">FSSAI IS 9845</p>
                <p className="text-[10px] text-slate-400">Migration Compliant</p>
              </div>
            </div>
          )}

          {/* Desktop Sidebar Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-mono"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* TOP NAVBAR                                                               */}
      {/* ========================================================================= */}
      <header
        className={`sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-all duration-200 ${
          collapsed ? 'lg:pl-24' : 'lg:pl-[17rem]'
        }`}
      >
        {/* Left: Mobile Menu Toggle & Search Bar */}
        <div className="flex items-center space-x-3 flex-1 max-w-lg">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick Lookup Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search commodities, materials, barrier specs..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
            />
          </form>
        </div>

        {/* Right: Engine Status, Theme, Notifications & User */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Telemetry Status Indicator */}
          <div className="hidden md:flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-mono pr-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
            <span>5-Agent Core Calibrated</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 hover:text-amber-300 transition" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 hover:text-slate-900 transition" />
            )}
          </button>

          {/* Notification Trigger */}
          <button
            onClick={() => setNotificationsOpen(true)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          {/* User Profile Pill */}
          {user ? (
            <div className="flex items-center space-x-2 pl-1">
              <Link
                href="/settings"
                className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
                title="Profile Settings"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-xs font-mono">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden xl:block">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[110px] leading-tight">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize leading-tight">
                    {user.role?.replace('_', ' ')}
                  </p>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA                                                         */}
      {/* ========================================================================= */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Optional Page Header with Breadcrumbs & Actions */}
          {(title || breadcrumbs || actions) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                {breadcrumbs && (
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono mb-1">
                    {breadcrumbs.map((crumb, idx) => (
                      <React.Fragment key={crumb.label || idx}>
                        {idx > 0 && <span>/</span>}
                        {crumb.href ? (
                          <Link href={crumb.href} className="hover:text-slate-700 dark:hover:text-slate-200">
                            {crumb.label}
                          </Link>
                        ) : (
                          <span className="text-slate-700 dark:text-slate-300 font-medium">{crumb.label}</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
                {title && (
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>

              {actions && <div className="flex items-center space-x-2 shrink-0">{actions}</div>}
            </div>
          )}

          {children}
        </main>

        {/* Clean Scientific Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-4 px-6 text-center text-xs text-slate-500">
          <p>
            Ministry of Food Processing Industries (MoFPI) · Intelligent Food Packaging Material Recommendation System
          </p>
          <p className="font-mono text-[10px] text-slate-400 mt-0.5">
            ASTM D3985 OTR · ASTM F1249 WVTR · FSSAI IS 9845 Compliance
          </p>
        </footer>
      </div>

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onRefreshCount={(count) => setUnreadCount(count)}
      />
    </div>
  );
}
