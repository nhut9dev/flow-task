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
    (set) => ({
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
          const appError =
            error instanceof AppError ? error : new AppError('Failed to fetch projects', 500);
          set({ error: appError, loading: false });
          throw appError;
        }
      },

      fetchProjectsByFolder: async (folderId: string) => {
        try {
          set({ loading: true, error: null });
          const response = await ProjectApiService.getProjectsByFolder(folderId);
          set({ projects: response.data, loading: false });
        } catch (error) {
          const appError =
            error instanceof AppError
              ? error
              : new AppError('Failed to fetch folder projects', 500);
          set({ error: appError, loading: false });
          throw appError;
        }
      },

      createProject: async (projectData: CreateProjectRequest) => {
        try {
          set({ loading: true, error: null });
          const response = await ProjectApiService.createProject(projectData);

          // Optimistic update
          set((state) => ({
            projects: [...state.projects, response.data],
            loading: false,
          }));
        } catch (error) {
          const appError =
            error instanceof AppError ? error : new AppError('Failed to create project', 500);
          set({ error: appError, loading: false });
          throw appError;
        }
      },

      updateProject: async (id: string, updates: UpdateProjectRequest) => {
        try {
          set({ loading: true, error: null });
          const response = await ProjectApiService.updateProject(id, updates);

          // Optimistic update
          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === id ? { ...project, ...response.data } : project,
            ),
            loading: false,
          }));
        } catch (error) {
          const appError =
            error instanceof AppError ? error : new AppError('Failed to update project', 500);
          set({ error: appError, loading: false });
          throw appError;
        }
      },

      deleteProject: async (id: string) => {
        try {
          set({ loading: true, error: null });
          await ProjectApiService.deleteProject(id);

          // Optimistic update
          set((state) => ({
            projects: state.projects.filter((project) => project.id !== id),
            loading: false,
          }));
        } catch (error) {
          const appError =
            error instanceof AppError ? error : new AppError('Failed to delete project', 500);
          set({ error: appError, loading: false });
          throw appError;
        }
      },
    }),
    {
      name: 'project-storage',
      partialize: (state) => ({ projects: state.projects }), // Only persist projects, not loading/error states
    },
  ),
);
