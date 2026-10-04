import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/AppShell/Layout';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import ComparisonMatrix from '../../components/Comparison/ComparisonMatrix';
import { useCommodityStore } from '../../store/commodityStore';
import { useMaterialStore } from '../../store/materialStore';
import {
  Scale,
  Sparkles,
  Loader2,
  Check,
} from 'lucide-react';
import api from '../../services/api';

export default function ComparePage() {
  const router = useRouter();
  const { commodities, fetchCommodities } = useCommodityStore();
  const { materials, fetchMaterials } = useMaterialStore();

  const [selectedCommodityId, setSelectedCommodityId] = useState('');
  const [selectedMaterialIds, setSelectedMaterialIds] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCommodities();
    fetchMaterials();
  }, []);

  useEffect(() => {
    if (router.query.commodityId) {
      setSelectedCommodityId(router.query.commodityId);
    }
    if (router.query.materialId) {
      setSelectedMaterialIds([router.query.materialId]);
    }
  }, [router.query]);

  const handleToggleMaterial = (matId) => {
    setError('');
    if (selectedMaterialIds.includes(matId)) {
      setSelectedMaterialIds(selectedMaterialIds.filter((id) => id !== matId));
    } else {
      if (selectedMaterialIds.length >= 4) {
        setError('Maximum 4 packaging materials can be compared simultaneously.');
        return;
      }
      setSelectedMaterialIds([...selectedMaterialIds, matId]);
    }
  };

  const handleRunComparison = async () => {
    setError('');
    if (!selectedCommodityId) {
      setError('Please select a food commodity to evaluate.');
      return;
    }
    if (selectedMaterialIds.length < 2) {
      setError('Please select at least 2 packaging materials to compare.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/comparisons', {
        commodityId: selectedCommodityId,
        materialIds: selectedMaterialIds,
      });
      setComparisonResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate comparison');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-emerald-500" />
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Side-by-Side Packaging Matrix Comparison
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Evaluate trade-offs between 2 to 4 barrier polymers with multi-axis radar charts and shelf-life multipliers.
              </p>
            </div>
          </div>

          {/* Setup Panel */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Commodity Selector */}
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                  01. SELECT FOOD COMMODITY
                </label>
                <select
                  value={selectedCommodityId}
                  onChange={(e) => setSelectedCommodityId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none transition"
                >
                  <option value="">-- Choose Commodity --</option>
                  {commodities.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Status and Action */}
              <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>Selected: </span>
                  <strong className="text-slate-900 dark:text-white tabular-nums font-bold">
                    {selectedMaterialIds.length} of 4 materials
                  </strong>
                  <span className="block text-[11px] text-slate-400 mt-0.5 font-sans">
                    Choose 2-4 materials from the grid below
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleRunComparison}
                  disabled={!selectedCommodityId || selectedMaterialIds.length < 2 || loading}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition disabled:opacity-50 flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Compare Selected Materials</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {error}
              </div>
            )}

            {/* Material Selection Chips */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 font-mono">
                02. SELECT PACKAGING MATERIALS (CLICK TO TOGGLE)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {materials.map((mat) => {
                  const isSelected = selectedMaterialIds.includes(mat._id);
                  return (
                    <div
                      key={mat._id}
                      onClick={() => handleToggleMaterial(mat._id)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-slate-900 dark:border-white shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="pr-2">
                        <p className="text-xs font-bold truncate max-w-[180px]">{mat.name}</p>
                        <p className={`text-[10px] ${isSelected ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400'}`}>
                          {mat.category} · OTR: {mat.otrValue}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950'
                            : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Comparison Output */}
          {comparisonResult && (
            <div className="animate-in fade-in duration-200">
              <ComparisonMatrix comparisonData={comparisonResult} />
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
