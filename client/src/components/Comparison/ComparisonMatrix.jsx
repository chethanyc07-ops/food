import React from 'react';
import {
  Trophy,
  ShieldCheck,
  TrendingUp,
  Leaf,
  DollarSign,
  Layers,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import RadarChart from '../Recommendation/RadarChart';

export default function ComparisonMatrix({ comparisonData }) {
  if (!comparisonData || !comparisonData.comparisons || comparisonData.comparisons.length === 0) {
    return null;
  }

  const { commodity, comparisons, summary } = comparisonData;

  const rows = [
    {
      label: 'Overall Match Score',
      key: 'compositeScore',
      render: (c) => (
        <div className="flex items-center space-x-2 font-mono">
          <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
            {c.compositeScore}/100
          </span>
          {c.material.name === summary.bestOverall?.materialName && (
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              · Top Match
            </span>
          )}
        </div>
      ),
    },
    {
      label: 'Predicted Shelf Life',
      key: 'shelfLife',
      render: (c) => (
        <div className="font-mono">
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {c.shelfLifeDays} Days
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {c.shelfLifeMultiplier}x ({c.shelfLifeDays - commodity.baselineShelfLifeDays > 0 ? `+${c.shelfLifeDays - commodity.baselineShelfLifeDays}d` : '0d'})
          </p>
        </div>
      ),
    },
    {
      label: 'Oxygen Barrier (OTR)',
      key: 'otr',
      render: (c) => (
        <div className="font-mono">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
            {c.material.otrValue} <span className="text-[10px] text-slate-400">cc/m²·d</span>
          </p>
          <span className="text-[10px] text-slate-500 font-sans">{c.material.oxygenBarrier}</span>
        </div>
      ),
    },
    {
      label: 'Moisture Barrier (WVTR)',
      key: 'wvtr',
      render: (c) => (
        <div className="font-mono">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
            {c.material.wvtrValue} <span className="text-[10px] text-slate-400">g/m²·d</span>
          </p>
          <span className="text-[10px] text-slate-500 font-sans">{c.material.moistureBarrier}</span>
        </div>
      ),
    },
    {
      label: 'Light Barrier',
      key: 'light',
      render: (c) => (
        <div className="font-mono">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
            {100 - (c.material.lightTransmissionPercent || 0)}% Blocked
          </p>
          <span className="text-[10px] text-slate-500 font-sans">{c.material.lightBarrier}</span>
        </div>
      ),
    },
    {
      label: 'Sustainability & Circularity',
      key: 'sustainability',
      render: (c) => (
        <div className="font-mono">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {c.material.compostable ? '100% Compostable' : `${c.material.recyclabilityScore}/10 Recyclable`}
          </p>
          <span className="text-[10px] text-slate-400 font-sans">{c.material.category}</span>
        </div>
      ),
    },
    {
      label: 'Cost Estimate',
      key: 'cost',
      render: (c) => (
        <div className="font-mono">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
            ₹{c.material.costPerKg || 250} <span className="text-[10px] text-slate-400">/kg</span>
          </p>
          <span className="text-[10px] text-slate-400 font-sans">Index {c.material.costIndex}/10</span>
        </div>
      ),
    },
    {
      label: 'FSSAI / FDA Safety',
      key: 'compliance',
      render: () => (
        <div className="flex items-center space-x-1.5 text-xs text-slate-700 dark:text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>FSSAI IS 9845 Certified</span>
        </div>
      ),
    },
    {
      label: 'Atmosphere Flush (MAP)',
      key: 'activeTech',
      render: (c) => (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {c.material.activeScavengerType && c.material.activeScavengerType !== 'None'
            ? c.material.activeScavengerType
            : 'Standard Passive Barrier'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Precision Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center space-x-3 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400 font-mono">Best Barrier Protection</p>
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">{summary.bestProtection?.materialName}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center space-x-3 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400 font-mono">Maximum Circularity</p>
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">{summary.bestEco?.materialName}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center space-x-3 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400 font-mono">Most Cost Effective</p>
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">{summary.bestCost?.materialName}</p>
          </div>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono w-1/4">
                Evaluation Metric
              </th>
              {comparisons.map((c) => (
                <th key={c.material._id} className="p-4 text-xs font-bold text-slate-900 dark:text-white border-l border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{c.material.name}</span>
                  </div>
                  <p className="text-[10px] font-normal text-slate-400 font-mono mt-0.5">{c.material.category}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {rows.map((row) => (
              <tr key={row.key} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-medium text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-950/30">
                  {row.label}
                </td>
                {comparisons.map((c) => (
                  <td key={c.material._id} className="p-4 text-slate-700 dark:text-slate-300 border-l border-slate-200 dark:border-slate-800">
                    {row.render(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Radar Chart Overlay for Comparisons */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-6 flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>Multi-Axis Radar Comparison</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {comparisons.map((c) => (
            <div key={c.material._id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
              <p className="text-xs font-bold text-slate-900 dark:text-white mb-2 truncate">{c.material.name}</p>
              <RadarChart
                data={{
                  oxygen: c.radarDimensions.oxygenBarrier,
                  moisture: c.radarDimensions.moistureBarrier,
                  light: c.radarDimensions.lightBarrier,
                  cost: c.radarDimensions.costEfficiency,
                  sustainability: c.radarDimensions.sustainability,
                }}
                size={180}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
