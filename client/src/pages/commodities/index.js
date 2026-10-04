import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/AppShell/Layout';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import Modal from '../../components/Common/Modal';
import Badge from '../../components/Common/Badge';
import { useCommodityStore } from '../../store/commodityStore';
import {
  Apple,
  Search,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Loader2,
  Clock,
  Thermometer,
  Wind
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Fresh Produce',
  'Dairy',
  'Bakery',
  'Meat & Poultry',
  'Seafood',
  'Dry Foods & Spices',
  'Beverages',
  'Frozen Foods',
  'Confectionery',
  'Ready-to-Eat (RTE)',
  'Oils & Fats',
];

const SENSITIVITIES = ['Low', 'Medium', 'High', 'Critical'];

export default function CommoditiesPage() {
  const router = useRouter();
  const {
    commodities,
    fetchCommodities,
    createCommodity,
    updateCommodity,
    deleteCommodity,
    loading,
    error,
  } = useCommodityStore();

  const [selectedCat, setSelectedCat] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Fresh Produce',
    subCategory: '',
    baselineShelfLifeDays: 10,
    targetShelfLifeDays: 30,
    moistureSensitivity: 'Medium',
    oxygenSensitivity: 'Medium',
    lightSensitivity: 'Low',
    temperatureSensitivity: 'Medium',
    optimalStorageTempMin: 4,
    optimalStorageTempMax: 25,
    respirationRate: 'None',
    storageCondition: 'Ambient (20-25°C)',
    fatOxidationRisk: 'Low',
    description: '',
    tags: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchCommodities({ category: selectedCat, search: searchTerm });
  }, [selectedCat]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCommodities({ category: selectedCat, search: searchTerm });
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Fresh Produce',
      subCategory: '',
      baselineShelfLifeDays: 10,
      targetShelfLifeDays: 30,
      moistureSensitivity: 'Medium',
      oxygenSensitivity: 'Medium',
      lightSensitivity: 'Low',
      temperatureSensitivity: 'Medium',
      optimalStorageTempMin: 4,
      optimalStorageTempMax: 25,
      respirationRate: 'None',
      storageCondition: 'Ambient (20-25°C)',
      fatOxidationRisk: 'Low',
      description: '',
      tags: '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (comm) => {
    setEditingId(comm._id);
    setFormData({
      name: comm.name || '',
      category: comm.category || 'Fresh Produce',
      subCategory: comm.subCategory || '',
      baselineShelfLifeDays: comm.baselineShelfLifeDays || 10,
      targetShelfLifeDays: comm.targetShelfLifeDays || 30,
      moistureSensitivity: comm.moistureSensitivity || 'Medium',
      oxygenSensitivity: comm.oxygenSensitivity || 'Medium',
      lightSensitivity: comm.lightSensitivity || 'Low',
      temperatureSensitivity: comm.temperatureSensitivity || 'Medium',
      optimalStorageTempMin: comm.optimalStorageTempMin ?? 4,
      optimalStorageTempMax: comm.optimalStorageTempMax ?? 25,
      respirationRate: comm.respirationRate || 'None',
      storageCondition: comm.storageCondition || 'Ambient (20-25°C)',
      fatOxidationRisk: comm.fatOxidationRisk || 'Low',
      description: comm.description || '',
      tags: (comm.tags || []).join(', '),
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteCommodity(id);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.name.trim()) {
      setFormError('Commodity name is required.');
      return;
    }

    setSubmitting(true);
    const payload = {
      ...formData,
      baselineShelfLifeDays: Number(formData.baselineShelfLifeDays),
      targetShelfLifeDays: Number(formData.targetShelfLifeDays),
      optimalStorageTempMin: Number(formData.optimalStorageTempMin),
      optimalStorageTempMax: Number(formData.optimalStorageTempMax),
      tags: typeof formData.tags === 'string' ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : formData.tags,
    };

    let res;
    if (editingId) {
      res = await updateCommodity(editingId, payload);
    } else {
      res = await createCommodity(payload);
    }

    setSubmitting(false);
    if (res.success) {
      setModalOpen(false);
    } else {
      setFormError(res.message);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Apple className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Food Commodities Catalog</h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Manage food vulnerability parameters, respiration rates, and shelf-life baselines.
              </p>
            </div>

            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Food Commodity</span>
            </button>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="space-y-3">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by commodity name, subcategory, or tags..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs border border-slate-200 dark:border-slate-700 transition"
              >
                Search
              </button>
            </form>

            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedCat === cat
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Commodity Cards Grid */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
              <p className="text-xs text-slate-500 dark:text-slate-400">Loading food commodities database...</p>
            </div>
          ) : commodities.length === 0 ? (
            <div className="py-16 text-center space-y-2 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <Apple className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No food commodities found.</p>
              <p className="text-xs text-slate-500 dark:text-slate-500">Try adjusting search filters or add a new commodity above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {commodities.map((comm) => {
                return (
                  <div
                    key={comm._id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition shadow-sm dark:shadow-md flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge variant="emerald">{comm.category}</Badge>
                        <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                          {comm.storageCondition?.split(' ')[0]}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                        {comm.name}
                      </h3>
                      {comm.subCategory && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{comm.subCategory}</p>
                      )}

                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                        {comm.description || 'No description provided.'}
                      </p>

                      {/* Food Science Properties Matrix */}
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                        <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                          <span>Shelf Life: <strong className="text-slate-900 dark:text-white">{comm.baselineShelfLifeDays}d</strong></span>
                        </div>

                        <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                          <Thermometer className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                          <span>Temp: <strong className="text-slate-900 dark:text-white">{comm.optimalStorageTempMin}° to {comm.optimalStorageTempMax}°C</strong></span>
                        </div>

                        <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                          <Wind className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 flex-shrink-0" />
                          <span>Respiration: <strong className="text-slate-900 dark:text-white">{comm.respirationRate}</strong></span>
                        </div>

                        <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                          <span className="text-teal-600 dark:text-teal-400 font-bold">O₂:</span>
                          <span className={comm.oxygenSensitivity === 'Critical' ? 'text-red-500 dark:text-red-400 font-bold' : 'text-slate-700 dark:text-slate-200'}>
                            {comm.oxygenSensitivity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleOpenEdit(comm)}
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Edit Commodity"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(comm._id, comm.name)}
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Delete Commodity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => router.push(`/recommend?commodityId=${comm._id}`)}
                        className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-500 hover:text-white dark:hover:text-slate-950 text-emerald-700 dark:text-emerald-400 font-bold rounded-lg text-xs border border-emerald-200 dark:border-emerald-500/30 transition flex items-center space-x-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Recommend</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add / Edit Commodity Modal */}
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title={editingId ? 'Edit Food Commodity' : 'Add New Food Commodity'}
            subtitle="Configure degradation kinetics, sensitivities, and storage parameters"
            maxWidth="max-w-2xl"
          >
            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-500 dark:text-red-400 font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Commodity Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Fresh Paneer / Salem Turmeric"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Sub-Category / Processing Type</label>
                  <input
                    type="text"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    placeholder="e.g. Ground spice / Cultured dairy"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Storage Condition</label>
                  <select
                    value={formData.storageCondition}
                    onChange={(e) => setFormData({ ...formData, storageCondition: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Ambient (20-25°C)">Ambient (20-25°C)</option>
                    <option value="Chilled (0-4°C)">Chilled (0-4°C)</option>
                    <option value="Frozen (-18°C)">Frozen (-18°C)</option>
                    <option value="Controlled Atmosphere (CA/MAP)">Controlled Atmosphere (CA/MAP)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Baseline Shelf Life (Days) *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.baselineShelfLifeDays}
                    onChange={(e) => setFormData({ ...formData, baselineShelfLifeDays: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Shelf Life (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.targetShelfLifeDays}
                    onChange={(e) => setFormData({ ...formData, targetShelfLifeDays: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Respiration Rate</label>
                  <select
                    value={formData.respirationRate}
                    onChange={(e) => setFormData({ ...formData, respirationRate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="None">None (Processed / Dry)</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Very High">Very High (Mushroom/Berries)</option>
                  </select>
                </div>
              </div>

              {/* Sensitivities Grid */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-300 mb-3">Vulnerability Sensitivities</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-600 dark:text-slate-400 mb-1">Oxygen (O₂)</label>
                    <select
                      value={formData.oxygenSensitivity}
                      onChange={(e) => setFormData({ ...formData, oxygenSensitivity: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-slate-200"
                    >
                      {SENSITIVITIES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-600 dark:text-slate-400 mb-1">Moisture (H₂O)</label>
                    <select
                      value={formData.moistureSensitivity}
                      onChange={(e) => setFormData({ ...formData, moistureSensitivity: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-slate-200"
                    >
                      {SENSITIVITIES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-600 dark:text-slate-400 mb-1">Light / UV</label>
                    <select
                      value={formData.lightSensitivity}
                      onChange={(e) => setFormData({ ...formData, lightSensitivity: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-slate-200"
                    >
                      {SENSITIVITIES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-600 dark:text-slate-400 mb-1">Fat Oxidation</label>
                    <select
                      value={formData.fatOxidationRisk}
                      onChange={(e) => setFormData({ ...formData, fatOxidationRisk: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-slate-200"
                    >
                      {SENSITIVITIES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description & Degradation Pathways</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe spoilage mechanisms (e.g. lipid oxidation, microbial growth, moisture caking)..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. dairy, paneer, perishable, chilled"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition disabled:opacity-50 flex items-center space-x-1.5 shadow-md shadow-emerald-500/20"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{editingId ? 'Save Changes' : 'Create Commodity'}</span>
                </button>
              </div>
            </form>
          </Modal>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
