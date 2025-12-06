import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemeSetting = 'light' | 'dark';

type PreferencesState = {
  theme: ThemeSetting;
  notificationsEnabled: boolean;
  hydrated: boolean;
  setTheme: (theme: ThemeSetting) => void;
  toggleTheme: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setHydrated: (value: boolean) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      notificationsEnabled: false,
      hydrated: false,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: 'preferences-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        theme: state.theme,
        notificationsEnabled: state.notificationsEnabled,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

