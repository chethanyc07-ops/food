import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  ShieldCheck,
  Leaf,
  Layers,
  Sparkles,
  ArrowUpRight,
  Info,
} from 'lucide-react';

// Multi-commodity shelf-life optimization comparative data
const SHELF_LIFE_DATA = [
  { name: 'Fresh Paneer', baseline: 6, optimized: 28, gain: '4.6x', category: 'Dairy' },
  { name: 'Alphonso Mango', baseline: 8, optimized: 24, gain: '3.0x', category: 'Produce' },
  { name: 'Turmeric Powder', baseline: 90, optimized: 365, gain: '4.0x', category: 'Spices' },
  { name: 'RTE Dal Makhani', baseline: 3, optimized: 180, gain: '60x', category: 'RTE' },
  { name: 'Fresh Shrimp', baseline: 4, optimized: 16, gain: '4.0x', category: 'Seafood' },
  { name: 'Roasted Coffee', baseline: 30, optimized: 180, gain: '6.0x', category: 'Dry Foods' },
];

// Efficiency across storage temperature curve data (-10°C to 45°C)
const EFFICIENCY_TEMP_CURVE = [
  { temp: '-10°C', efficiency: 97.4, standardLoss: 12.1 },
  { temp: '0°C', efficiency: 96.8, standardLoss: 18.5 },
  { temp: '4°C', efficiency: 95.5, standardLoss: 26.2 },
  { temp: '15°C', efficiency: 93.8, standardLoss: 41.0 },
  { temp: '25°C', efficiency: 91.2, standardLoss: 58.4 },
  { temp: '35°C', efficiency: 87.6, standardLoss: 74.0 },
  { temp: '45°C', efficiency: 82.3, standardLoss: 89.1 },
];

// Circularity and material sustainability breakdown
const SUSTAINABILITY_PIE = [
  { name: 'Certified Compostable Bio-PLA', value: 35, color: '#10b981' },
  { name: 'Mono-Material Recyclable PE/PP', value: 40, color: '#06b6d4' },
  { name: 'Ultra-Thin EVOH High-Barrier', value: 15, color: '#3b82f6' },
  { name: 'Foil Retort Laminate (Specialized)', value: 10, color: '#f59e0b' },
];

