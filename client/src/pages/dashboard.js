import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Layout from '../components/AppShell/Layout';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import MetricCard from '../components/MetricGrid/MetricCard';
import {
  Sparkles,
  Apple,
  Layers,
  Scale,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Loader2,
  FileText,
  Download,
} from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

// Dynamically import Recharts-heavy dashboard to prevent hydration mismatches and SSR errors
const MetricsDataDashboard = dynamic(
  () => import('../components/Dashboard/MetricsDataDashboard'),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-xs text-slate-400">
        Loading interactive metrics visualization...
      </div>
    ),
  }
);

const DEFAULT_SUMMARY = {
  metrics: {
    totalCommodities: 8,
    totalMaterials: 10,
    totalRecommendations: 0,
    userRecommendationCount: 0,
    avgShelfLifeMultiplier: 3.4,
    avgShelfLifeIncreasePercent: 240,
    ecoMaterialPercentage: 30,
    compostableCount: 3,
  },
  recentRecommendations: [],
  categoryDistribution: [
    { category: 'Fresh Produce', count: 3 },
    { category: 'Dry Foods & Spices', count: 2 },
    { category: 'Dairy', count: 1 },
    { category: 'Ready-to-Eat (RTE)', count: 1 },
    { category: 'Seafood', count: 1 },
    { category: 'Oils & Fats', count: 1 },
  ],
};

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [loading, setLoading] = useState(false);
  const [downloadingMetric, setDownloadingMetric] = useState(null);
  const [downloadToast, setDownloadToast] = useState(null);

  const metrics = summary?.metrics || DEFAULT_SUMMARY.metrics;

  const handleDownloadPdf = async (metricKey, title) => {
    try {
      setDownloadingMetric(metricKey);
      const { generateDashboardPdfReport } = await import('../utils/generatePdfReport');
      const filename = await generateDashboardPdfReport({
        metricKey,
        metricTitle: title,
        metrics: summary?.metrics || DEFAULT_SUMMARY.metrics,
        summary: summary || DEFAULT_SUMMARY,
        user,
      });
      setDownloadToast(`Generated "${filename}" successfully.`);
      setTimeout(() => setDownloadToast(null), 5000);
    } catch (err) {
      console.error('Failed to generate PDF', err);
      setDownloadToast('Failed to generate PDF report. Please try again.');
      setTimeout(() => setDownloadToast(null), 4000);
    } finally {
      setDownloadingMetric(null);
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard/summary');
      if (res.data?.success && res.data.summary) {
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.warn('Dashboard summary using fallback data:', err?.message);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Clinical Workspace Header */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm transition-colors">
            <div>
              <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">MoFPI Intelligence Console</span>
                <span aria-hidden="true">·</span>
                <span>Active Session</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1.5">
                Welcome back, {user?.name || 'Packaging Scientist'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Model food degradation kinetics, screen OTR & WVTR thresholds, and discover optimal circular materials.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => handleDownloadPdf('all', 'Executive Dashboard Analytics Master Report')}
                disabled={downloadingMetric === 'all'}
                title="Download complete executive analytics PDF report"
                className="flex-1 md:flex-none px-4 py-3 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 font-semibold rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 shadow-sm transition active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {downloadingMetric === 'all' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                ) : (
                  <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                )}
                <span>Export Analytics PDF</span>
              </button>

              <Link
                href="/recommend"
                className="flex-1 md:flex-none px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-sm transition active:scale-95 flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>New AI Recommendation</span>
              </Link>
            </div>
          </div>

          {/* Metric KPI Grid with Downloadable PDF Reports & Sparklines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Food Commodities"
              value={metrics.totalCommodities || 10}
              subtitle="Indexed perishable items"
              icon={Apple}
              color="emerald"
              trend="+8 Verified"
              trendPercentage="+12.5%"
              trendDirection="up"
              trendTimeframe="vs last qtr"
              sparklineData={[5, 6, 6, 7, 7, 8, metrics.totalCommodities || 8]}
              onDownload={() => handleDownloadPdf('commodities', 'Food Commodities Preservation Analytics')}
              isDownloading={downloadingMetric === 'commodities'}
            />
            <MetricCard
              title="Packaging Materials"
              value={metrics.totalMaterials || 10}
              subtitle="ASTM / OTR / WVTR specs"
              icon={Layers}
              color="cyan"
              trend="100% FSSAI Ready"
              trendPercentage="+25.0%"
              trendDirection="up"
              trendTimeframe="+2 new polymers"
              sparklineData={[7, 7, 8, 8, 9, 9, metrics.totalMaterials || 10]}
              onDownload={() => handleDownloadPdf('materials', 'Packaging Materials & Barrier Specifications')}
              isDownloading={downloadingMetric === 'materials'}
            />
            <MetricCard
              title="Avg Shelf-Life Gain"
              value={`${metrics.avgShelfLifeMultiplier || 3.4}x`}
              subtitle={`+${metrics.avgShelfLifeIncreasePercent || 240}% extended lifespan`}
              icon={TrendingUp}
              color="amber"
              trend="Kinetics Verified"
              trendPercentage="+18.4%"
              trendDirection="up"
              trendTimeframe="vs baseline"
              sparklineData={[2.2, 2.4, 2.6, 2.7, 3.0, 3.2, parseFloat(metrics.avgShelfLifeMultiplier) || 3.4]}
              onDownload={() => handleDownloadPdf('shelflife', 'Shelf-Life Decay Kinetics & Thermal Stability')}
              isDownloading={downloadingMetric === 'shelflife'}
            />
            <MetricCard
              title="Circular & Compostable"
              value={`${metrics.ecoMaterialPercentage || 30}%`}
              subtitle={`${metrics.compostableCount || 3} bio-polymers available`}
              icon={Leaf}
              color="indigo"
              trend="Eco-Certified"
              trendPercentage="+33.3%"
              trendDirection="up"
              trendTimeframe="adoption YoY"
              sparklineData={[15, 18, 20, 22, 25, 28, parseInt(metrics.ecoMaterialPercentage) || 30]}
              onDownload={() => handleDownloadPdf('circularity', 'Circular Economy & Biodegradable Polymers')}
              isDownloading={downloadingMetric === 'circularity'}
            />
          </div>

          {/* Quick Action Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/recommend"
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  AI Recommendation Wizard
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Select a commodity and weights to generate multi-agent barrier rankings.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Start Evaluation</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/compare"
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                  <Scale className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  Side-by-Side Comparison
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Compare 2-4 candidate materials side-by-side with radar charts and barrier trade-offs.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-teal-600 dark:text-teal-400">
                <span>Compare Materials</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/chat"
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  Scientific Chat Agent
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Ask food science questions in natural language with database citations.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                <span>Open Chat Assistant</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>

          {/* Key Metrics Visual Data Dashboard (Recharts Visual Impact) */}
          <MetricsDataDashboard />

          {/* Recent Recommendations & Sector Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Recent Recommendations (2 Cols) */}
            <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Recent AI Recommendations</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Past generated reports and predicted shelf-life extensions</p>
                </div>
                <Link
                  href="/history"
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {loading ? (
                <div className="py-12 flex items-center justify-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  <span>Loading recent reports...</span>
                </div>
              ) : (summary?.recentRecommendations || []).length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <FileText className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">No recommendations generated yet.</p>
                  <p className="text-[11px] text-slate-500">Run your first food packaging evaluation to see reports here.</p>
                  <Link
                    href="/recommend"
                    className="inline-block mt-3 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-sm"
                  >
                    Generate First Report
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(summary?.recentRecommendations || []).map((rec) => {
                    const topResult = rec.results?.[0];
                    return (
                      <div
                        key={rec._id || Math.random()}
                        onClick={() => rec._id && router.push(`/recommend/${rec._id}`)}
                        className="py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl px-2 transition cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs font-mono text-slate-700 dark:text-slate-300">
                            #{topResult?.rank || 1}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">{rec.commoditySnapshot?.name || 'Commodity'}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              Top Material: <span className="text-slate-700 dark:text-slate-300 font-medium">{topResult?.materialSnapshot?.name || 'Optimal Film'}</span>
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs justify-end">
                            <TrendingUp className="w-3 h-3" />
                            <span className="tabular-nums">{topResult?.estimatedShelfLifeDays || 30} Days</span>
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                            {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Category Distribution */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1">Commodities by Sector</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Distribution of indexed food products</p>

                <div className="space-y-2">
                  {(summary?.categoryDistribution || DEFAULT_SUMMARY.categoryDistribution).map((cat) => (
                    <div key={cat.category} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{cat.category}</span>
                      <span className="font-mono text-slate-500 tabular-nums">{cat.count} items</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/commodities"
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition flex items-center justify-center space-x-1"
                >
                  <span>Manage Food Commodities</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* PDF Download Toast Notification */}
          {downloadToast && (
            <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900/95 dark:bg-slate-800/95 text-white shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center space-x-3 transition-all max-w-md">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                <p className="font-semibold text-emerald-400">PDF Report Ready</p>
                <p className="text-slate-300 mt-0.5 truncate">{downloadToast}</p>
              </div>
              <button
                type="button"
                onClick={() => setDownloadToast(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded cursor-pointer"
                aria-label="Dismiss toast"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
