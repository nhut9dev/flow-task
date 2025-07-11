import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { CreateTaskRequest, TaskApiService, UpdateTaskRequest } from '~lib/api/tasks';
import { AppError } from '~lib/errors/AppError';
import { Task } from '~types/task';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: AppError | null;

  // Actions
  fetchTasks: (projectId?: string) => Promise<void>;
  fetchTasksByProject: (projectId: string) => Promise<void>;
  createTask: (taskData: CreateTaskRequest) => Promise<void>;
  updateTask: (id: string, updates: UpdateTaskRequest) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // Local state management (for optimistic updates)
  setTasks: (tasks: Task[]) => void;
  getTasksByProjectId: (projectId: string) => Task[];

  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: AppError | null) => void;
  clearError: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      loading: false,
      error: null,

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      getTasksByProjectId: (projectId: string) => {
        const { tasks } = get();
        return tasks.filter((task) => task.projectId === projectId);
      },

      setTasks: (tasks) => set({ tasks }),

      fetchTasks: async (projectId?: string) => {
        try {
          set({ loading: true, error: null });
          const response = await TaskApiService.getTasks(projectId);
          set({ tasks: response.data, loading: false });
        } catch (error) {
          const appError =
            error instanceof AppError ? error : new AppError('Failed to fetch tasks', 500);
          set({ error: appError, loading: false });
          throw appError;
        }
      },

      fetchTasksByProject: async (projectId: string) => {
        try {
          set({ loading: true, error: null });
          const response = await TaskApiService.getTasksByProject(projectId);
          set({ tasks: response.data, loading: false });
        } catch (error) {
          const appError =
            error instanceof AppError ? error : new AppError('Failed to fetch project tasks', 500);
          set({ error: appError, loading: false });
          throw appError;
        }
      },

      createTask: async (taskData: CreateTaskRequest) => {
        try {
          set({ loading: true, error: null });
          const response = await TaskApiService.createTask(taskData);

          // Optimistic update
          set((state) => ({
            tasks: [...state.tasks, response.data],
            loading: false,
          }));
        } catch (error) {
          const appError =
            error instanceof AppError ? error : new AppError('Failed to create task', 500);
          set({ error: appError, loading: false });
          throw appError;
        }
      },

      updateTask: async (id: string, updates: UpdateTaskRequest) => {
        try {
          set({ loading: true, error: null });
          const response = await TaskApiService.updateTask(id, updates);

          // Optimistic update
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, ...response.data } : task,
            ),
            loading: false,
          }));
        } catch (error) {
          const appError =
            error instanceof AppError ? error : new AppError('Failed to update task', 500);
          set({ error: appError, loading: false });
          throw appError;
        }
      },

      deleteTask: async (id: string) => {
        try {
          set({ loading: true, error: null });
          await TaskApiService.deleteTask(id);

          // Optimistic update
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
            loading: false,
          }));
        } catch (error) {
          const appError =
            error instanceof AppError ? error : new AppError('Failed to delete task', 500);
          set({ error: appError, loading: false });
          throw appError;
        }
      },
    }),
    {
      name: 'task-storage',
      partialize: (state) => ({ tasks: state.tasks }), // Only persist tasks, not loading/error states
    },
  ),
);
