import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Folder } from '~/types';

export const FOLDER_STORAGE_NAME = 'folder_storage';

interface FolderState {
  folders: Folder[];
  createFolder: (folder: Folder) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  setFolders: (folders: Folder[]) => void;
}

export const useFolderStore = create<FolderState>()(
  persist(
    (set) => ({
      folders: [],

      createFolder: (folder) =>
        set((state) => ({
          folders: [...state.folders, folder],
        })),

      updateFolder: (id, updates) =>
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, ...updates } : folder,
          ),
        })),

      deleteFolder: (id) =>
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id),
        })),

      setFolders: (folders) => set({ folders }),
    }),
    {
      name: FOLDER_STORAGE_NAME,
    },
  ),
);
