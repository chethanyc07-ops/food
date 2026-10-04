import { create } from 'zustand';

export const useThemeStore = create((set, get) => ({
  theme: 'dark', // SSR default

  initTheme: () => {
    if (typeof window === 'undefined') return;
    const savedTheme = localStorage.getItem('foodpack_theme');
    let activeTheme = 'dark';
    if (savedTheme === 'light' || savedTheme === 'dark') {
      activeTheme = savedTheme;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      activeTheme = prefersDark ? 'dark' : 'light';
    }
    
    set({ theme: activeTheme });
    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  toggleTheme: () => {
    const current = get().theme;
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    if (typeof window !== 'undefined') {
      localStorage.setItem('foodpack_theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme: nextTheme });
  },

  setTheme: (newTheme) => {
    if (newTheme !== 'dark' && newTheme !== 'light') return;
    if (typeof window !== 'undefined') {
      localStorage.setItem('foodpack_theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme: newTheme });
  },
}));
