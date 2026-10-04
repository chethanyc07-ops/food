import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/AppShell/Layout';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import MaterialScoreCard from '../../components/Recommendation/MaterialScoreCard';
import ExportPdfButton from '../../components/Common/ExportPdfButton';
import { useRecommendationStore } from '../../store/recommendationStore';
import {
  Sparkles,
  ArrowLeft,
  Calendar,
  Loader2,
  FileCheck2
} from 'lucide-react';

export default function RecommendationDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { fetchById, currentRecommendation, loading } = useRecommendationStore();

  useEffect(() => {
    if (id) {
      fetchById(id);
    }
  }, [id]);

  if (loading || !currentRecommendation) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 dark:text-slate-400">Loading persistent recommendation report...</p>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  const comm = currentRecommendation.commoditySnapshot || {};

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <button
                onClick={() => router.push('/history')}
                className="inline-flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-2 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Recommendation History</span>
              </button>
              <div className="flex items-center space-x-2">
                <FileCheck2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Packaging Advisory Report: {comm.name}
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Generated on {new Date(currentRecommendation.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>Report ID: #{currentRecommendation._id?.substring(0, 8)}</span>
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <ExportPdfButton recommendation={currentRecommendation} />
            </div>
          </div>

          {/* Commodity Details Banner */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Category</span>
              <span className="font-semibold text-slate-900 dark:text-white mt-1 block">{comm.category || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Baseline Shelf Life</span>
              <span className="font-semibold text-slate-900 dark:text-white mt-1 block">{comm.baselineShelfLifeDays || 10} Days</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Oxygen Sensitivity</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block">{comm.oxygenSensitivity || 'Medium'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Moisture Sensitivity</span>
              <span className="font-semibold text-teal-600 dark:text-teal-400 mt-1 block">{comm.moistureSensitivity || 'Medium'}</span>
            </div>
          </div>

          {/* Ranked Results List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span>Ranked Packaging Materials ({currentRecommendation.results?.length || 0})</span>
            </h3>

            {(currentRecommendation.results || []).map((result) => (
              <MaterialScoreCard
                key={result._id || result.rank}
                result={result}
                baselineDays={comm.baselineShelfLifeDays || 10}
              />
            ))}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
