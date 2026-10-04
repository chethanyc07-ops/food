import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/AppShell/Layout';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import ExportPdfButton from '../../components/Common/ExportPdfButton';
import Badge from '../../components/Common/Badge';
import { useRecommendationStore } from '../../store/recommendationStore';
import {
  History,
  Search,
  Sparkles,
  Calendar,
  Trash2,
  ExternalLink,
  TrendingUp,
  Loader2,
  FileText
} from 'lucide-react';

export default function HistoryPage() {
  const router = useRouter();
  const {
    recommendations,
    fetchRecommendations,
    deleteRecommendation,
    loading,
  } = useRecommendationStore();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const filtered = recommendations.filter((r) => {
    const name = r.commoditySnapshot?.name || '';
    const cat = r.commoditySnapshot?.category || '';
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDelete = async (id) => {
    await deleteRecommendation(id);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Recommendation History</h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Audit trail of past AI food packaging evaluations, barrier rankings, and downloadable reports.
              </p>
            </div>

            <Link
              href="/recommend"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition flex items-center space-x-1.5 self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>New Recommendation</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search history by commodity or category..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-sm"
            />
          </div>

          {/* Recommendations Table / Cards */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
              <p className="text-xs text-slate-500 dark:text-slate-400">Loading recommendation history...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center space-y-2 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <FileText className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No recommendation history found.</p>
              <p className="text-xs text-slate-500">Run an evaluation in the AI Recommender to generate reports.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((rec) => {
                const comm = rec.commoditySnapshot || {};
                const topResult = rec.results?.[0];

                return (
                  <div
                    key={rec._id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition shadow-sm dark:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                        #{topResult?.rank || 1}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                            {comm.name || 'Commodity'}
                          </h3>
                          <Badge variant="emerald">{comm.category}</Badge>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          Top Choice: <strong className="text-slate-900 dark:text-slate-200">{topResult?.materialSnapshot?.name || 'High-Barrier Material'}</strong>
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(rec.createdAt).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {topResult?.estimatedShelfLifeDays}d ({topResult?.shelfLifeMultiplier}x gain)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-auto">
                      <ExportPdfButton recommendation={rec} />

                      <Link
                        href={`/recommend/${rec._id}`}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition"
                        title="View Full Report"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleDelete(rec._id, comm.name)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-500/20 text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 transition"
                        title="Delete Report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
