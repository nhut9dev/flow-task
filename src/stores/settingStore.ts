import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { THEME } from '~constants/theme';
import { AppSetting } from '~types/app';

export const SETTING_STORAGE_NAME = 'setting_storage';

interface SettingsState {
  appSetting: AppSetting;
  updateSetting: (updates: Partial<AppSetting>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      appSetting: {
        theme: THEME.LIGHT,
        showCompletedTasks: true,
      },
      updateSetting: (updates) =>
        set((state) => ({
          appSetting: { ...state.appSetting, ...updates },
        })),
    }),
    {
      name: SETTING_STORAGE_NAME,
    },
  ),
);
