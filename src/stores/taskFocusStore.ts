import { create } from 'zustand';

interface TaskFocusState {
  focusedTaskId: string | null;
  setFocusedTask: (taskId: string | null) => void;
  clearFocus: () => void;
}

export const useTaskFocusStore = create<TaskFocusState>((set) => ({
  focusedTaskId: null,
  setFocusedTask: (taskId) => set({ focusedTaskId: taskId }),
  clearFocus: () => set({ focusedTaskId: null }),
}));
