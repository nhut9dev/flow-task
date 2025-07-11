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
    (set) => ({
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
          const appError =
            error instanceof AppError ? error : new AppError('Failed to fetch folders', 500);
          set({ error: appError, loading: false });
          throw appError;
        }
      },

      createFolder: async (folderData: CreateFolderRequest) => {
        try {
          set({ loading: true, error: null });
          const response = await FolderApiService.createFolder(folderData);

          // Optimistic update
          set((state) => ({
            folders: [...state.folders, response.data],
            loading: false,
          }));
        } catch (error) {
          const appError =
            error instanceof AppError ? error : new AppError('Failed to create folder', 500);
          set({ error: appError, loading: false });
          throw appError;
        }
      },

      updateFolder: async (id: string, updates: UpdateFolderRequest) => {
        try {
          set({ loading: true, error: null });
          const response = await FolderApiService.updateFolder(id, updates);

          // Optimistic update
          set((state) => ({
            folders: state.folders.map((folder) =>
              folder.id === id ? { ...folder, ...response.data } : folder,
            ),
            loading: false,
          }));
        } catch (error) {
          const appError =
            error instanceof AppError ? error : new AppError('Failed to update folder', 500);
          set({ error: appError, loading: false });
          throw appError;
        }
      },

      deleteFolder: async (id: string) => {
        try {
          set({ loading: true, error: null });
          await FolderApiService.deleteFolder(id);

          // Optimistic update
          set((state) => ({
            folders: state.folders.filter((folder) => folder.id !== id),
            loading: false,
          }));
        } catch (error) {
          const appError =
            error instanceof AppError ? error : new AppError('Failed to delete folder', 500);
          set({ error: appError, loading: false });
          throw appError;
        }
      },
    }),
    {
      name: 'folder-storage',
      partialize: (state) => ({ folders: state.folders }), // Only persist folders, not loading/error states
    },
  ),
);
