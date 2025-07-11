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
  getAllTasks: () => Task[];

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

      getAllTasks: () => {
        const { tasks } = get();
        return tasks;
      },

      setTasks: (tasks) => set({ tasks }),

      fetchTasks: async (projectId?: string) => {
        try {
          set({ loading: true, error: null });
          const response = await TaskApiService.getTasks(projectId);
          set({ tasks: response.data, loading: false });
        } catch (error) {
          set({ error: error as AppError, loading: false });
          throw error;
        }
      },

      fetchTasksByProject: async (projectId: string) => {
        try {
          set({ loading: true, error: null });
          const response = await TaskApiService.getTasksByProject(projectId);
          set({ tasks: response.data, loading: false });
        } catch (error) {
          set({ error: error as AppError, loading: false });
          throw error;
        }
      },

      createTask: async (taskData: CreateTaskRequest) => {
        try {
          set({ loading: true, error: null });
          await TaskApiService.createTask(taskData);

          // Fetch lại tasks sau khi tạo
          if (taskData.projectId) {
            await get().fetchTasksByProject(taskData.projectId);
          } else {
            await get().fetchTasks();
          }
        } catch (error) {
          set({ error: error as AppError, loading: false });
          throw error;
        }
      },

      updateTask: async (id: string, updates: UpdateTaskRequest) => {
        try {
          set({ loading: true, error: null });
          await TaskApiService.updateTask(id, updates);

          // Fetch lại tasks sau khi cập nhật
          const currentTask = get().tasks.find((task) => task.id === id);
          if (currentTask?.projectId) {
            await get().fetchTasksByProject(currentTask.projectId);
          } else {
            await get().fetchTasks();
          }
        } catch (error) {
          set({ error: error as AppError, loading: false });
          throw error;
        }
      },

      deleteTask: async (id: string) => {
        try {
          set({ loading: true, error: null });
          await TaskApiService.deleteTask(id);

          // Fetch lại tasks sau khi xóa
          const currentTask = get().tasks.find((task) => task.id === id);
          if (currentTask?.projectId) {
            await get().fetchTasksByProject(currentTask.projectId);
          } else {
            await get().fetchTasks();
          }
        } catch (error) {
          set({ error: error as AppError, loading: false });
          throw error;
        }
      },
    }),
    {
      name: 'task-storage',
      partialize: (state) => ({ tasks: state.tasks }), // Only persist tasks, not loading/error states
    },
  ),
);
