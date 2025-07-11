import { AppSetting } from '~types/app';

import { ApiResponse, apiClient } from './client';

export interface UpdateSettingsRequest {
  theme?: string;
  showCompletedTasks?: boolean;
  favoriteIcons?: string[];
  recentIcons?: string[];
}

export class SettingsApiService {
  static async getSettings(): Promise<ApiResponse<AppSetting>> {
    return apiClient.get<AppSetting>('/settings');
  }

  static async updateSettings(updates: UpdateSettingsRequest): Promise<ApiResponse<AppSetting>> {
    return apiClient.put<AppSetting>('/settings', updates);
  }

  static async addFavoriteIcon(iconName: string): Promise<ApiResponse<AppSetting>> {
    return apiClient.post<AppSetting>('/settings/favorite-icons', { iconName });
  }

  static async removeFavoriteIcon(iconName: string): Promise<ApiResponse<AppSetting>> {
    return apiClient.delete<AppSetting>(`/settings/favorite-icons/${iconName}`);
  }

  static async addRecentIcon(iconName: string): Promise<ApiResponse<AppSetting>> {
    return apiClient.post<AppSetting>('/settings/recent-icons', { iconName });
  }
}