export default function MetricsDataDashboard({
  metricsData,
  className = '',
}) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter shelf-life dataset based on active filter
  const filteredShelfLifeData =
    activeTab === 'all'
      ? SHELF_LIFE_DATA
      : SHELF_LIFE_DATA.filter((d) => d.category.toLowerCase().includes(activeTab.toLowerCase()));

  // Custom tooltips with dark/light mode compatibility
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg text-xs font-mono">
          <p className="font-bold text-slate-900 dark:text-white font-sans mb-1.5">{label}</p>
          <div className="space-y-1">
            <p className="text-slate-500 dark:text-slate-400 flex items-center justify-between gap-4">
              <span>Baseline Lifespan:</span>
              <span className="font-bold tabular-nums text-slate-700 dark:text-slate-300">
                {data.baseline} Days
              </span>
            </p>
            <p className="text-emerald-600 dark:text-emerald-400 flex items-center justify-between gap-4">
              <span>AI Optimized:</span>
              <span className="font-bold tabular-nums">
                {data.optimized} Days
              </span>
            </p>
            <p className="text-cyan-600 dark:text-cyan-400 flex items-center justify-between gap-4 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span>Extension Multiplier:</span>
              <span className="font-bold">{data.gain}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomAreaTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg text-xs font-mono">
          <p className="font-bold text-slate-900 dark:text-white font-sans mb-1.5">
            Storage Condition: {label}
          </p>
          <div className="space-y-1">
            <p className="text-emerald-600 dark:text-emerald-400 flex items-center justify-between gap-4">
              <span>AI Barrier Efficiency:</span>
              <span className="font-bold tabular-nums">{payload[0]?.value}%</span>
            </p>
            <p className="text-rose-500 dark:text-rose-400 flex items-center justify-between gap-4">
              <span>Traditional Loss Rate:</span>
              <span className="font-bold tabular-nums">{payload[1]?.value}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!mounted) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-xs text-slate-400">
        Loading interactive metrics visualization...
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ===================================================================== */}
      {/* SECTION 1: THREE CORE HERO KPI METRIC PANELS                          */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Metric 1: Packaging Efficiency */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                Metric 01 · Barrier Kinetics
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              Packaging Efficiency
            </h3>

            <div className="mt-4 flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
                94.8%
              </span>
              <span className="text-xs font-semibold font-mono text-emerald-600 dark:text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                +8.4% vs benchmark
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Composite score combining ASTM D3985 oxygen barrier (OTR &lt; 0.5) and ASTM F1249 moisture retention (WVTR &lt; 1.0).
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
              <p className="text-[10px] text-slate-400 uppercase">OTR Barrier</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">96.2%</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
              <p className="text-[10px] text-slate-400 uppercase">WVTR Proof</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">93.5%</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
              <p className="text-[10px] text-slate-400 uppercase">Seal Rigor</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">98.0%</p>
            </div>
          </div>
        </div>

        {/* Metric 2: Shelf Life Optimization */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                Metric 02 · Preservation Impact
              </span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              Shelf Life Optimization
            </h3>

            <div className="mt-4 flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-600 dark:text-cyan-400 tabular-nums tracking-tight">
                3.8x
              </span>
              <span className="text-xs font-semibold font-mono text-slate-500 dark:text-slate-400">
                Avg. lifespan extension
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Equilibrium gas concentration and Modified Atmosphere Packaging (MAP) kinetic delay against microbial growth.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
              <p className="text-[10px] text-slate-400 uppercase">Fresh Dairy</p>
              <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 tabular-nums mt-0.5">4.6x Gain</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
              <p className="text-[10px] text-slate-400 uppercase">Perishables</p>
              <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 tabular-nums mt-0.5">3.0x Gain</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
              <p className="text-[10px] text-slate-400 uppercase">Dry Spices</p>
              <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 tabular-nums mt-0.5">4.0x Gain</p>
            </div>
          </div>
        </div>

        {/* Metric 3: Sustainability Score */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                Metric 03 · Circular Economy
              </span>
              <div className="w-8 h-8 rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center">
                <Leaf className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              Sustainability Score
            </h3>

            <div className="mt-4 flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight">
                88.5
              </span>
              <span className="text-xs font-semibold font-mono text-slate-500 dark:text-slate-400">
                / 100 Circular Index
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              EN 13432 industrial compostability, recyclable mono-material index, and low carbon life-cycle assessment.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
              <p className="text-[10px] text-slate-400 uppercase">Compostable</p>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">35% Share</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
              <p className="text-[10px] text-slate-400 uppercase">Recyclable</p>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">40% Share</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
              <p className="text-[10px] text-slate-400 uppercase">CO₂ Offset</p>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">-42% GHG</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SECTION 2: VISUAL IMPACT RECHARTS CHARTS                              */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart 1: Shelf Life Optimization Comparison (Bar Chart) - 2 Cols */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  Comparative Analysis
                </p>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Shelf Life Extension: Baseline vs AI Optimized Packaging
                </h4>
              </div>

              {/* Segmented Filter Controls */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
                {['all', 'dairy', 'produce', 'spices'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg capitalize transition-colors ${
                      activeTab === tab
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts BarChart View */}
            <div className="h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredShelfLifeData}
                  margin={{ top: 15, right: 10, left: -15, bottom: 0 }}
                  barGap={8}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val}d`}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Bar
                    dataKey="baseline"
                    name="Baseline Days"
                    fill="#94a3b8"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                  />
                  <Bar
                    dataKey="optimized"
                    name="AI Optimized Days"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>ASTM Kinetics Predictive Modeling</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">+280% Avg Extension</span>
          </div>
        </div>

        {/* Chart 2: Circularity & Material Sustainability Distribution (Pie Chart) - 1 Col */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Circularity Index
              </p>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Material Sustainability Share
              </h4>
            </div>

            <div className="h-56 w-full mt-2 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SUSTAINABILITY_PIE}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {SUSTAINABILITY_PIE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name) => [`${val}% Distribution`, name]}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Stat HUD */}
              <div className="absolute text-center pointer-events-none">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums block">
                  75%
                </span>
                <span className="text-[9px] uppercase font-mono text-slate-400 tracking-wider">
                  Eco-Certified
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            {SUSTAINABILITY_PIE.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-2 truncate">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate text-[11px]">{item.name}</span>
                </div>
                <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white text-[11px]">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SECTION 3: PACKAGING EFFICIENCY OVER STORAGE TEMPERATURE RANGE        */}
      {/* ===================================================================== */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Thermal Barrier Curve
            </p>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Packaging Barrier Efficiency vs Food Degradation Across Storage Temperatures
            </h4>
          </div>
          <div className="flex items-center space-x-3 text-xs font-mono text-slate-500">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span>AI Multi-Agent Film Barrier</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
              <span>Conventional Film Decay</span>
            </span>
          </div>
        </div>

        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={EFFICIENCY_TEMP_CURVE}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="efficiencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis dataKey="temp" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
              <Tooltip content={<CustomAreaTooltip />} />
              <Area
                type="monotone"
                dataKey="efficiency"
                name="AI Barrier Efficiency"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#efficiencyGrad)"
              />
              <Area
                type="monotone"
                dataKey="standardLoss"
                name="Conventional Spoilage Rate"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#lossGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
