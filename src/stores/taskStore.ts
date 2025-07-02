import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Task } from '~types/task';

interface TaskState {
  tasks: Task[];
  createTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setTasks: (tasks: Task[]) => void;
  getTasksByProjectId: (projectId: string) => Task[];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      getTasksByProjectId: (projectId: string) => {
        const { tasks } = get();
        return tasks.filter((task) => task.projectId === projectId);
      },

      createTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      setTasks: (tasks) => set({ tasks }),
    }),
    {
      name: 'task-storage',
    },
  ),
);
