import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { THEME } from '~constants/theme';
import { AppSetting, IconName } from '~types/app';

export const SETTING_STORAGE_NAME = 'setting_storage';
const MAX_RECENT_ICONS = 18;

interface SettingsState {
  appSetting: AppSetting;
  updateSetting: (updates: Partial<AppSetting>) => void;
  addFavoriteIcon: (iconName: IconName) => void;
  removeFavoriteIcon: (iconName: IconName) => void;
  addRecentIcon: (iconName: IconName) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      appSetting: {
        theme: THEME.LIGHT,
        showCompletedTasks: true,
        favoriteIcons: [],
        recentIcons: [],
      },
      updateSetting: (updates) =>
        set((state) => ({
          appSetting: { ...state.appSetting, ...updates },
        })),
      addFavoriteIcon: (iconName) =>
        set((state) => ({
          appSetting: {
            ...state.appSetting,
            favoriteIcons: [...state.appSetting.favoriteIcons, iconName],
          },
        })),
      removeFavoriteIcon: (iconName) =>
        set((state) => ({
          appSetting: {
            ...state.appSetting,
            favoriteIcons: state.appSetting.favoriteIcons.filter((name) => name !== iconName),
          },
        })),
      addRecentIcon: (iconName) =>
        set((state) => {
          const filtered = state.appSetting.recentIcons.filter((name) => name !== iconName);
          const recentIcons = [iconName, ...filtered].slice(0, MAX_RECENT_ICONS);
          return {
            appSetting: {
              ...state.appSetting,
              recentIcons,
            },
          };
        }),
    }),
    {
      name: SETTING_STORAGE_NAME,
    },
  ),
);
