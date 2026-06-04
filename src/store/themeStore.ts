import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemePreference } from '@theme/index';

interface ThemeState {
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      themePreference: 'system',
      setThemePreference: pref => set({ themePreference: pref }),
    }),
    {
      name: 'legend-driver-theme',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ themePreference: state.themePreference }),
    },
  ),
);
