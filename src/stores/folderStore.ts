import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { CreateFolderRequest, FolderApiService, UpdateFolderRequest } from '~lib/api/folders';
import { AppError } from '~lib/errors/AppError';
import { Folder } from '~types/folder';

interface FolderState {
  folders: Folder[];
  loading: boolean;
  error: AppError | null;

  // Actions
  fetchFolders: () => Promise<void>;
  createFolder: (folderData: CreateFolderRequest) => Promise<void>;
  updateFolder: (id: string, updates: UpdateFolderRequest) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;

  // Local state management
  setFolders: (folders: Folder[]) => void;

  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: AppError | null) => void;
  clearError: () => void;
}

export const useFolderStore = create<FolderState>()(
  persist(
    (set, get) => ({
      folders: [],
      loading: false,
      error: null,

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      setFolders: (folders) => set({ folders }),

      fetchFolders: async () => {
        try {
          set({ loading: true, error: null });
          const response = await FolderApiService.getFolders();
          set({ folders: response.data, loading: false });
        } catch (error) {
          set({ error: error as AppError, loading: false });
          throw error;
        }
      },

      createFolder: async (folderData: CreateFolderRequest) => {
        try {
          set({ loading: true, error: null });
          await FolderApiService.createFolder(folderData);

          // Fetch lại toàn bộ folders sau khi tạo
          await get().fetchFolders();
        } catch (error) {
          set({ error: error as AppError, loading: false });
          throw error;
        }
      },

      updateFolder: async (id: string, updates: UpdateFolderRequest) => {
        try {
          set({ loading: true, error: null });
          await FolderApiService.updateFolder(id, updates);

          // Fetch lại toàn bộ folders sau khi cập nhật
          await get().fetchFolders();
        } catch (error) {
          set({ error: error as AppError, loading: false });
          throw error;
        }
      },

      deleteFolder: async (id: string) => {
        try {
          set({ loading: true, error: null });
          await FolderApiService.deleteFolder(id);

          // Fetch lại toàn bộ folders sau khi xóa
          await get().fetchFolders();
        } catch (error) {
          set({ error: error as AppError, loading: false });
          throw error;
        }
      },
    }),
    {
      name: 'folder-storage',
      partialize: (state) => ({ folders: state.folders }), // Only persist folders, not loading/error states
    },
  ),
);
