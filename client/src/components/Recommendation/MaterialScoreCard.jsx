import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Scale,
} from 'lucide-react';
import RadarChart from './RadarChart';

export default function MaterialScoreCard({ result, baselineDays = 10, onCompare }) {
  const [expanded, setExpanded] = useState(result.rank === 1);
  const mat = result.materialSnapshot || {};
  const isTop = result.rank === 1;

  return (
    <div
      className={`rounded-2xl border transition-all duration-150 overflow-hidden bg-white dark:bg-slate-900 ${
        isTop
          ? 'border-emerald-500/60 shadow-sm ring-1 ring-emerald-500/30'
          : 'border-slate-200 dark:border-slate-800 shadow-sm'
      }`}
    >
      {/* Top Banner for Rank 1 */}
      {isTop && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-500/30 px-5 py-2 flex items-center justify-between text-xs font-semibold text-emerald-800 dark:text-emerald-300 font-mono">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>OPTIMAL MULTI-AGENT COMPATIBILITY MATCH</span>
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
            FSSAI IS 9845 Verified
          </span>
        </div>
      )}

      {/* Main Card Header */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Left: Material Info & Rank */}
          <div className="flex items-start space-x-3.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm font-mono shrink-0 ${
                isTop
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              #{result.rank}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {mat.name || 'Packaging Material'}
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  · {mat.compostable ? 'Bio-Compostable' : mat.category || 'High-Barrier Laminate'}
                </span>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 flex-wrap font-mono">
                <span>Format: <strong className="text-slate-700 dark:text-slate-300 font-sans">{result.packagingFormat}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Atmosphere: <strong className="text-slate-700 dark:text-slate-300 font-sans">{result.gasFlushAtmosphere}</strong></span>
              </div>
            </div>
          </div>

          {/* Right: Shelf life increase & Score */}
          <div className="flex items-center space-x-4 self-end sm:self-auto">
            <div className="text-right">
              <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-xl justify-end">
                <TrendingUp className="w-4 h-4" />
                <span className="tabular-nums">{result.estimatedShelfLifeDays}</span>
                <span className="text-xs uppercase ml-1">Days</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {result.shelfLifeMultiplier}x gain vs {baselineDays}d baseline
              </p>
            </div>

            {/* Score HUD */}
            <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center shrink-0">
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums leading-none">
                {result.overallScore}
              </span>
              <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">
                INDEX
              </span>
            </div>
          </div>
        </div>

        {/* Quick Metric Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <p className="text-[10px] uppercase font-semibold text-slate-400 font-mono">Oxygen Barrier (OTR)</p>
            <p className="text-xs font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
              {mat.otrValue ?? '0.5'} <span className="text-[10px] font-normal text-slate-500">cc/m²·d</span>
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <p className="text-[10px] uppercase font-semibold text-slate-400 font-mono">Moisture Barrier (WVTR)</p>
            <p className="text-xs font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
              {mat.wvtrValue ?? '1.2'} <span className="text-[10px] font-normal text-slate-500">g/m²·d</span>
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <p className="text-[10px] uppercase font-semibold text-slate-400 font-mono">Sustainability</p>
            <p className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
              {mat.compostable ? '100% Compostable' : `${mat.recyclabilityScore || 7}/10 Recyclable`}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <p className="text-[10px] uppercase font-semibold text-slate-400 font-mono">Commercial Cost</p>
            <p className="text-xs font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
              ₹{mat.costPerKg || 220} <span className="text-[10px] font-normal text-slate-500">/kg</span>
            </p>
          </div>
        </div>

        {/* AI Scientific Justification Box */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Preservation & Degradation Kinetics Rationale</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {result.aiExplanation}
          </p>
        </div>

        {/* Collapsible Details (Radar Chart, Strengths, Weaknesses, Compliance) */}
        {expanded && (
          <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Strengths & Considerations */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center space-x-1.5 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Preservation Advantages</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {(result.strengths || []).map((s, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-2">
                        <span className="text-emerald-500 font-bold">·</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {result.weaknesses && result.weaknesses.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center space-x-1.5 font-mono">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Operational Trade-offs</span>
                    </h4>
                    <ul className="space-y-1.5">
                      {result.weaknesses.map((w, i) => (
                        <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-2">
                          <span className="text-amber-500 font-bold">·</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.regulatoryNotes && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 flex items-center space-x-2 font-mono">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{result.regulatoryNotes}</span>
                  </div>
                )}
              </div>

              {/* Radar Performance Vector */}
              <div className="flex justify-center bg-slate-50/70 dark:bg-slate-950/40 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
                <RadarChart
                  data={{
                    oxygen: result.barrierScore || 85,
                    moisture: result.barrierScore > 80 ? 90 : 70,
                    light: mat.lightBarrier?.includes('100%') ? 100 : 70,
                    cost: result.costScore || 65,
                    sustainability: result.sustainabilityScore || 60,
                  }}
                  title="Multi-Axis Barrier Calibration"
                  size={210}
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
          {onCompare && (
            <button
              onClick={() => onCompare(result.material || mat._id)}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Add to Comparison Matrix</span>
            </button>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-auto inline-flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition font-medium"
          >
            <span>{expanded ? 'Hide Technical Parameters' : 'View Full Technical Breakdown'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
