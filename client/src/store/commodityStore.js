import { create } from 'zustand';
import api from '../services/api';

export const useCommodityStore = create((set, get) => ({
  commodities: [],
  selectedCommodity: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  activeCategory: 'All',
  searchQuery: '',

  fetchCommodities: async ({ category, search, page = 1 } = {}) => {
    set({ loading: true, error: null });
    try {
      const activeCat = category !== undefined ? category : get().activeCategory;
      const activeSearch = search !== undefined ? search : get().searchQuery;

      const res = await api.get('/commodities', {
        params: {
          category: activeCat,
          search: activeSearch,
          page,
          limit: 50,
        },
      });

      set({
        commodities: res.data.commodities,
        total: res.data.total,
        page: res.data.page,
        activeCategory: activeCat,
        searchQuery: activeSearch,
        loading: false,
      });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch commodities', loading: false });
    }
  },

  createCommodity: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/commodities', data);
      await get().fetchCommodities();
      return { success: true, commodity: res.data.commodity };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create commodity';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  updateCommodity: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/commodities/${id}`, data);
      await get().fetchCommodities();
      return { success: true, commodity: res.data.commodity };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update commodity';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  deleteCommodity: async (id) => {
    try {
      await api.delete(`/commodities/${id}`);
      set((state) => ({
        commodities: state.commodities.filter((c) => c._id !== id),
        total: state.total - 1,
      }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete' };
    }
  },

  selectCommodity: (commodity) => set({ selectedCommodity: commodity }),
}));
