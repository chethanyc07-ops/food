import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Scale,
  MessageSquareCode,
  ArrowRight,
  Sun,
  Moon,
  Layers,
  Activity,
  Check,
  ChevronRight,
  FileCheck2,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const SAMPLE_PRESETS = [
  {
    id: 'paneer',
    name: 'Fresh Paneer (Cottage Cheese)',
    category: 'Dairy',
    baseline: 6,
    optimal: 'PA/EVOH/PE Multi-layer Pouch (MAP N2 flush)',
    predictedDays: 28,
    multiplier: '4.6x',
    keyFactor: 'Critical oxygen barrier (OTR < 1.0) prevents lipolytic rancidity',
  },
  {
    id: 'mangoes',
    name: 'Alphonso Mangoes (Ratnagiri Fresh)',
    category: 'Fresh Produce',
    baseline: 8,
    optimal: 'Laser-Microperforated Bio-PLA Active Film',
    predictedDays: 24,
    multiplier: '3.0x',
    keyFactor: 'Controlled respiration equilibrium avoids anaerobic ethanol buildup',
  },
  {
    id: 'turmeric',
    name: 'Salem Turmeric Powder (GI Tagged)',
    category: 'Spices',
    baseline: 90,
    optimal: 'Metallized PET / Cast Polypropylene (Met-PET/CPP)',
    predictedDays: 365,
    multiplier: '4.0x',
    keyFactor: '0% Light transmission preserves curcumin bioactive pigment',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const [activePreset, setActivePreset] = useState(SAMPLE_PRESETS[0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === 'dark' : true;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 transition-colors">
      {/* Top Bar Contract: Zone 1 (Brand) - Zone 2 (Nav) - Zone 3 (Actions) */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Zone 1: Single text wordmark */}
          <Link href="/" className="flex items-center space-x-2.5">
            <span className="text-xl">🍱</span>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
              FoodPack AI
            </span>
          </Link>

          {/* Zone 2: 4-5 Clean Text Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-400">
            <Link href="/recommend" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Recommender
            </Link>
            <Link href="/compare" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Compare Materials
            </Link>
            <Link href="/commodities" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Food Database
            </Link>
            <Link href="/materials" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Barrier Specs
            </Link>
            <Link href="/chat" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              AI Assistant
            </Link>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {user ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold rounded-xl text-xs shadow-sm hover:opacity-95 transition flex items-center space-x-1.5"
              >
                <span>Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-sm transition"
                >
                  Launch App
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Quiet Editorial Kicker */}
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
              Ministry of Food Processing Industries (MoFPI) · AI Recommendation Engine
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] [text-wrap:balance]">
              Intelligent Food Packaging Material Recommendation System
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed [text-wrap:balance]">
              Eliminate spoilage and maximize shelf life. Our 5-agent AI engine models gas permeability (OTR),
              moisture sorption (WVTR), and light kinetics to rank optimal packaging materials with full FSSAI compliance.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/recommend"
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm shadow-sm transition active:scale-95 flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start AI Evaluation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/compare"
                className="px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold rounded-xl text-sm transition shadow-sm flex items-center space-x-2"
              >
                <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Compare Materials</span>
              </Link>
            </div>

            {/* Proof Metrics Ribbon */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto text-left">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
                  3.8x
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Avg Shelf Life Extension</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">ASTM D3985 Verified</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-3xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
                  99.8%
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">FSSAI Safety Compliance</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">IS 9845 Migration Tests</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
                  5-Agent
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Kinetics Modeling Core</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">OTR · WVTR · Temp</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-3xl font-bold font-mono tracking-tight text-teal-600 dark:text-teal-400 tabular-nums">
                  10
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">High-Barrier Materials</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Multi-layer & Bio-PLA</p>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Sandbox */}
          <div className="mt-20 max-w-4xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  Live Interactive Benchmark
                </p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  Explore Barrier Kinetics across Perishable Commodities
                </h3>
              </div>

              {/* Functional Segmented Controls */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {SAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setActivePreset(preset)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      activePreset.id === preset.id
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {preset.category}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Selected Commodity</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{activePreset.name}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                    Recommended Optimal Material
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {activePreset.optimal}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {activePreset.keyFactor}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center flex flex-col justify-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 font-mono">
                  Predicted Extension
                </span>
                <div className="my-2">
                  <span className="text-4xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {activePreset.predictedDays}
                  </span>
                  <span className="text-xs font-mono text-emerald-700 dark:text-emerald-300 ml-1.5 uppercase">Days</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {activePreset.multiplier} vs {activePreset.baseline} days baseline
                </p>
                <Link
                  href={`/recommend?commodityId=${activePreset.id}`}
                  className="mt-4 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition inline-flex items-center justify-center space-x-1"
                >
                  <span>Run Full Evaluation</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Agent Architecture Section (Natural Editorial Numbering) */}
      <section className="py-20 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Multi-Agent Scientific Pipeline
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
              Five Cooperating Specialized Agents
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              Each degradation pathway is isolated and verified by specialized mathematical models.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">01</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">Planner Agent</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Identifies primary food vulnerability: respiration rate, fat oxidation, moisture sorption, or light degradation.
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-4">ASTM Kinetics</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">02</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">Barrier Agent</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Screens candidate polymers against ASTM D3985 OTR and ASTM F1249 WVTR transmission thresholds.
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-4">Permeability Matrix</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">03</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">Kinetics Agent</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Calculates predicted shelf-life extension curves with active gas flushing (MAP) multipliers.
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-4">Decay Modeling</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">04</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">Compliance Agent</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Verifies FSSAI IS 9845 overall migration limits and sub-zero storage temperature tolerances.
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-4">IS 9845 · Safety</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-lime-600 dark:text-lime-400">05</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">Circularity Agent</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Balances polymer commercial cost index against biodegradability (EN 13432) and recyclability scores.
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-4">Bio-Economy Index</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Modules */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Recommendation Wizard</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Select from verified food commodities or input custom gas requirements to generate multi-criteria ranked packaging solutions.
              </p>
            </div>
            <Link href="/recommend" className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-6 hover:underline">
              <span>Open Recommender</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Side-by-Side Comparison</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Inspect barrier trade-offs across 2-4 candidate materials simultaneously with interactive radar charts and shelf-life multipliers.
              </p>
            </div>
            <Link href="/compare" className="inline-flex items-center text-xs font-bold text-teal-600 dark:text-teal-400 mt-6 hover:underline">
              <span>Launch Matrix Comparison</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
                <MessageSquareCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Scientific Chat Agent</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Pose technical questions in natural language. The agent synthesizes barrier physics, polymer mechanics, and regulatory compliance.
              </p>
            </div>
            <Link href="/chat" className="inline-flex items-center text-xs font-bold text-cyan-600 dark:text-cyan-400 mt-6 hover:underline">
              <span>Consult Scientific Agent</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Clean Scientific Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>Ministry of Food Processing Industries (MoFPI) · Intelligent Food Packaging Material Recommendation System</p>
        <p className="mt-1 font-mono text-[11px] text-slate-400">ASTM D3985 · ASTM F1249 · FSSAI IS 9845 Compliance</p>
      </footer>
    </div>
  );
}
