import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/AppShell/Layout';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import MaterialScoreCard from '../../components/Recommendation/MaterialScoreCard';
import ExportPdfButton from '../../components/Common/ExportPdfButton';
import { useCommodityStore } from '../../store/commodityStore';
import { useRecommendationStore } from '../../store/recommendationStore';
import {
  Sparkles,
  ShieldCheck,
  DollarSign,
  Leaf,
  Loader2,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RecommendPage() {
  const router = useRouter();
  const { commodities, fetchCommodities } = useCommodityStore();
  const {
    generateRecommendation,
    currentRecommendation,
    isGenerating,
    error,
    clearCurrent,
  } = useRecommendationStore();

  const [selectedCommodityId, setSelectedCommodityId] = useState('');
  const [priorities, setPriorities] = useState({
    protection: 50,
    cost: 25,
    sustainability: 25,
  });
  const [targetMarket, setTargetMarket] = useState('Domestic Retail');
  const [preferredPackageType, setPreferredPackageType] = useState('Any Format');

  useEffect(() => {
    fetchCommodities();
    if (router.query.commodityId) {
      setSelectedCommodityId(router.query.commodityId);
    }
  }, [router.query.commodityId]);

  const selectedCommodity = commodities.find((c) => c._id === selectedCommodityId);

  const handlePriorityChange = (key, val) => {
    setPriorities((prev) => ({ ...prev, [key]: Number(val) }));
  };

  const handleGenerate = async () => {
    if (!selectedCommodityId) return;

    const res = await generateRecommendation({
      commodityId: selectedCommodityId,
      priorities,
      targetMarket,
      preferredPackageType,
    });

    if (res.success) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) { }
    }
  };

  const handleCompare = (materialId) => {
    router.push(`/compare?commodityId=${selectedCommodityId}&materialId=${materialId}`);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Packaging Material Recommendation Wizard
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Multi-agent engine calibrating barrier kinetics against specific food commodity degradation mechanisms.
              </p>
            </div>

            {currentRecommendation && (
              <div className="flex items-center space-x-2">
                <ExportPdfButton recommendation={currentRecommendation} />
                <button
                  onClick={() => clearCurrent()}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition"
                  title="Start Over"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Generator Wizard Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left: Configuration Form (1 Col) */}
            <div className="lg:col-span-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2 font-mono">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">01.</span>
                <span className="font-sans">Target Food Commodity</span>
              </h3>

              {/* Commodity Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Select Food Commodity
                </label>
                <select
                  value={selectedCommodityId}
                  onChange={(e) => setSelectedCommodityId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none transition"
                >
                  <option value="">-- Choose Perishable Item --</option>
                  {commodities.map((comm) => (
                    <option key={comm._id} value={comm._id}>
                      {comm.name} ({comm.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Commodity Profile Snapshot */}
              {selectedCommodity && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-200">{selectedCommodity.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono">· {selectedCommodity.category}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono pt-1">
                    <div>Baseline: <strong className="text-slate-800 dark:text-slate-200 tabular-nums">{selectedCommodity.baselineShelfLifeDays}d</strong></div>
                    <div>Storage: <strong className="text-slate-800 dark:text-slate-200 font-sans">{selectedCommodity.storageCondition?.split(' ')[0]}</strong></div>
                    <div>O₂ Risk: <strong className="text-emerald-600 dark:text-emerald-400 font-sans">{selectedCommodity.oxygenSensitivity}</strong></div>
                    <div>Moisture: <strong className="text-teal-600 dark:text-teal-400 font-sans">{selectedCommodity.moistureSensitivity}</strong></div>
                  </div>
                </div>
              )}

              {/* Step 2: Priorities */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2 font-mono">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">02.</span>
                  <span className="font-sans">Decision Weights</span>
                </h3>

                {/* Protection Slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Barrier & Spoilage Prevention
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">{priorities.protection}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priorities.protection}
                    onChange={(e) => handlePriorityChange('protection', e.target.value)}
                    className="w-full accent-emerald-500 bg-slate-200 dark:bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Cost Slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                      Commercial Cost Efficiency
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">{priorities.cost}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priorities.cost}
                    onChange={(e) => handlePriorityChange('cost', e.target.value)}
                    className="w-full accent-amber-500 bg-slate-200 dark:bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Sustainability Slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5 text-teal-500" />
                      Circularity & Compostability
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">{priorities.sustainability}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priorities.sustainability}
                    onChange={(e) => handlePriorityChange('sustainability', e.target.value)}
                    className="w-full accent-teal-500 bg-slate-200 dark:bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Step 3: Logistics Parameters */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Target Market Distribution</label>
                  <select
                    value={targetMarket}
                    onChange={(e) => setTargetMarket(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Domestic Retail">Domestic Retail Market</option>
                    <option value="Cold Chain Interstate">Cold Chain Interstate Transit</option>
                    <option value="Export Marine/Air Freight">Global Export Marine Freight</option>
                    <option value="Local Artisan/Direct">Local Farm Direct / Artisan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Preferred Packaging Style</label>
                  <select
                    value={preferredPackageType}
                    onChange={(e) => setPreferredPackageType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Any Format">Any Format (Optimal Physics Match)</option>
                    <option value="Flexible Pouch">Flexible High-Barrier Pouch</option>
                    <option value="Vacuum Pack">Vacuum Shrink Pack</option>
                    <option value="MAP Gas Flush Tray">Thermoformed MAP Gas Flush Tray</option>
                    <option value="Biodegradable Film">Compostable Bio-film</option>
                    <option value="Glass / Can">Glass Jar / Hermetic Can</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!selectedCommodityId || isGenerating}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-sm transition active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Multi-Agent Evaluation in Progress...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Calculate Packaging Rankings</span>
                  </>
                )}
              </button>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {error}
                </div>
              )}
            </div>

            {/* Right: Results / Agent Stream (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              {/* If no recommendation yet */}
              {!currentRecommendation && !isGenerating && (
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Ready for Multi-Agent Evaluation</h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    Select a food commodity and your priority weights on the left to launch the 5-agent barrier permeability and kinetics engine.
                  </p>
                </div>
              )}

              {/* Live Multi-Agent Execution Feed */}
              {isGenerating && (
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                      <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">Agentic Evaluation Pipeline Active</span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Real-time Stream</span>
                  </div>

                  <div className="space-y-2.5 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center space-x-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-slate-700 dark:text-slate-300">Planner Agent: Decomposing food vulnerability pathways</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center space-x-2.5">
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                      <span className="text-slate-700 dark:text-slate-300">Barrier Screening Agent: Matching ASTM OTR and WVTR ratings</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center space-x-2.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                      <span className="text-slate-700 dark:text-slate-300">Shelf-Life Kinetics Agent: Modeling days gained and atmosphere boost</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendation Results List */}
              {currentRecommendation && currentRecommendation.results && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {currentRecommendation.results.length} Materials Ranked for {currentRecommendation.commoditySnapshot?.name}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        Engine: {currentRecommendation.engineUsed} · ASTM D3985 & FSSAI IS 9845
                      </p>
                    </div>
                    <Link
                      href={`/recommend/${currentRecommendation._id}`}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-lg transition"
                    >
                      Permalink View &rarr;
                    </Link>
                  </div>

                  {currentRecommendation.results.map((result) => (
                    <MaterialScoreCard
                      key={result._id || result.rank}
                      result={result}
                      baselineDays={currentRecommendation.commoditySnapshot?.baselineShelfLifeDays || 10}
                      onCompare={handleCompare}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
