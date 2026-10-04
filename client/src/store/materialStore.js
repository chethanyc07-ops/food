import { create } from 'zustand';
import api from '../services/api';

export const useMaterialStore = create((set, get) => ({
  materials: [],
  selectedMaterial: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  activeCategory: 'All',
  searchQuery: '',
  compostableOnly: false,
  fssaiOnly: false,

  fetchMaterials: async ({ category, compostable, fssaiOnly, search, page = 1 } = {}) => {
    set({ loading: true, error: null });
    try {
      const activeCat = category !== undefined ? category : get().activeCategory;
      const activeComp = compostable !== undefined ? compostable : get().compostableOnly;
      const activeFssai = fssaiOnly !== undefined ? fssaiOnly : get().fssaiOnly;
      const activeSearch = search !== undefined ? search : get().searchQuery;

      const res = await api.get('/materials', {
        params: {
          category: activeCat,
          compostable: activeComp ? 'true' : undefined,
          fssaiOnly: activeFssai ? 'true' : undefined,
          search: activeSearch,
          page,
          limit: 50,
        },
      });

      set({
        materials: res.data.materials,
        total: res.data.total,
        page: res.data.page,
        activeCategory: activeCat,
        compostableOnly: activeComp,
        fssaiOnly: activeFssai,
        searchQuery: activeSearch,
        loading: false,
      });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch materials', loading: false });
    }
  },

  createMaterial: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/materials', data);
      await get().fetchMaterials();
      return { success: true, material: res.data.material };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create material';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  updateMaterial: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/materials/${id}`, data);
      await get().fetchMaterials();
      return { success: true, material: res.data.material };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update material';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  deleteMaterial: async (id) => {
    try {
      await api.delete(`/materials/${id}`);
      set((state) => ({
        materials: state.materials.filter((m) => m._id !== id),
        total: state.total - 1,
      }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete' };
    }
  },

  selectMaterial: (material) => set({ selectedMaterial: material }),
}));
