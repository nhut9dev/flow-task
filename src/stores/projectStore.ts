import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { CreateProjectRequest, ProjectApiService, UpdateProjectRequest } from '~lib/api/projects';
import { AppError } from '~lib/errors/AppError';
import { Project } from '~types/project';

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: AppError | null;

  // Actions
  fetchProjects: () => Promise<void>;
  fetchProjectsByFolder: (folderId: string) => Promise<void>;
  createProject: (projectData: CreateProjectRequest) => Promise<void>;
  updateProject: (id: string, updates: UpdateProjectRequest) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Local state management
  setProjects: (projects: Project[]) => void;

  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: AppError | null) => void;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      loading: false,
      error: null,

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      setProjects: (projects) => set({ projects }),

      fetchProjects: async () => {
        try {
          set({ loading: true, error: null });
          const response = await ProjectApiService.getProjects();
          set({ projects: response.data, loading: false });
        } catch (error) {
          set({ error: error as AppError, loading: false });
          throw error;
        }
      },

      fetchProjectsByFolder: async (folderId: string) => {
        try {
          set({ loading: true, error: null });
          const response = await ProjectApiService.getProjectsByFolder(folderId);
          set({ projects: response.data, loading: false });
        } catch (error) {
          set({ error: error as AppError, loading: false });
          throw error;
        }
      },

      createProject: async (projectData: CreateProjectRequest) => {
        try {
          set({ loading: true, error: null });
          await ProjectApiService.createProject(projectData);

          // Fetch lại toàn bộ projects sau khi tạo
          await get().fetchProjects();
        } catch (error) {
          set({ error: error as AppError, loading: false });
          throw error;
        }
      },

      updateProject: async (id: string, updates: UpdateProjectRequest) => {
        try {
          set({ loading: true, error: null });
          await ProjectApiService.updateProject(id, updates);

          // Fetch lại toàn bộ projects sau khi cập nhật
          await get().fetchProjects();
        } catch (error) {
          set({ error: error as AppError, loading: false });
          throw error;
        }
      },

      deleteProject: async (id: string) => {
        try {
          set({ loading: true, error: null });
          await ProjectApiService.deleteProject(id);

          // Fetch lại toàn bộ projects sau khi xóa
          await get().fetchProjects();
        } catch (error) {
          set({ error: error as AppError, loading: false });
          throw error;
        }
      },
    }),
    {
      name: 'project-storage',
      partialize: (state) => ({ projects: state.projects }), // Only persist projects, not loading/error states
    },
  ),
);
