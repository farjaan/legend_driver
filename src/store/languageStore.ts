import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppLanguage = 'en' | 'ar';

interface LanguageState {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    set => ({
      language: 'en',
      setLanguage: language => set({ language }),
    }),
    {
      name: 'legend-driver-language',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ language: state.language }),
    },
  ),
);
