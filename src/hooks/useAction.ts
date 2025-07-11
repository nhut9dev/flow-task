'use client';

import { useTaskFocusStore } from '~stores/taskFocusStore';

export function useAction() {
  const { focusedTaskId, setFocusedTask, clearFocus } = useTaskFocusStore();
  const isTaskFocused = Boolean(focusedTaskId);

  return {
    isTaskFocused,
    taskId: focusedTaskId,
    setFocusedTask,
    clearFocus,
  };
}
