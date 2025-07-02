import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Project } from '~types/project';

export const PROJECT_STORAGE_NAME = 'project_storage';

interface ProjectState {
  projects: Project[];
  createProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setProjects: (projects: Project[]) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],

      createProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
        })),

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, ...updates } : project,
          ),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        })),

      setProjects: (projects) => set({ projects }),
    }),
    {
      name: PROJECT_STORAGE_NAME,
    },
  ),
);
