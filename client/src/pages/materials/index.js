import React, { useState, useEffect } from 'react';
import Layout from '../../components/AppShell/Layout';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import Modal from '../../components/Common/Modal';
import Badge from '../../components/Common/Badge';
import { useMaterialStore } from '../../store/materialStore';
import {
  Layers,
  Search,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  Loader2,
  Sparkles
} from 'lucide-react';

const MATERIAL_CATEGORIES = [
  'All',
  'Flexible Plastic (Polyolefins)',
  'High-Barrier Barrier Laminate',
  'Biodegradable & Bio-polymers',
  'Metal & Aluminium Foil Laminate',
  'Rigid Plastic & Containers',
  'Glass & Hermetic Containers',
  'Paper & Coated Paperboard',
  'Active & MAP Smart Packaging',
];

export default function MaterialsPage() {
  const {
    materials,
    fetchMaterials,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    loading,
  } = useMaterialStore();

  const [selectedCat, setSelectedCat] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [compostableOnly, setCompostableOnly] = useState(false);
  const [fssaiOnly, setFssaiOnly] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    tradeName: '',
    category: 'Flexible Plastic (Polyolefins)',
    description: '',
    oxygenBarrier: 'Good',
    otrValue: 5.0,
    moistureBarrier: 'Good',
    wvtrValue: 2.0,
    lightBarrier: 'Moderate (40-70%)',
    lightTransmissionPercent: 30,
    minTemp: -20,
    maxTemp: 100,
    costIndex: 5,
    costPerKg: 220,
    recyclabilityScore: 7,
    compostable: false,
    fdaApproved: true,
    fssaiCompliant: true,
    activeScavengerType: 'None',
    punctureResistance: 'High',
    applications: '',
    sustainabilityNotes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchMaterials({
      category: selectedCat,
      compostable: compostableOnly,
      fssaiOnly,
      search: searchTerm,
    });
  }, [selectedCat, compostableOnly, fssaiOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMaterials({
      category: selectedCat,
      compostable: compostableOnly,
      fssaiOnly,
      search: searchTerm,
    });
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      tradeName: '',
      category: 'Flexible Plastic (Polyolefins)',
      description: '',
      oxygenBarrier: 'Good',
      otrValue: 5.0,
      moistureBarrier: 'Good',
      wvtrValue: 2.0,
      lightBarrier: 'Moderate (40-70%)',
      lightTransmissionPercent: 30,
      minTemp: -20,
      maxTemp: 100,
      costIndex: 5,
      costPerKg: 220,
      recyclabilityScore: 7,
      compostable: false,
      fdaApproved: true,
      fssaiCompliant: true,
      activeScavengerType: 'None',
      punctureResistance: 'High',
      applications: '',
      sustainabilityNotes: '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (mat) => {
    setEditingId(mat._id);
    setFormData({
      name: mat.name || '',
      tradeName: mat.tradeName || '',
      category: mat.category || 'Flexible Plastic (Polyolefins)',
      description: mat.description || '',
      oxygenBarrier: mat.oxygenBarrier || 'Good',
      otrValue: mat.otrValue ?? 5.0,
      moistureBarrier: mat.moistureBarrier || 'Good',
      wvtrValue: mat.wvtrValue ?? 2.0,
      lightBarrier: mat.lightBarrier || 'Moderate (40-70%)',
      lightTransmissionPercent: mat.lightTransmissionPercent ?? 30,
      minTemp: mat.minTemp ?? -20,
      maxTemp: mat.maxTemp ?? 100,
      costIndex: mat.costIndex ?? 5,
      costPerKg: mat.costPerKg ?? 220,
      recyclabilityScore: mat.recyclabilityScore ?? 7,
      compostable: Boolean(mat.compostable),
      fdaApproved: mat.fdaApproved ?? true,
      fssaiCompliant: mat.fssaiCompliant ?? true,
      activeScavengerType: mat.activeScavengerType || 'None',
      punctureResistance: mat.punctureResistance || 'High',
      applications: (mat.applications || []).join(', '),
      sustainabilityNotes: mat.sustainabilityNotes || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteMaterial(id);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.name.trim()) {
      setFormError('Material name is required.');
      return;
    }

    setSubmitting(true);
    const payload = {
      ...formData,
      otrValue: Number(formData.otrValue),
      wvtrValue: Number(formData.wvtrValue),
      lightTransmissionPercent: Number(formData.lightTransmissionPercent),
      minTemp: Number(formData.minTemp),
      maxTemp: Number(formData.maxTemp),
      costIndex: Number(formData.costIndex),
      costPerKg: Number(formData.costPerKg),
      recyclabilityScore: Number(formData.recyclabilityScore),
      applications: typeof formData.applications === 'string' ? formData.applications.split(',').map((a) => a.trim()).filter(Boolean) : formData.applications,
    };

    let res;
    if (editingId) {
      res = await updateMaterial(editingId, payload);
    } else {
      res = await createMaterial(payload);
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
                <Layers className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Packaging Materials Database</h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                ASTM barrier ratings, oxygen/moisture transmission specs, and circularity indicators.
              </p>
            </div>

            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Packaging Material</span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search materials, trade names, applications..."
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

              {/* Toggles */}
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none bg-white dark:bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <input
                    type="checkbox"
                    checked={compostableOnly}
                    onChange={(e) => setCompostableOnly(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-white dark:bg-slate-800"
                  />
                  <span>🌱 Compostable Only</span>
                </label>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {MATERIAL_CATEGORIES.map((cat) => (
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

          {/* Material Cards Grid */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
              <p className="text-xs text-slate-500 dark:text-slate-400">Loading packaging materials database...</p>
            </div>
          ) : materials.length === 0 ? (
            <div className="py-16 text-center space-y-2 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <Layers className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No packaging materials matched your query.</p>
              <p className="text-xs text-slate-500">Reset filters or create a custom material above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map((mat) => (
                <div
                  key={mat._id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition shadow-sm dark:shadow-md flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant={mat.compostable ? 'bio' : 'emerald'}>
                        {mat.compostable ? '🌱 100% Compostable' : mat.category}
                      </Badge>
                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20">
                        {mat.recyclabilityScore}/10 Recyclable
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                      {mat.name}
                    </h3>
                    {mat.tradeName && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Commercial Name: {mat.tradeName}</p>
                    )}

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                      {mat.description}
                    </p>

                    {/* Barrier Grid */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                        <p className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400">Oxygen OTR</p>
                        <p className="text-xs font-extrabold text-slate-900 dark:text-slate-200 mt-0.5">
                          {mat.otrValue} <span className="text-[9px] font-normal text-slate-500 dark:text-slate-400">cc/m²·d</span>
                        </p>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                        <p className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400">Moisture WVTR</p>
                        <p className="text-xs font-extrabold text-slate-900 dark:text-slate-200 mt-0.5">
                          {mat.wvtrValue} <span className="text-[9px] font-normal text-slate-500 dark:text-slate-400">g/m²·d</span>
                        </p>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                        <p className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400">Thermal Range</p>
                        <p className="text-xs font-extrabold text-slate-900 dark:text-slate-200 mt-0.5">
                          {mat.minTemp}° to {mat.maxTemp}°C
                        </p>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                        <p className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400">Estimated Cost</p>
                        <p className="text-xs font-extrabold text-slate-900 dark:text-slate-200 mt-0.5">
                          ₹{mat.costPerKg} <span className="text-[9px] font-normal text-slate-500 dark:text-slate-400">/kg</span>
                        </p>
                      </div>
                    </div>

                    {mat.activeScavengerType && mat.activeScavengerType !== 'None' && (
                      <div className="mt-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-[10px] text-emerald-800 dark:text-emerald-300 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600 dark:text-emerald-300" />
                        <span>Active Scavenger: {mat.activeScavengerType}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                      <button
                        onClick={() => handleOpenEdit(mat)}
                        className="p-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Edit Material"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(mat._id, mat.name)}
                        className="p-1.5 rounded-lg hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Delete Material"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>FSSAI Compliant</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add / Edit Material Modal */}
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title={editingId ? 'Edit Packaging Material' : 'Add Packaging Material'}
            subtitle="Configure barrier transmission rates, thermal stability, and circularity specs"
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Material Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. EVOH Barrier Film (PA/EVOH/PE)"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Commercial / Trade Name</label>
                  <input
                    type="text"
                    value={formData.tradeName}
                    onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                    placeholder="e.g. OptiBarrier-9X"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                  >
                    {MATERIAL_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Active Packaging Scavenger</label>
                  <select
                    value={formData.activeScavengerType}
                    onChange={(e) => setFormData({ ...formData, activeScavengerType: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="None">None (Passive Barrier)</option>
                    <option value="Oxygen Scavenger">Active Oxygen Scavenger</option>
                    <option value="Moisture Absorber / Desiccant">Moisture Absorber / Desiccant</option>
                    <option value="Ethylene Absorber">Ethylene Absorber</option>
                    <option value="Antimicrobial / Essential Oil Coating">Antimicrobial / Essential Oil Coating</option>
                    <option value="CO2 Emitter">CO2 Regulating Emitter</option>
                  </select>
                </div>
              </div>

              {/* Barrier Specs */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-300 mb-3">Transmission Barrier Ratings</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-600 dark:text-slate-400 mb-1">OTR (cc/m²·d) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.otrValue}
                      onChange={(e) => setFormData({ ...formData, otrValue: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-slate-200 focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-600 dark:text-slate-400 mb-1">WVTR (g/m²·d) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.wvtrValue}
                      onChange={(e) => setFormData({ ...formData, wvtrValue: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-slate-200 focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-600 dark:text-slate-400 mb-1">Light Trans (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.lightTransmissionPercent}
                      onChange={(e) => setFormData({ ...formData, lightTransmissionPercent: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-slate-200 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-600 dark:text-slate-400 mb-1">Recycle (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.recyclabilityScore}
                      onChange={(e) => setFormData({ ...formData, recyclabilityScore: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-slate-200 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Min Temp (°C)</label>
                  <input
                    type="number"
                    value={formData.minTemp}
                    onChange={(e) => setFormData({ ...formData, minTemp: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Max Temp (°C)</label>
                  <input
                    type="number"
                    value={formData.maxTemp}
                    onChange={(e) => setFormData({ ...formData, maxTemp: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Cost (₹/kg)</label>
                  <input
                    type="number"
                    value={formData.costPerKg}
                    onChange={(e) => setFormData({ ...formData, costPerKg: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-1">
                <label className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.compostable}
                    onChange={(e) => setFormData({ ...formData, compostable: e.target.checked })}
                    className="rounded border-slate-300 dark:border-slate-700 text-emerald-500 bg-white dark:bg-slate-900"
                  />
                  <span>🌱 Certified Compostable / Bio-based</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.fssaiCompliant}
                    onChange={(e) => setFormData({ ...formData, fssaiCompliant: e.target.checked })}
                    className="rounded border-slate-300 dark:border-slate-700 text-emerald-500 bg-white dark:bg-slate-900"
                  />
                  <span>Verified FSSAI Food Contact Safe</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Applications & Best Uses</label>
                <input
                  type="text"
                  value={formData.applications}
                  onChange={(e) => setFormData({ ...formData, applications: e.target.value })}
                  placeholder="e.g. Fresh paneer vacuum pack, smoked meats, cheeses"
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
                  <span>{editingId ? 'Save Changes' : 'Create Material'}</span>
                </button>
              </div>
            </form>
          </Modal>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
