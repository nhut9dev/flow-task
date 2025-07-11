import { Folder } from '~types/folder';

import { ApiResponse, apiClient } from './client';

export interface CreateFolderRequest {
  name: string;
  icon?: string;
}

export interface UpdateFolderRequest extends Partial<CreateFolderRequest> {
  projectIds?: string[];
}

export class FolderApiService {
  static async getFolders(): Promise<ApiResponse<Folder[]>> {
    return apiClient.get<Folder[]>('/folders');
  }

  static async getFolderById(id: string): Promise<ApiResponse<Folder>> {
    return apiClient.get<Folder>(`/folders/${id}`);
  }

  static async createFolder(folder: CreateFolderRequest): Promise<ApiResponse<Folder>> {
    return apiClient.post<Folder>('/folders', folder);
  }

  static async updateFolder(
    id: string,
    updates: UpdateFolderRequest,
  ): Promise<ApiResponse<Folder>> {
    return apiClient.put<Folder>(`/folders/${id}`, updates);
  }

  static async deleteFolder(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/folders/${id}`);
  }
}
