import { create } from 'zustand';
import api from '../services/api';

export const useRecommendationStore = create((set, get) => ({
  recommendations: [],
  currentRecommendation: null,
  isGenerating: false,
  agentEvents: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,

  generateRecommendation: async ({ commodityId, priorities, targetShelfLifeDays, targetMarket, preferredPackageType }) => {
    set({ isGenerating: true, error: null, agentEvents: [] });
    try {
      const res = await api.post('/recommendations', {
        commodityId,
        priorities,
        targetShelfLifeDays,
        targetMarket,
        preferredPackageType,
      });

      const recommendation = res.data.recommendation;
      set({
        currentRecommendation: recommendation,
        isGenerating: false,
        agentEvents: recommendation.agentTimeline || [],
      });
      return { success: true, recommendation };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to generate recommendation';
      set({ error: message, isGenerating: false });
      return { success: false, message };
    }
  },

  fetchRecommendations: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/recommendations', { params: { page, limit: 20 } });
      set({
        recommendations: res.data.recommendations,
        total: res.data.total,
        page: res.data.page,
        loading: false,
      });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch history', loading: false });
    }
  },

  fetchById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/recommendations/${id}`);
      set({ currentRecommendation: res.data.recommendation, loading: false });
      return res.data.recommendation;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load report', loading: false });
      return null;
    }
  },

  deleteRecommendation: async (id) => {
    try {
      await api.delete(`/recommendations/${id}`);
      set((state) => ({
        recommendations: state.recommendations.filter((r) => r._id !== id),
        total: state.total - 1,
      }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete' };
    }
  },

  addAgentEvent: (event) => {
    set((state) => ({ agentEvents: [...state.agentEvents, event] }));
  },

  clearCurrent: () => set({ currentRecommendation: null, agentEvents: [] }),
}));
