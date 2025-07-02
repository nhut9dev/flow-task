'use client';

import { useParams } from 'next/navigation';

export function useAction() {
  const params = useParams();

  const taskId = (params as any)?.taskId as string | undefined;
  const isTaskFocused = Boolean(taskId);

  return { isTaskFocused, taskId };
}
